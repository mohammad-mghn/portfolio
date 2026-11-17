/**
 * Cloth effect for a picture: the image hangs like fabric pinned along its top edge. Wind sends
 * slow folds across it, each fold catches a little light, and a stroke of the pointer sends a ring
 * of ripples out from where it passed.
 *
 * Plain WebGL 1 with no dependencies, so it runs in every current browser. The whole thing is a
 * fragment shader over one rectangle: a height field (wind + ripples) gives a slope at each pixel;
 * the slope shifts where the picture is sampled and how bright it is. Nothing here loads until
 * the picture is hovered for the first time (see components/ui/ClothImage.tsx).
 */

/** How many pointer ripples can be alive at once; the oldest is replaced. */
const POKES = 6;
/** Seconds a ripple lives. */
const POKE_LIFE = 3;

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  // 0..1 with the origin at the top left, like the page.
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uCover;
uniform float uAspect;
uniform float uTime;
uniform float uAmp;
uniform vec4 uPoke[${POKES}];
varying vec2 vUv;

float height(vec2 p) {
  // Pinned along the top: no movement there, full movement at the bottom.
  float pin = smoothstep(0.0, 0.9, p.y);
  float h = 0.55 * sin(p.x * 6.5 + p.y * 2.4 - uTime * 2.0)
          + 0.30 * sin(p.x * 12.0 - p.y * 4.5 - uTime * 3.1 + 1.7)
          + 0.16 * sin((p.x * 0.8 + p.y) * 19.0 - uTime * 4.4 + 0.6);
  h *= pin * uAmp;

  vec2 q = vec2(p.x * uAspect, p.y);
  for (int i = 0; i < ${POKES}; i++) {
    vec4 k = uPoke[i];
    float age = uTime - k.z;
    if (k.w > 0.0 && age > 0.0 && age < ${POKE_LIFE}.0) {
      float d = distance(q, vec2(k.x * uAspect, k.y));
      float ring = d - age * 0.5;
      h += k.w * sin(ring * 34.0) * exp(-ring * ring * 55.0) * exp(-age * 1.5);
    }
  }
  return h;
}

void main() {
  float e = 0.004;
  float hx = height(vUv + vec2(e, 0.0)) - height(vUv - vec2(e, 0.0));
  float hy = height(vUv + vec2(0.0, e)) - height(vUv - vec2(0.0, e));
  vec2 slope = vec2(hx, hy) / (2.0 * e);

  vec2 uv = vUv + slope * 0.0021;
  // A slight zoom while it moves, so the shifting edges never show what is outside the picture.
  uv = (uv - 0.5) * (1.0 - 0.045 * uAmp) + 0.5;
  // Same crop as CSS "object-fit: cover".
  uv = (uv - 0.5) * uCover + 0.5;

  vec3 colour = texture2D(uTex, uv).rgb;
  float light = 1.0 + dot(slope, vec2(-0.74, -0.67)) * 0.034;
  gl_FragColor = vec4(colour * clamp(light, 0.55, 1.45), 1.0);
}`;

export type Cloth = {
  /** Pointer is over the picture: the wind picks up. Draws one frame before returning. */
  enter(): void;
  /** Pointer left: the fabric settles, then `onIdle` is called. */
  leave(): void;
  /** A ripple at (x, y), both 0..1 from the top left. */
  poke(x: number, y: number, strength: number): void;
  /** The box changed size. */
  resize(): void;
  destroy(): void;
};

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Sets the effect up on `canvas` (which should cover `img` exactly) and returns its controls, or
 * null when WebGL is not available or the picture cannot be read (then the plain image stays).
 */
export function createCloth(canvas: HTMLCanvasElement, img: HTMLImageElement, onIdle: () => void): Cloth | null {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
  if (!gl) return null;

  const vert = compile(gl, gl.VERTEX_SHADER, VERT);
  const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vert || !frag || !program) return null;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // One rectangle that fills the canvas.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  try {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  } catch {
    // A picture from another origin without permission to be read.
    return null;
  }

  const uCover = gl.getUniformLocation(program, "uCover");
  const uAspect = gl.getUniformLocation(program, "uAspect");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uAmp = gl.getUniformLocation(program, "uAmp");
  const uPoke = gl.getUniformLocation(program, "uPoke");

  const pokes = new Float32Array(POKES * 4);
  let nextPoke = 0;
  let target = 0;
  let amp = 0;
  let running = false;
  let dead = false;
  let raf = 0;
  const started = performance.now();
  let last = 0;

  const resize = () => {
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * ratio);
    canvas.height = Math.round(h * ratio);
    gl.viewport(0, 0, canvas.width, canvas.height);
    const box = w / h;
    const picture = img.naturalWidth / img.naturalHeight || box;
    // Wider picture than box: crop left and right. Taller: crop top and bottom.
    gl.uniform2f(uCover, picture > box ? box / picture : 1, picture > box ? 1 : picture / box);
    gl.uniform1f(uAspect, box);
  };

  const draw = (time: number) => {
    gl.uniform1f(uTime, time);
    gl.uniform1f(uAmp, amp);
    gl.uniform4fv(uPoke, pokes);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const rippling = (time: number) => {
    for (let i = 0; i < POKES; i++) {
      if (pokes[i * 4 + 3] > 0 && time - pokes[i * 4 + 2] < POKE_LIFE) return true;
    }
    return false;
  };

  const frame = (now: number) => {
    if (dead) return;
    const time = (now - started) / 1000;
    const dt = Math.min(0.05, Math.max(0, time - last));
    last = time;
    // Picks up quickly, settles slowly.
    amp += (target - amp) * (1 - Math.exp(-dt * (target ? 3.2 : 2)));
    draw(time);
    if (target === 0 && amp < 0.004 && !rippling(time)) {
      running = false;
      amp = 0;
      onIdle();
      return;
    }
    raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    dead = true;
    running = false;
    cancelAnimationFrame(raf);
  };
  const onLost = (event: Event) => {
    event.preventDefault();
    stop();
    onIdle();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  resize();

  return {
    enter() {
      if (dead) return;
      target = 1;
      if (running) return;
      running = true;
      last = (performance.now() - started) / 1000;
      frame(performance.now());
    },
    leave() {
      target = 0;
    },
    poke(x, y, strength) {
      if (dead) return;
      const i = nextPoke * 4;
      pokes[i] = x;
      pokes[i + 1] = y;
      pokes[i + 2] = (performance.now() - started) / 1000;
      pokes[i + 3] = strength;
      nextPoke = (nextPoke + 1) % POKES;
    },
    resize() {
      if (!dead) resize();
    },
    destroy() {
      stop();
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
