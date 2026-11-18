/**
 * Liquid effect for a heading: the letters are dragged through an invisible fluid that swirls
 * under the pointer. Strokes of the pointer push the fluid, the fluid curls into eddies, and the
 * letters are carried along and slowly drift back. Where the fluid moves, the light splits into
 * red and blue fringes and the letters catch a soft sheen. After the pointer leaves, the fluid
 * settles and the real text takes over again.
 *
 * The idea follows canvasui's Liquid Object, written here from scratch for text and without
 * three.js: a small stable-fluids simulation (splat, vorticity, pressure, advection) in WebGL 2,
 * plus a "field" texture of offsets the fluid carries around. The final pass draws the heading's
 * letters displaced by that field. The letters are drawn onto a texture with the heading's own
 * font, size, spacing and positions, and checked against the page: if the drawing would not
 * match the real text exactly, the effect does not start and the heading stays as it is.
 *
 * Nothing here loads until the heading is hovered for the first time (components/ui/LiquidHeading).
 */

export type Liquid = {
  /** Pointer entered at (x, y), measured from the canvas's top left corner, in CSS pixels. */
  enter(x: number, y: number): void;
  move(x: number, y: number): void;
  leave(): void;
  destroy(): void;
};

/* ───────────────────────── Shaders ───────────────────────── */

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const HEAD = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
`;

const SPLAT = `${HEAD}
uniform sampler2D tTarget;
uniform vec2 uPoint;
uniform vec2 uValue;
uniform float uRadius;
uniform float uAspect;
void main() {
  vec2 d = vUv - uPoint;
  d.x *= uAspect;
  float fall = exp(-dot(d, d) / uRadius);
  fragColor = vec4(texture(tTarget, vUv).xy + uValue * fall, 0.0, 1.0);
}`;

const CURL = `${HEAD}
uniform sampler2D tVelocity;
uniform vec2 uTexel;
void main() {
  float l = texture(tVelocity, vUv - vec2(uTexel.x, 0.0)).y;
  float r = texture(tVelocity, vUv + vec2(uTexel.x, 0.0)).y;
  float b = texture(tVelocity, vUv - vec2(0.0, uTexel.y)).x;
  float t = texture(tVelocity, vUv + vec2(0.0, uTexel.y)).x;
  fragColor = vec4((r - l - t + b) * 0.5, 0.0, 0.0, 1.0);
}`;

const VORTICITY = `${HEAD}
uniform sampler2D tVelocity;
uniform sampler2D tCurl;
uniform vec2 uTexel;
uniform float uCurl;
uniform float uDt;
void main() {
  float l = texture(tCurl, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture(tCurl, vUv + vec2(uTexel.x, 0.0)).x;
  float b = texture(tCurl, vUv - vec2(0.0, uTexel.y)).x;
  float t = texture(tCurl, vUv + vec2(0.0, uTexel.y)).x;
  float c = texture(tCurl, vUv).x;
  vec2 force = vec2(abs(t) - abs(b), abs(r) - abs(l)) * 0.5;
  force /= length(force) + 1e-4;
  force *= uCurl * c;
  force.y *= -1.0;
  vec2 v = texture(tVelocity, vUv).xy + force * uDt;
  fragColor = vec4(clamp(v, -600.0, 600.0), 0.0, 1.0);
}`;

const DIVERGENCE = `${HEAD}
uniform sampler2D tVelocity;
uniform vec2 uTexel;
void main() {
  float l = texture(tVelocity, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture(tVelocity, vUv + vec2(uTexel.x, 0.0)).x;
  float b = texture(tVelocity, vUv - vec2(0.0, uTexel.y)).y;
  float t = texture(tVelocity, vUv + vec2(0.0, uTexel.y)).y;
  fragColor = vec4((r - l + t - b) * 0.5, 0.0, 0.0, 1.0);
}`;

const PRESSURE = `${HEAD}
uniform sampler2D tPressure;
uniform sampler2D tDivergence;
uniform vec2 uTexel;
void main() {
  float l = texture(tPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture(tPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float b = texture(tPressure, vUv - vec2(0.0, uTexel.y)).x;
  float t = texture(tPressure, vUv + vec2(0.0, uTexel.y)).x;
  float d = texture(tDivergence, vUv).x;
  fragColor = vec4((l + r + b + t - d) * 0.25, 0.0, 0.0, 1.0);
}`;

const GRADIENT = `${HEAD}
uniform sampler2D tPressure;
uniform sampler2D tVelocity;
uniform vec2 uTexel;
void main() {
  float l = texture(tPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture(tPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float b = texture(tPressure, vUv - vec2(0.0, uTexel.y)).x;
  float t = texture(tPressure, vUv + vec2(0.0, uTexel.y)).x;
  fragColor = vec4(texture(tVelocity, vUv).xy - vec2(r - l, t - b) * 0.5, 0.0, 1.0);
}`;

const ADVECT = `${HEAD}
uniform sampler2D tVelocity;
uniform sampler2D tSource;
uniform vec2 uTexel;
uniform float uDt;
uniform float uDissipation;
void main() {
  vec2 coord = vUv - uDt * texture(tVelocity, vUv).xy * uTexel;
  fragColor = texture(tSource, coord) * uDissipation;
}`;

const SCALE = `${HEAD}
uniform sampler2D tSource;
uniform float uFactor;
void main() {
  fragColor = texture(tSource, vUv) * uFactor;
}`;

/**
 * The letters, displaced by the field. The texture holds only coverage (alpha); colour comes from
 * the ink and the paper behind it, so the red, green and blue samples can be taken at different
 * offsets and mixed per channel: that is the colour fringe.
 */
const COMPOSITE = `${HEAD}
uniform sampler2D tText;
uniform sampler2D tField;
uniform vec2 uFieldTexel;
uniform vec2 uSize;
uniform vec2 uCursor;
uniform float uAspect;
uniform float uGlow;
uniform float uTime;
uniform vec3 uInk;
uniform vec3 uPaper;

float cover(vec2 uv) {
  return texture(tText, uv).a;
}

void main() {
  vec2 flow = texture(tField, vUv).xy;
  // A slow undulation while the pointer is over the heading, gone when it leaves.
  vec2 drift = vec2(
    sin(vUv.y * 9.0 + uTime * 0.7) + sin(vUv.y * 21.0 - uTime * 1.1) * 0.6,
    sin(vUv.x * 8.0 - uTime * 0.6) + sin(vUv.x * 17.0 + uTime * 0.9) * 0.6
  );
  vec2 push = (flow * 0.85 + drift * 1.2 * uGlow) / uSize;

  float lx = length(texture(tField, vUv - vec2(uFieldTexel.x, 0.0)).xy);
  float rx = length(texture(tField, vUv + vec2(uFieldTexel.x, 0.0)).xy);
  float by = length(texture(tField, vUv - vec2(0.0, uFieldTexel.y)).xy);
  float ty = length(texture(tField, vUv + vec2(0.0, uFieldTexel.y)).xy);
  vec2 grad = vec2(rx - lx, ty - by);
  float energy = length(flow);

  vec2 toCursor = (vUv - uCursor) * vec2(uAspect, 1.0);
  float lens = smoothstep(0.42, 0.06, length(toCursor)) * uGlow;
  vec2 spread = normalize(toCursor + 1e-5) * (lens * 3.0 + min(energy, 60.0) * 0.1) / uSize;

  vec3 c = vec3(cover(vUv - push - spread), cover(vUv - push), cover(vUv - push + spread));
  float a = max(c.r, max(c.g, c.b));
  vec3 colour = a > 0.001 ? (uInk * c + uPaper * (a - c)) / a : uInk;

  // Moving fluid catches the light: a sheen on the slopes of the field, and a soft iridescence.
  float moving = smoothstep(0.5, 14.0, energy);
  vec3 normal = normalize(vec3(-grad * 0.35, 1.0));
  float spec = pow(max(dot(normal, normalize(vec3(-0.4, 0.55, 0.73))), 0.0), 18.0);
  colour += spec * 0.55 * moving;
  float wave = smoothstep(0.4, 9.0, length(grad) + energy * 0.12);
  vec3 shimmer = 0.5 + 0.5 * cos(vec3(0.0, 2.094, 4.188) + energy * 0.045 + (grad.x - grad.y) * 0.1 + uTime * 0.6);
  colour = mix(colour, shimmer, wave * 0.28);

  fragColor = vec4(clamp(colour, 0.0, 1.0) * a, a);
}`;

/* ───────────────────────── Letters to a texture ───────────────────────── */

const PRESSURE_STEPS = 6;
/** Largest share of width the drawn letters may differ from the page's before we give up. */
const TOLERANCE = 0.02;

function rgb(colour: string): [number, number, number] | null {
  const m = /rgba?\(([^)]+)\)/.exec(colour);
  if (!m) return null;
  const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  return [p[0] / 255, p[1] / 255, p[2] / 255];
}

/** The colour behind an element: the first ancestor with a background. */
function paperBehind(el: HTMLElement): [number, number, number] {
  for (let up: HTMLElement | null = el; up; up = up.parentElement) {
    const bg = getComputedStyle(up).backgroundColor;
    const m = /rgba?\(([^)]+)\)/.exec(bg);
    if (m) {
      const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
      if (p.length < 4 || p[3] > 0.5) return [p[0] / 255, p[1] / 255, p[2] / 255];
    }
  }
  return [1, 1, 1];
}

/** The page's @font-face rule for this family (the first one, for its file and its width range). */
function fontRule(family: string): CSSFontFaceRule | null {
  for (const sheet of document.styleSheets) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    for (const rule of rules) {
      if (rule instanceof CSSFontFaceRule && rule.style.getPropertyValue("font-family").replace(/["']/g, "").trim() === family) return rule;
    }
  }
  return null;
}

const pinned = new Map<string, Promise<string | null>>();

/**
 * A family name the canvas can draw this text in. The site's font stacks start with aliases that
 * cover only Latin letters ("… Letters") and metric fallbacks; the real face is the first other
 * one. A canvas cannot ask for an arbitrary width like `font-stretch: 70%`, so for a font with a
 * width axis the same file is loaded once more as its own face, fixed at that width and weight.
 */
function familyFor(style: CSSStyleDeclaration): Promise<string | null> {
  const family = style.fontFamily
    .split(",")
    .map((f) => f.replace(/["']/g, "").trim())
    .find((f) => f && !/ Letters\b| Fallback$/.test(f));
  if (!family) return Promise.resolve(null);
  const rule = fontRule(family);
  const widths = rule?.style.getPropertyValue("font-stretch").trim() ?? "";
  const narrowed = style.fontStretch !== "100%" && style.fontStretch !== "normal";
  if (!narrowed || !widths || widths === "normal" || widths === "100%") return Promise.resolve(family);
  const key = `${family}|${style.fontStretch}|${style.fontWeight}`;
  let face = pinned.get(key);
  if (!face) {
    face = (async () => {
      const url = rule && /url\(["']?([^"')]+)["']?\)/.exec(rule.style.getPropertyValue("src"));
      if (!url) return null;
      const name = `Liquid ${family} ${style.fontStretch} ${style.fontWeight}`;
      const font = new FontFace(name, `url("${url[1]}")`, { weight: style.fontWeight, stretch: style.fontStretch });
      await font.load();
      document.fonts.add(font);
      return name;
    })().catch(() => null);
    pinned.set(key, face);
  }
  return face;
}

function transformed(text: string, transform: string, lang: string) {
  if (transform === "uppercase") return text.toLocaleUpperCase(lang || undefined);
  if (transform === "lowercase") return text.toLocaleLowerCase(lang || undefined);
  return text;
}

/**
 * Draw the host's text in white onto a canvas the size of `area`, exactly where the page shows it.
 * Returns null if any line would not match the page.
 */
async function drawLetters(host: HTMLElement, area: DOMRect, ratio: number): Promise<HTMLCanvasElement | null> {
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(area.width * ratio));
  out.height = Math.max(1, Math.round(area.height * ratio));
  const g = out.getContext("2d");
  if (!g) return null;
  const range = document.createRange();
  const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  let drawn = 0;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const raw = node.nodeValue ?? "";
    if (!raw.trim() || !node.parentElement) continue;
    const style = getComputedStyle(node.parentElement);
    range.selectNodeContents(node);
    const rects = [...range.getClientRects()].filter((r) => r.width > 0);
    if (rects.length !== 1) return null; // wrapped over several lines: not supported
    const family = await familyFor(style);
    if (!family) return null;
    const size = parseFloat(style.fontSize);
    g.font = `${style.fontStyle} ${style.fontWeight} ${size * ratio}px "${family}"`;
    const spacing = style.letterSpacing === "normal" ? 0 : parseFloat(style.letterSpacing);
    if ("letterSpacing" in g) g.letterSpacing = `${spacing * ratio}px`;
    else if (spacing) return null;
    g.direction = style.direction === "rtl" ? "rtl" : "ltr";
    g.textAlign = "left";
    g.textBaseline = "alphabetic";
    const text = transformed(raw.trim(), style.textTransform, node.parentElement.closest("[lang]")?.getAttribute("lang") ?? "");
    const metrics = g.measureText(text);
    const rect = rects[0];
    if (Math.abs(metrics.width / ratio - rect.width) > rect.width * TOLERANCE) return null;
    g.fillStyle = "#fff";
    g.fillText(text, (rect.left - area.left) * ratio, (rect.top - area.top) * ratio + metrics.fontBoundingBoxAscent);
    drawn += 1;
  }
  return drawn ? out : null;
}

/* ───────────────────────── WebGL plumbing ───────────────────────── */

type Target = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number };
type Double = { read: Target; write: Target; swap(): void };

/**
 * `show` is called once the canvas holds a frame identical to the still heading (swap the canvas in
 * and the real letters out in that same moment); `hide` once the fluid has settled after a leave.
 */
export async function createLiquid(
  host: HTMLElement,
  canvas: HTMLCanvasElement,
  { show, hide }: { show: () => void; hide: () => void },
): Promise<Liquid | null> {
  // Nothing to copy while the heading is still animating in.
  if (host.getAnimations({ subtree: true }).some((a) => a.playState === "running")) return null;

  const context = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
  if (!context) return null;
  const gl: WebGL2RenderingContext = context;
  if (!gl.getExtension("EXT_color_buffer_float") && !gl.getExtension("EXT_color_buffer_half_float")) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vert = compile(gl.VERTEX_SHADER, VERT);
  if (!vert) return null;
  type Pass = { program: WebGLProgram; uniforms: Map<string, WebGLUniformLocation | null> };
  const passOf = (frag: string): Pass | null => {
    const fs = compile(gl.FRAGMENT_SHADER, frag);
    if (!fs) return null;
    const program = gl.createProgram()!;
    gl.attachShader(program, vert);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, "aPos");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    return { program, uniforms: new Map() };
  };
  const passes = {
    splat: passOf(SPLAT),
    curl: passOf(CURL),
    vorticity: passOf(VORTICITY),
    divergence: passOf(DIVERGENCE),
    pressure: passOf(PRESSURE),
    gradient: passOf(GRADIENT),
    advect: passOf(ADVECT),
    scale: passOf(SCALE),
    composite: passOf(COMPOSITE),
  };
  if (Object.values(passes).some((p) => !p)) return null;
  const P = passes as Record<keyof typeof passes, Pass>;

  // One triangle that covers the screen.
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.disable(gl.BLEND);

  const makeTarget = (w: number, h: number): Target => {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fbo, w, h };
  };
  const makeDouble = (w: number, h: number): Double => {
    const d = {
      read: makeTarget(w, h),
      write: makeTarget(w, h),
      swap() {
        [d.read, d.write] = [d.write, d.read];
      },
    };
    return d;
  };
  const dropTarget = (t: Target) => {
    gl.deleteTexture(t.tex);
    gl.deleteFramebuffer(t.fbo);
  };

  const uniform = (pass: Pass, name: string) => {
    if (!pass.uniforms.has(name)) pass.uniforms.set(name, gl.getUniformLocation(pass.program, name));
    return pass.uniforms.get(name) ?? null;
  };
  /** Run a pass into `target` (or onto the canvas). Textures are bound in the order given. */
  const run = (pass: Pass, target: Target | null, textures: Record<string, WebGLTexture>, set?: (u: (name: string) => WebGLUniformLocation | null) => void) => {
    gl.useProgram(pass.program);
    let unit = 0;
    for (const [name, tex] of Object.entries(textures)) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(uniform(pass, name), unit);
      unit += 1;
    }
    set?.((name) => uniform(pass, name));
    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fbo : null);
    gl.viewport(0, 0, target ? target.w : gl.drawingBufferWidth, target ? target.h : gl.drawingBufferHeight);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  /* ── Size-dependent state, made (again) whenever the heading's size changes ── */
  let width = 0;
  let height = 0;
  let aspect = 1;
  let velocity: Double | null = null;
  let pressure: Double | null = null;
  let field: Double | null = null;
  let curl: Target | null = null;
  let divergence: Target | null = null;
  let letters: WebGLTexture | null = null;
  let ink: [number, number, number] = [0, 0, 0];
  let paper: [number, number, number] = [1, 1, 1];

  const dropSized = () => {
    for (const d of [velocity, pressure, field]) if (d) [d.read, d.write].forEach(dropTarget);
    for (const t of [curl, divergence]) if (t) dropTarget(t);
    if (letters) gl.deleteTexture(letters);
    velocity = pressure = field = null;
    curl = divergence = null;
    letters = null;
  };

  async function layout(): Promise<boolean> {
    const area = canvas.getBoundingClientRect();
    if (area.width < 2 || area.height < 2) return false;
    if (letters && Math.round(area.width) === width && Math.round(area.height) === height) return true;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const drawing = await drawLetters(host, area, ratio);
    if (!drawing) return false;
    dropSized();
    width = Math.round(area.width);
    height = Math.round(area.height);
    aspect = width / height;
    canvas.width = drawing.width;
    canvas.height = drawing.height;
    // The fluid runs coarse; the field of offsets a little finer.
    const simH = 64;
    const simW = Math.min(320, Math.round(simH * aspect));
    const fieldH = 150;
    const fieldW = Math.min(720, Math.round(fieldH * aspect));
    velocity = makeDouble(simW, simH);
    pressure = makeDouble(simW, simH);
    curl = makeTarget(simW, simH);
    divergence = makeTarget(simW, simH);
    field = makeDouble(fieldW, fieldH);
    letters = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, letters);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drawing);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const textNode = host.querySelector(".hero-name") ?? host;
    ink = rgb(getComputedStyle(textNode).color) ?? [0, 0, 0];
    paper = paperBehind(host);
    return true;
  }

  if (!(await layout())) {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  }

  /* ── Simulation ── */
  const queued: [number, number, number, number][] = [];
  let last: { x: number; y: number } | null = null;
  let cursor = { x: 0.5, y: 0.5 };
  let inside = false;
  let glow = 0;
  let energy = 0;
  let raf = 0;
  let clock = 0;
  let time = 0;
  let destroyed = false;

  function splat(target: Double, x: number, y: number, dx: number, dy: number, radius: number) {
    run(P.splat, target.write, { tTarget: target.read.tex }, (u) => {
      gl.uniform2f(u("uPoint"), x, y);
      gl.uniform2f(u("uValue"), dx, dy);
      gl.uniform1f(u("uRadius"), radius);
      gl.uniform1f(u("uAspect"), aspect);
    });
    target.swap();
  }

  function step(dt: number) {
    if (!velocity || !pressure || !field || !curl || !divergence) return;
    const vel = velocity;
    const simTexel = [1 / vel.read.w, 1 / vel.read.h] as const;
    for (const [x, y, dx, dy] of queued) {
      splat(vel, x, y, dx, dy, 0.0045);
      splat(field, x, y, dx, dy, 0.0045);
    }
    if (queued.length) energy = 1;
    queued.length = 0;

    run(P.curl, curl, { tVelocity: vel.read.tex }, (u) => gl.uniform2f(u("uTexel"), ...simTexel));
    run(P.vorticity, vel.write, { tVelocity: vel.read.tex, tCurl: curl.tex }, (u) => {
      gl.uniform2f(u("uTexel"), ...simTexel);
      gl.uniform1f(u("uCurl"), 2.4);
      gl.uniform1f(u("uDt"), dt);
    });
    vel.swap();
    run(P.divergence, divergence, { tVelocity: vel.read.tex }, (u) => gl.uniform2f(u("uTexel"), ...simTexel));
    run(P.scale, pressure.write, { tSource: pressure.read.tex }, (u) => gl.uniform1f(u("uFactor"), Math.pow(0.8, dt * 60)));
    pressure.swap();
    for (let i = 0; i < PRESSURE_STEPS; i++) {
      run(P.pressure, pressure.write, { tPressure: pressure.read.tex, tDivergence: divergence.tex }, (u) => gl.uniform2f(u("uTexel"), ...simTexel));
      pressure.swap();
    }
    run(P.gradient, vel.write, { tPressure: pressure.read.tex, tVelocity: vel.read.tex }, (u) => gl.uniform2f(u("uTexel"), ...simTexel));
    vel.swap();

    const frames = dt * 60;
    const flowDecay = Math.pow(0.992, frames);
    const fieldDecay = Math.pow(0.962, frames);
    run(P.advect, vel.write, { tVelocity: vel.read.tex, tSource: vel.read.tex }, (u) => {
      gl.uniform2f(u("uTexel"), ...simTexel);
      gl.uniform1f(u("uDt"), dt);
      gl.uniform1f(u("uDissipation"), flowDecay);
    });
    vel.swap();
    run(P.advect, field.write, { tVelocity: vel.read.tex, tSource: field.read.tex }, (u) => {
      gl.uniform2f(u("uTexel"), 1 / field!.read.w, 1 / field!.read.h);
      gl.uniform1f(u("uDt"), dt);
      gl.uniform1f(u("uDissipation"), fieldDecay);
    });
    field.swap();
    energy *= fieldDecay;
  }

  function draw() {
    if (!field || !letters) return;
    const f = field;
    run(P.composite, null, { tText: letters, tField: f.read.tex }, (u) => {
      gl.uniform2f(u("uFieldTexel"), 1 / f.read.w, 1 / f.read.h);
      gl.uniform2f(u("uSize"), width, height);
      gl.uniform2f(u("uCursor"), cursor.x, cursor.y);
      gl.uniform1f(u("uAspect"), aspect);
      gl.uniform1f(u("uGlow"), glow);
      gl.uniform1f(u("uTime"), time);
      gl.uniform3f(u("uInk"), ...ink);
      gl.uniform3f(u("uPaper"), ...paper);
    });
  }

  function frame(now: number) {
    raf = 0;
    if (destroyed) return;
    const dt = Math.min(1 / 30, Math.max(0, (now - clock) / 1000));
    clock = now;
    time += dt;
    glow += ((inside ? 1 : 0) - glow) * Math.min(1, dt * 5);
    if (queued.length || energy > 0.002) step(Math.max(dt, 1 / 240));
    draw();
    // Settled: the real text takes over again.
    if (!inside && energy <= 0.002 && glow < 0.01) {
      glow = 0;
      hide();
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function wake() {
    if (raf || destroyed) return;
    clock = performance.now();
    raf = requestAnimationFrame(frame);
  }

  const toUv = (x: number, y: number) => ({ x: x / width, y: 1 - y / height });

  return {
    enter(x, y) {
      inside = true;
      last = { x, y };
      cursor = toUv(x, y);
      void layout().then((ok) => {
        if (!ok || destroyed || !inside) return;
        draw(); // the first frame matches the still heading
        show();
        wake();
      });
    },
    move(x, y) {
      cursor = toUv(x, y);
      if (last) {
        const dx = (x - last.x) * 1.4;
        const dy = -(y - last.y) * 1.4;
        if (dx * dx + dy * dy > 0.01 && queued.length < 64) queued.push([x / width, 1 - y / height, dx, dy]);
      }
      last = { x, y };
      wake();
    },
    leave() {
      inside = false;
      last = null;
      wake();
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      dropSized();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
