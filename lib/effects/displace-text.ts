/**
 * Displacement effect for a heading: the text is cut into a grid of tiles. Sweeping the pointer
 * across it pushes the piece of text inside each nearby tile along with the pointer, every tile by
 * a slightly different amount, with red and cyan fringes on the moved pieces. Then they spring back.
 *
 * It works on the real text, not a picture of it. Each tile is a small window (overflow hidden)
 * onto a copy of the heading; moving the copy inside its window is the displacement. Because the
 * copies are ordinary DOM text they use the same font, size, line breaks and direction as the
 * original in every browser and in both languages, with no canvas and no experimental API.
 * The original stays in the page for screen readers; it is only made transparent while tiles show.
 */

type Tile = {
  window: HTMLElement;
  copy: HTMLElement;
  /** Centre of the tile, in grid coordinates. */
  cx: number;
  cy: number;
  /** Offset of the text inside the tile, and its speed. */
  ox: number;
  oy: number;
  ux: number;
  uy: number;
  /** Fixed per-tile character: how much it follows the pointer, and how much it shears sideways. */
  follow: number;
  shear: number;
  moved: boolean;
};

export type Displacer = {
  /** Pointer entered at (x, y), measured from the heading's top left corner. */
  enter(x: number, y: number): void;
  move(x: number, y: number): void;
  leave(): void;
  destroy(): void;
};

const STEP = 1000 / 60; // physics runs in fixed steps, so it feels the same on 60 and 120 Hz screens
const STIFFNESS = 0.085;
const DAMPING = 0.8;
const PUSH = 0.11;

/** A repeatable pseudo-random number in 0..1 for tile (c, r). */
const hash = (c: number, r: number, salt: number) => {
  const n = Math.sin(c * 127.1 + r * 311.7 + salt * 74.7) * 43758.5453;
  return n - Math.floor(n);
};

