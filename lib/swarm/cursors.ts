/**
 * The agents' cursors and everything they draw (outlines, size labels, carets, scan lines, click
 * rings), on one canvas laid over the page. One canvas instead of a hundred elements: each frame is
 * a clear and up to a hundred small image copies, with no work for the page's own layout.
 */
export const PALETTE = [
  "#ff5a1f",
  "#1abcfe",
  "#0acf83",
  "#a259ff",
  "#ffc700",
  "#ff7262",
  "#00b8d9",
  "#e84393",
  "#6b8afd",
  "#2ec4b6",
  "#f24e1e",
  "#7bd389",
];

/**
 * The agents' names: computing pioneers, Persian scholars and poets (al-Khwarizmi gave us the word
 * "algorithm"), and everyday Persian names. One per agent, shown on its tag.
 */
export const NAMES = [
  "Ada",
  "Alan",
  "Grace",
  "Linus",
  "Margaret",
  "Dennis",
  "Ken",
  "Barbara",
  "Tim",
  "Guido",
  "Bjarne",
  "Brendan",
  "Anders",
  "Rasmus",
  "Yukihiro",
  "Donald",
  "Edsger",
  "Hedy",
  "Katherine",
  "Dorothy",
  "Frances",
  "Radia",
  "Khwarizmi",
  "Khayyam",
  "Avicenna",
  "Razi",
  "Biruni",
  "Tusi",
  "Farabi",
  "Kashi",
  "Maryam",
  "Hafez",
  "Rumi",
  "Saadi",
  "Attar",
  "Ferdowsi",
  "Kent",
  "Martin",
  "Ward",
  "Kelsey",
  "Mitchell",
  "Solomon",
  "Ryan",
  "Russ",
  "Evan",
  "Rich",
  "Sophie",
  "Lea",
  "Sarah",
  "Addy",
  "Jake",
  "Una",
  "Sindre",
  "Jessica",
  "Mira",
  "Leila",
  "Nima",
  "Sara",
  "Dara",
  "Arash",
  "Kian",
  "Parisa",
  "Shirin",
  "Kaveh",
  "Roya",
  "Babak",
  "Neda",
  "Omid",
  "Yasmin",
  "Cyrus",
  "Darius",
  "Atoosa",
  "Bahar",
  "Nazanin",
  "Hooman",
  "Ladan",
  "Reza",
  "Mina",
  "Sina",
  "Navid",
  "Taraneh",
  "Pouya",
  "Golnar",
  "Arman",
  "Ziba",
  "Kamran",
  "Soraya",
  "Payam",
  "Elham",
  "Farhad",
  "Mahsa",
  "Behnaz",
  "Ramin",
  "Vida",
  "Jaleh",
  "Bijan",
  "Shahab",
  "Tara",
  "Kimia",
  "Afshin",
];

/** Agent states. Parked agents wait just outside the screen and are not drawn. */
export const PARKED = 0;
export const ROAM = 1;
export const TRAVEL = 2;
export const WORK = 3;
export const HOME = 4;

export type Agent = {
  index: number;
  colour: string;
  x: number;
  y: number;
  state: number;
  /** Where it heads while roaming or going home. */
  aimX: number;
  aimY: number;
  /** Roaming ends at this time (ms) unless new work comes first. */
  until: number;
  /** Travel: where and when it set off, and when it arrives. */
  fromX: number;
  fromY: number;
  leftAt: number;
  arriveAt: number;
  /** 0 to 1 while the cursor is pressed (clicking, dragging). */
  press: number;
};

const ARROW = new Path2D("M0 0 L0 17 L4.6 12.9 L7.6 19.6 L10.4 18.4 L7.4 11.7 L13 11.7 Z");
const FONT = '600 10px "Geist Mono", "Geist Mono Letters", ui-monospace, Menlo, monospace';
const TAG_H = 16;

/** Black or white, whichever reads better on `hex`. */
function inkOn(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const lum = 0.2126 * channel(n >> 16) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
  return lum > 0.32 ? "#121311" : "#ffffff";
}

