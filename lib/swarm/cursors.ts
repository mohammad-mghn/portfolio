/**
 * The agents' cursors and everything they draw, on one canvas laid over the page, in the look of a
 * design tool: blue selections with handles and size labels, grey placeholders, ruler guides, red
 * duplicates with distances, text selections and carets. One canvas instead of a hundred elements:
 * each frame is a clear and up to a hundred small image copies, with no work for the page's layout.
 */
export const PALETTE = [
  "#F24E1E",
  "#A259FF",
  "#1ABCFE",
  "#0ACF83",
  "#FF7262",
  "#FFC700",
  "#9747FF",
  "#E8467C",
  "#14AE5C",
  "#0D99FF",
  "#FF8A00",
  "#00B5CE",
];
/** Selection and measurement colours, as in Figma. */
export const BLUE = "#0D99FF";
export const RED = "#F24822";

/**
 * The agents' names: computing pioneers, Persian scholars and poets (al-Khwarizmi gave us the word
 * "algorithm"), and everyday Persian names. One per agent, shown on its tag while it works.
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

/** Agent states. Waiting agents stand in a cluster by the stop box. */
export const WAITING = 0;
export const ROAM = 1;
export const TRAVEL = 2;
export const WORK = 3;
export const HOME = 4;

/** The cursor an agent shows: the tool it is using. */
export type Tool = "arrow" | "ibeam" | "cross" | "dup" | "move";

export type Agent = {
  index: number;
  colour: string;
  x: number;
  y: number;
  state: number;
  tool: Tool;
  aimX: number;
  aimY: number;
  until: number;
  fromX: number;
  fromY: number;
  leftAt: number;
  arriveAt: number;
  /** 0 to 1 while the mouse button is down. */
  press: number;
};

const FONT = '600 10px "Geist Mono", "Geist Mono Letters", ui-monospace, Menlo, monospace';
const TAG_H = 16;
const ARROW = new Path2D("M0 0 L0 15.5 L4.2 11.8 L7 18 L9.6 16.9 L6.8 10.8 L12 10.8 Z");
const SPRITE = 26;

function inkOn(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const lum = 0.2126 * channel(n >> 16) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
  return lum > 0.32 ? "#121311" : "#ffffff";
}

/** Draws one cursor shape at (0, 0) = its hot spot. */
function drawTool(g: CanvasRenderingContext2D, tool: Tool, colour: string) {
  g.lineJoin = "round";
  g.lineCap = "round";
  const outlined = (path: Path2D | (() => void), width = 1.5) => {
    g.strokeStyle = "#ffffff";
    g.lineWidth = width + 2.6;
    if (path instanceof Path2D) g.stroke(path);
    else {
      g.beginPath();
      path();
      g.stroke();
    }
    g.strokeStyle = colour;
    g.lineWidth = width;
    if (path instanceof Path2D) g.stroke(path);
    else {
      g.beginPath();
      path();
      g.stroke();
    }
  };
  if (tool === "arrow" || tool === "dup") {
    g.shadowColor = "rgba(0,0,0,0.25)";
    g.shadowBlur = 3;
    g.shadowOffsetY = 1;
    if (tool === "dup") {
      // Option-drag: a second, hollow arrow behind the first.
      g.save();
      g.translate(4, 3);
      g.fillStyle = "#ffffff";
      g.fill(ARROW);
      g.lineWidth = 1.2;
      g.strokeStyle = colour;
      g.stroke(ARROW);
      g.restore();
    }
    g.fillStyle = colour;
    g.fill(ARROW);
    g.shadowColor = "transparent";
    g.lineWidth = 1.3;
    g.strokeStyle = "#ffffff";
    g.stroke(ARROW);
  } else if (tool === "ibeam") {
    outlined(() => {
      g.moveTo(-3.5, -8);
      g.quadraticCurveTo(0, -8, 0, -6);
      g.quadraticCurveTo(0, -8, 3.5, -8);
      g.moveTo(0, -6);
      g.lineTo(0, 6);
      g.moveTo(-3.5, 8);
      g.quadraticCurveTo(0, 8, 0, 6);
      g.quadraticCurveTo(0, 8, 3.5, 8);
    });
  } else if (tool === "cross") {
    outlined(() => {
      g.moveTo(0, -8);
      g.lineTo(0, 8);
      g.moveTo(-8, 0);
      g.lineTo(8, 0);
    });
  } else if (tool === "move") {
    outlined(() => {
      for (const [dx, dy] of [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ]) {
        g.moveTo(0, 0);
        g.lineTo(dx * 8, dy * 8);
        g.moveTo(dx * 8 + dy * 2.5, dy * 8 + dx * 2.5);
        g.lineTo(dx * 8, dy * 8);
        g.lineTo(dx * 8 - dy * 2.5, dy * 8 - dx * 2.5);
      }
    });
  }
}