export function createDisplacer(host: HTMLElement): Displacer {
  let layer: HTMLElement | null = null;
  let tiles: Tile[] = [];
  let padX = 0;
  let padY = 0;
  let size = 0;
  let inside = false;
  let running = false;
  let raf = 0;
  let clock = 0;
  let owed = 0;
  // Pointer in grid coordinates, and its smoothed speed in px per step.
  let px = 0;
  let py = 0;
  let vx = 0;
  let vy = 0;

  /** Headings are revealed line by line; cutting one up mid-animation would freeze it half-way. */
  const revealed = () =>
    [...host.querySelectorAll<HTMLElement>(".split-line > *")].every((line) => {
      const transform = getComputedStyle(line).transform;
      return transform === "none" || Math.abs(new DOMMatrixReadOnly(transform).m42) < 1;
    });

  function build() {
    const width = host.offsetWidth;
    const height = host.offsetHeight;
    if (!width || !height || !revealed()) return false;

    // Glyphs reach outside the heading's own box (tight line height), so the grid is a bit larger.
    const fontSize = parseFloat(getComputedStyle(host).fontSize) || 16;
    padX = Math.round(fontSize * 0.12);
    padY = Math.round(fontSize * 0.3);
    size = Math.max(40, Math.min(104, Math.round(width / 15)));
    const cols = Math.ceil((width + padX * 2) / size);
    const rows = Math.ceil((height + padY * 2) / size);

    // Where the text actually is, so empty parts of the heading's box get no tiles.
    const origin = host.getBoundingClientRect();
    const ink: { l: number; t: number; r: number; b: number }[] = [];
    const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.nodeValue?.trim()) continue;
      range.selectNodeContents(node);
      for (const box of range.getClientRects()) {
        ink.push({
          l: box.left - origin.left + padX - size * 0.25,
          r: box.right - origin.left + padX + size * 0.25,
          t: box.top - origin.top + padY - fontSize * 0.25,
          b: box.bottom - origin.top + padY + fontSize * 0.25,
        });
      }
    }
    if (!ink.length) return false;

    // One copy of the heading's content. Ids and reveal markers are removed: the copies are decoration.
    const content = document.createDocumentFragment();
    for (const child of host.childNodes) content.appendChild(child.cloneNode(true));
    const clean = (el: Element) => {
      el.removeAttribute("id");
      el.removeAttribute("data-split");
      el.removeAttribute("data-reveal");
    };
    content.querySelectorAll("*").forEach(clean);

    layer = document.createElement("span");
    layer.setAttribute("data-displace-layer", "");
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText = `left:${-padX}px;top:${-padY}px;width:${width + padX * 2}px;height:${height + padY * 2}px`;

    tiles = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * size;
        const y = r * size;
        if (!ink.some((box) => box.l < x + size && box.r > x && box.t < y + size && box.b > y)) continue;
        const tileWindow = document.createElement("span");
        tileWindow.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px`;
        const copy = document.createElement("span");
        copy.style.cssText = `left:${padX - x}px;top:${padY - y}px;width:${width}px;height:${height}px`;
        copy.appendChild(content.cloneNode(true));
        tileWindow.appendChild(copy);
        layer.appendChild(tileWindow);
        tiles.push({
          window: tileWindow,
          copy,
          cx: x + size / 2,
          cy: y + size / 2,
          ox: 0,
          oy: 0,
          ux: 0,
          uy: 0,
          follow: 0.55 + hash(c, r, 1) * 0.9,
          shear: (hash(c, r, 2) - 0.5) * 0.7,
          moved: false,
        });
      }
    }
    host.appendChild(layer);
    host.setAttribute("data-displacing", "");
    return true;
  }

  function teardown() {
    cancelAnimationFrame(raf);
    running = false;
    layer?.remove();
    layer = null;
    tiles = [];
    host.removeAttribute("data-displacing");
  }

  /** One physics step. Returns whether anything is still moving. */
  function step() {
    const reach = size * 2.1;
    const limit = size * 0.8;
    const speed = Math.hypot(vx, vy);
    let moving = false;
    for (const tile of tiles) {
      if (inside && speed > 0.05) {
        const dx = tile.cx - px;
        const dy = tile.cy - py;
        const near = Math.exp(-(dx * dx + dy * dy) / (reach * reach));
        if (near > 0.01) {
          tile.ux += (vx * tile.follow - vy * tile.shear) * near * PUSH;
          tile.uy += (vy * tile.follow + vx * tile.shear) * near * PUSH;
        }
      }
      tile.ux = (tile.ux - tile.ox * STIFFNESS) * DAMPING;
      tile.uy = (tile.uy - tile.oy * STIFFNESS) * DAMPING;
      tile.ox = Math.max(-limit, Math.min(limit, tile.ox + tile.ux));
      tile.oy = Math.max(-limit, Math.min(limit, tile.oy + tile.uy));
      if (Math.abs(tile.ox) + Math.abs(tile.oy) > 0.2 || Math.abs(tile.ux) + Math.abs(tile.uy) > 0.05) moving = true;
    }
    vx *= 0.8;
    vy *= 0.8;
    return moving;
  }

  function paint() {
    for (const tile of tiles) {
      const far = Math.abs(tile.ox) + Math.abs(tile.oy) > 0.2;
      if (!far) {
        if (tile.moved) {
          tile.copy.style.transform = "";
          tile.window.style.textShadow = "";
          tile.moved = false;
        }
        continue;
      }
      tile.moved = true;
      tile.copy.style.transform = `translate(${tile.ox.toFixed(1)}px,${tile.oy.toFixed(1)}px)`;
      // Colour fringes: a red and a cyan ghost on either side, further apart the further the piece moved.
      const fx = (tile.ox * 0.3).toFixed(1);
      const fy = (tile.oy * 0.3).toFixed(1);
      tile.window.style.textShadow = `${fx}px ${fy}px 0 rgba(255,64,48,.78), ${-fx}px ${-fy}px 0 rgba(48,208,255,.78)`;
    }
  }

  function frame(now: number) {
    owed += Math.min(100, now - clock);
    clock = now;
    let moving = true;
    while (owed >= STEP) {
      moving = step();
      owed -= STEP;
    }
    paint();
    if (!moving) {
      // Everything is back in place. Outside: put the real heading back. Inside: wait for the next move.
      running = false;
      if (!inside) teardown();
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function run() {
    if (running || !layer) return;
    running = true;
    clock = performance.now();
    owed = 0;
    raf = requestAnimationFrame(frame);
  }

  return {
    enter(x, y) {
      if (!layer && !build()) return;
      inside = true;
      px = x + padX;
      py = y + padY;
      vx = 0;
      vy = 0;
    },
    move(x, y) {
      if (!layer || !inside) return;
      const nx = x + padX;
      const ny = y + padY;
      vx = vx * 0.5 + (nx - px) * 0.5;
      vy = vy * 0.5 + (ny - py) * 0.5;
      px = nx;
      py = ny;
      run();
    },
    leave() {
      inside = false;
      if (layer && !running) teardown();
    },
    destroy() {
      inside = false;
      teardown();
    },
  };
}