export class Painter {
  private ctx: CanvasRenderingContext2D;
  private ratio = 1;
  private arrows: HTMLCanvasElement[] = [];
  private tags: { canvas: HTMLCanvasElement; w: number }[] = [];
  width = 0;
  height = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    agents: Agent[],
    private compact: boolean,
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no 2d canvas");
    this.ctx = ctx;
    this.resize();
    this.sprites(agents);
  }

  resize() {
    this.ratio = Math.min(window.devicePixelRatio || 1, this.compact ? 1.5 : 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.round(this.width * this.ratio);
    this.canvas.height = Math.round(this.height * this.ratio);
  }

  /** Arrows (one per colour) and name tags (one per agent) are drawn once, then copied. */
  private sprites(agents: Agent[]) {
    const r = Math.min(window.devicePixelRatio || 1, 2);
    this.arrows = PALETTE.map((colour) => {
      const sprite = document.createElement("canvas");
      sprite.width = Math.ceil(18 * r);
      sprite.height = Math.ceil(24 * r);
      const g = sprite.getContext("2d")!;
      g.scale(r, r);
      g.translate(2, 2);
      g.lineJoin = "round";
      g.shadowColor = "rgba(0,0,0,0.28)";
      g.shadowBlur = 3;
      g.shadowOffsetY = 1;
      g.fillStyle = colour;
      g.fill(ARROW);
      g.shadowColor = "transparent";
      g.lineWidth = 1.4;
      g.strokeStyle = "#ffffff";
      g.stroke(ARROW);
      return sprite;
    });
    const measure = document.createElement("canvas").getContext("2d")!;
    measure.font = FONT;
    this.tags = agents.map((agent) => {
      const label = NAMES[agent.index % NAMES.length];
      const w = Math.ceil(measure.measureText(label).width) + 10;
      const sprite = document.createElement("canvas");
      sprite.width = Math.ceil(w * r);
      sprite.height = Math.ceil(TAG_H * r);
      const g = sprite.getContext("2d")!;
      g.scale(r, r);
      g.fillStyle = agent.colour;
      g.fillRect(0, 0, w, TAG_H);
      g.font = FONT;
      g.textBaseline = "middle";
      g.fillStyle = inkOn(agent.colour);
      g.fillText(label, 5, TAG_H / 2 + 0.5);
      return { canvas: sprite, w };
    });
  }

  clear() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
  }

  cursor(agent: Agent, tagged: boolean) {
    if (agent.x < -30 || agent.y < -30 || agent.x > this.width + 30 || agent.y > this.height + 30) return;
    const ctx = this.ctx;
    const sprite = this.arrows[agent.index % this.arrows.length];
    const scale = 1 - agent.press * 0.18;
    ctx.drawImage(sprite, agent.x - 2 * scale, agent.y - 2 * scale, 18 * scale, 24 * scale);
    if (tagged) {
      const tag = this.tags[agent.index];
      ctx.drawImage(tag.canvas, agent.x + 12, agent.y + 18, tag.w, TAG_H);
    }
  }

  /** A rectangle being dragged out, with its size in a chip next to the cursor. */
  outline(x0: number, y0: number, x1: number, y1: number, colour: string, alpha = 1) {
    const ctx = this.ctx;
    const x = Math.min(x0, x1);
    const y = Math.min(y0, y1);
    const w = Math.abs(x1 - x0);
    const h = Math.abs(y1 - y0);
    ctx.globalAlpha = alpha * 0.1;
    ctx.fillStyle = colour;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = colour;
    ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(w), Math.round(h));
    // Corner handles, like a design tool's selection.
    ctx.fillStyle = "#ffffff";
    for (const [hx, hy] of [
      [x, y],
      [x + w, y],
      [x, y + h],
      [x + w, y + h],
    ]) {
      ctx.fillRect(hx - 3, hy - 3, 6, 6);
      ctx.strokeRect(hx - 3 + 0.5, hy - 3 + 0.5, 6, 6);
    }
    if (w > 24 && h > 12) this.chip(x1 + 10, y1 + 10, `${Math.round(w)} × ${Math.round(h)}`, colour);
    ctx.globalAlpha = 1;
  }

  /** A small label next to the cursor: a size, a file name, a hint. */
  chip(x: number, y: number, label: string, colour: string) {
    const ctx = this.ctx;
    ctx.font = FONT;
    const lw = ctx.measureText(label).width + 10;
    const lx = Math.min(Math.max(x, 4), this.width - lw - 4);
    const ly = Math.min(Math.max(y, 4), this.height - TAG_H - 4);
    ctx.fillStyle = colour;
    ctx.fillRect(lx, ly, lw, TAG_H);
    ctx.fillStyle = inkOn(colour);
    ctx.textBaseline = "middle";
    ctx.fillText(label, lx + 5, ly + TAG_H / 2 + 0.5);
  }

  caret(x: number, top: number, bottom: number, colour: string) {
    // Blinks like a text caret.
    if (Math.floor(performance.now() / 420) % 2) return;
    this.ctx.fillStyle = colour;
    this.ctx.fillRect(Math.round(x) - 1, top, 2, bottom - top);
  }

  scan(left: number, right: number, y: number, colour: string) {
    const ctx = this.ctx;
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = colour;
    ctx.fillRect(left, y - 10, right - left, 10);
    ctx.globalAlpha = 1;
    ctx.fillRect(left, y - 1, right - left, 2);
  }

  ring(x: number, y: number, radius: number, colour: string, alpha: number) {
    const ctx = this.ctx;
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.lineWidth = 2;
    ctx.strokeStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}