export class Painter {
  private ctx: CanvasRenderingContext2D;
  private ratio = 1;
  private sprites = new Map<string, HTMLCanvasElement>();
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
    this.makeTags(agents);
  }

  resize() {
    this.ratio = Math.min(window.devicePixelRatio || 1, this.compact ? 1.5 : 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.round(this.width * this.ratio);
    this.canvas.height = Math.round(this.height * this.ratio);
  }

  /** A cursor shape in a colour, drawn once and then copied. Tools other than arrows centre on the hot spot. */
  private sprite(tool: Tool, colour: string) {
    const key = `${tool}${colour}`;
    let sprite = this.sprites.get(key);
    if (!sprite) {
      const r = Math.min(window.devicePixelRatio || 1, 2);
      sprite = document.createElement("canvas");
      sprite.width = Math.ceil(SPRITE * r);
      sprite.height = Math.ceil(SPRITE * r);
      const g = sprite.getContext("2d")!;
      g.scale(r, r);
      if (tool === "arrow" || tool === "dup") g.translate(3, 3);
      else g.translate(SPRITE / 2, SPRITE / 2);
      drawTool(g, tool, colour);
      this.sprites.set(key, sprite);
    }
    return sprite;
  }

  private makeTags(agents: Agent[]) {
    const r = Math.min(window.devicePixelRatio || 1, 2);
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
    // The canvas sits in a right-to-left page on /fa: labels are always drawn left to right.
    this.ctx.direction = "ltr";
    this.ctx.textAlign = "left";
  }

  cursor(agent: Agent, tagged: boolean, size = 1, alpha = 1) {
    if (agent.x < -30 || agent.y < -30 || agent.x > this.width + 30 || agent.y > this.height + 30) return;
    const ctx = this.ctx;
    ctx.globalAlpha = alpha;
    const sprite = this.sprite(agent.tool, agent.colour);
    const arrow = agent.tool === "arrow" || agent.tool === "dup";
    const scale = size * (1 - agent.press * 0.15);
    const side = SPRITE * scale;
    const ox = arrow ? 3 * scale : side / 2;
    ctx.drawImage(sprite, agent.x - ox, agent.y - ox, side, side);
    if (tagged) {
      const tag = this.tags[agent.index];
      ctx.drawImage(tag.canvas, agent.x + 12, agent.y + (arrow ? 18 : 12), tag.w, TAG_H);
    }
    ctx.globalAlpha = 1;
  }

  /** A design tool's selection: an outline with corner handles. */
  selection(x: number, y: number, w: number, h: number, colour = BLUE, handles = true, alpha = 1) {
    const ctx = this.ctx;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1;
    ctx.strokeStyle = colour;
    ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(w), Math.round(h));
    if (handles) {
      ctx.fillStyle = "#ffffff";
      for (const [hx, hy] of [
        [x, y],
        [x + w, y],
        [x, y + h],
        [x + w, y + h],
      ]) {
        ctx.fillRect(Math.round(hx) - 3, Math.round(hy) - 3, 6, 6);
        ctx.strokeRect(Math.round(hx) - 2.5, Math.round(hy) - 2.5, 6, 6);
      }
    }
    ctx.globalAlpha = 1;
  }

  /** "172 × 38" under a box, as a design tool shows while drawing or selecting. */
  size(x: number, y: number, w: number, h: number, colour = BLUE) {
    const label = `${Math.round(w)} × ${Math.round(h)}`;
    this.ctx.font = FONT;
    const lw = this.ctx.measureText(label).width + 10;
    this.chip(x + w / 2 - lw / 2, y + h + 6, label, colour);
  }

  /** An empty shape: the default grey fill of a new rectangle (with a picture icon for images). */
  placeholder(x: number, y: number, w: number, h: number, dark: boolean, picture: boolean) {
    const ctx = this.ctx;
    ctx.fillStyle = dark ? "#3A3A37" : "#D9D9D9";
    ctx.fillRect(x, y, w, h);
    if (!picture || w < 40 || h < 30) return;
    const s = Math.min(36, w / 4, h / 3);
    const cx = x + w / 2;
    const cy = y + h / 2;
    ctx.strokeStyle = dark ? "#6E6E68" : "#8A8A8A";
    ctx.lineWidth = 1.6;
    ctx.lineJoin = "round";
    ctx.strokeRect(cx - s / 2, cy - s * 0.4, s, s * 0.8);
    ctx.beginPath();
    ctx.arc(cx - s * 0.18, cy - s * 0.12, s * 0.08, 0, Math.PI * 2);
    ctx.moveTo(cx - s / 2, cy + s * 0.3);
    ctx.lineTo(cx - s * 0.1, cy);
    ctx.lineTo(cx + s * 0.12, cy + s * 0.18);
    ctx.lineTo(cx + s * 0.25, cy + s * 0.06);
    ctx.lineTo(cx + s / 2, cy + s * 0.26);
    ctx.stroke();
  }

  /** Ruler guides: full-height lines at the edges of what is being drawn. */
  guides(xs: number[], alpha = 1) {
    const ctx = this.ctx;
    ctx.globalAlpha = 0.55 * alpha;
    ctx.fillStyle = BLUE;
    for (const x of xs) ctx.fillRect(Math.round(x), 0, 1, this.height);
    ctx.globalAlpha = 1;
  }

  /** Selected text: a translucent blue band over each line. */
  highlight(rects: DOMRect[]) {
    const ctx = this.ctx;
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = BLUE;
    for (const r of rects) ctx.fillRect(r.left, r.top, r.width, r.height);
    ctx.globalAlpha = 1;
  }

  caret(x: number, top: number, bottom: number, colour: string) {
    if (Math.floor(performance.now() / 420) % 2) return;
    this.ctx.fillStyle = colour;
    this.ctx.fillRect(Math.round(x) - 0.75, top, 1.5, bottom - top);
  }

  /** The distance a duplicate has been dragged: a red line with its length. */
  measure(x0: number, y0: number, x1: number, y1: number) {
    const ctx = this.ctx;
    const d = Math.hypot(x1 - x0, y1 - y0);
    if (d < 8) return;
    ctx.strokeStyle = RED;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.setLineDash([]);
    const label = String(Math.round(d));
    ctx.font = FONT;
    const lw = ctx.measureText(label).width + 10;
    this.chip((x0 + x1) / 2 - lw / 2, (y0 + y1) / 2 - TAG_H / 2, label, RED);
  }

  /** A small label: a size, a style being set, a file name. */
  chip(x: number, y: number, label: string, colour: string) {
    const ctx = this.ctx;
    ctx.font = FONT;
    const lw = ctx.measureText(label).width + 10;
    const lx = Math.min(Math.max(x, 4), this.width - lw - 4);
    const ly = Math.min(Math.max(y, 4), this.height - TAG_H - 4);
    ctx.fillStyle = colour;
    ctx.fillRect(lx, ly, lw, TAG_H);
    ctx.fillStyle = inkOn(colour.length === 7 ? colour : "#000000");
    ctx.textBaseline = "middle";
    ctx.fillText(label, lx + 5, ly + TAG_H / 2 + 0.5);
  }

  ring(x: number, y: number, radius: number, colour: string, alpha: number) {
    const ctx = this.ctx;
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}
