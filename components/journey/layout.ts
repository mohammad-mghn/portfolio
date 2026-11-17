export type Vec3 = { x: number; y: number; z: number };
export type Placement = "auto" | "start" | "end";
export type Weight = "major" | "minor";

/** How much flight a stop gets: recent ("major") stops sit further apart than early ones. */
export const stopGap = (w: Weight | undefined) => (w === "minor" ? 0.7 : 1);

export type JourneyLayout = {
  /** Card centres in world space (z goes into the screen, negative). */
  points: Vec3[];
  /** Oversized ghost year numerals, set back and to the opposite side for parallax. */
  ghosts: Vec3[];
  /** Pre-sampled Catmull-Rom curve through all stops (the glowing thread). */
  samples: Vec3[];
  /** Base distance between two stops; minor stops use a fraction of it (see `stopGap`). */
  depth: number;
  /** Distance from the first stop to the last. */
  length: number;
  perspective: number;
  cameraFollow: number;
};

type Options = {
  count: number;
  dir: "ltr" | "rtl";
  vw: number;
  vh: number;
  compact: boolean;
  placements?: Placement[];
  weights?: Weight[];
};

const catmull = (p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 => {
  const t2 = t * t;
  const t3 = t2 * t;
  const f = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
  return { x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y), z: f(p0.z, p1.z, p2.z, p3.z) };
};

export function sampleSpline(points: Vec3[], perSegment: number): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? points[i + 1];
    for (let s = 0; s < perSegment; s++) out.push(catmull(p0, p1, p2, p3, s / perSegment));
  }
  out.push(points[points.length - 1]);
  return out;
}

/**
 * Pure placement of the journey in 3D. Cards alternate lanes along a gentle sine and recede
 * into depth; RTL mirrors x so the first stop enters from the reading-start side.
 */
export function layoutJourney({ count, dir, vw, vh, compact, placements, weights }: Options): JourneyLayout {
  const depth = compact ? 1050 : 1500;
  const perspective = compact ? 900 : 1200;
  const lane = compact ? vw * 0.05 : Math.min(vw * 0.16, 320);
  const mirror = dir === "rtl" ? -1 : 1;

  let z = 0;
  const points: Vec3[] = Array.from({ length: count }, (_, i) => {
    const placement = placements?.[i] ?? "auto";
    const side = placement === "start" ? -1 : placement === "end" ? 1 : i % 2 === 0 ? -1 : 1;
    if (i > 0) z -= depth * stopGap(weights?.[i]);
    // Major cards are wider, so they sit a little closer to the centre line.
    const pull = weights?.[i] === "major" ? 0.85 : 1.1;
    return {
      x: side * lane * pull * mirror,
      y: Math.sin(i * 1.3) * vh * (compact ? 0.025 : 0.05),
      z,
    };
  });

  const ghosts = points.map((p) => ({
    x: compact ? 0 : -p.x * 2.6,
    y: p.y + vh * (compact ? -0.2 : -0.04),
    z: p.z - depth * 0.5,
  }));

  // The thread runs just beneath each card (cards would otherwise hide it), like a path on the ground.
  const drop = vh * (compact ? 0.33 : 0.36);
  const anchors = points.map((p) => ({ x: p.x * 1.15, y: p.y + drop, z: p.z + depth * 0.08 }));
  const first = anchors[0];
  const last = anchors[count - 1] ?? first;
  const controls: Vec3[] = [
    { x: first.x - lane * 2.4 * mirror, y: first.y + vh * 0.3, z: first.z + depth * 1.1 },
    ...anchors,
    { x: -last.x * 1.6, y: last.y - vh * 0.15, z: last.z - depth * 1.8 },
  ];

  return {
    points,
    ghosts,
    samples: sampleSpline(controls, compact ? 18 : 28),
    depth,
    length: -z,
    perspective,
    cameraFollow: compact ? 1 : 0.82,
  };
}

/** Camera position for a fractional stop index `p` (0 … count-1). */
export function cameraAt(layout: JourneyLayout, p: number): Vec3 {
  const { points, cameraFollow } = layout;
  const i = Math.max(0, Math.min(points.length - 1, Math.floor(p)));
  const j = Math.min(points.length - 1, i + 1);
  const f = p - i;
  const a = points[i];
  const b = points[j];
  return {
    x: (a.x + (b.x - a.x) * f) * cameraFollow,
    y: (a.y + (b.y - a.y) * f) * cameraFollow,
    z: -(a.z + (b.z - a.z) * f),
  };
}
