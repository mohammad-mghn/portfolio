/**
 * The agent build mode: as the visitor scrolls, the home page is rebuilt by a team of named agent
 * cursors working like designers in a design tool (see recipes.ts for how each piece is built).
 * Loaded only when the "click me :)" box is clicked (components/swarm/SwarmBox).
 *
 * How a piece moves through the mode:
 *   fresh     known, nothing done yet (still far below the screen)
 *   held      hidden, because it is about to come on screen (see builders.ts for how)
 *   eligible  on screen and waiting for an agent
 *   claimed   an agent is on its way
 *   build     the agent is working through the piece's recipe, step by step
 *   done      the real element is showing; never hidden again
 *
 * Rules that keep the page usable:
 *   - content that is already on screen is never hidden (except the first screen, on purpose, at start)
 *   - the more work is waiting, the faster the agents go
 *   - nothing waits on screen for an agent longer than a few seconds; then it is shown as it is
 *   - what is on screen is built first, nearest to where the visitor is reading: arriving at a
 *     section (however fast, even by jumping to it) starts building it at once, whatever is still
 *     being built further up
 *   - work already started, or waiting above the screen, carries on as agents come free: earlier
 *     sections keep building in the background instead of being shown half done
 *   - the whole page is built, wherever the mode starts: what is above the screen then is built
 *     when the visitor scrolls back up to it
 *
 * The tour (the button beside Stop) scrolls the page by itself, like a film: it slows down while
 * pieces on screen are being built and speeds up where there is nothing to build. Through the
 * journey it follows the journey's own pacing: a quick flight to each card, a pause on it. Any
 * scroll, swipe or key from the visitor hands the page back to them.
 */
import { whenBoundariesReady } from "@/lib/hydration";
import { createLayer, hold, keepHolding } from "./builders";
import { BLUE, HOME, PALETTE, Painter, ROAM, TRAVEL, WAITING, WORK, type Agent } from "./cursors";
import { ownPaint, pictureChanges, picturePreview, previewFor, recipe, type Api, type Ctx, type Job, type Piece, type Step } from "./recipes";
import { setSwarmMode, setSwarmProgress, setSwarmTour, tourSegments, whenParked } from "./store";
import { classify, discover, findSeeds, type Kind } from "./targets";

export type SwarmEngine = {
  /** Show everything at once, send the cursors home and end the mode. */
  stop(): Promise<void>;
  /** While a case study is open over the page: finish what is in progress and wait. */
  pause(paused: boolean): void;
  /** Immediate stop, for when the page is going away. */
  destroy(): void;
  /** Start or stop the tour: the page scrolls slowly to the end by itself while it is built. */
  tour(on: boolean): void;
};

type Phase = "fresh" | "held" | "eligible" | "claimed" | "build" | "done";

type Task = Job & {
  parent: Task | null;
  seed: boolean;
  phase: Phase;
  hold: Animation | null;
  inBand: boolean;
  inView: boolean;
  pastLine: boolean;
  upper: boolean;
  top: number;
  /** Part of the first screen, which is wiped and rebuilt on purpose when the mode starts. */
  first: boolean;
  /** While held: since when it has been on screen (0 while it is not). */
  seenSince: number;
  notBefore: number;
  eligibleAt: number;
  eligibleTop: number;
  deadline: number;
  graceUntil: number;
  agent: Agent | null;
  speed: number;
  steps: Step[];
  stepIndex: number;
  stepAt: number;
  progress: number;
  buildStart: number;
  /** Siblings that look alike (list items, chips, cards): all but the first are copies of another. */
  run: Task[] | null;
  copy: boolean;
  source: Task | null;
  /** Frames: pieces inside still unfinished. A piece counts as built once all of its pieces are. */
  kidsLeft: number;
  settled: boolean;
};

/** px per ms (2400 px/s), the same "flying past" speed the page's own reveals use. */
const FLYING = 2.4;
/** Longest a piece waits on screen for an agent before it is simply shown. */
const DEADLINE = 2600;
/** A piece already showing copied content (a duplicated card's texts) may wait this long for its edit. */
const COPY_DEADLINE = 12000;
/**
 * A copy waits this long for the piece it copies to be finished (a whole card is copied only once all
 * of it is built). After that it is built from scratch: nothing on screen stays blank waiting on a source.
 */
const COPY_WAIT = 900;
const GRACE = 1200;
/**
 * Safety: a held piece on screen gets an agent after this long even if the page never stops moving
 * (a trackpad's momentum, a slow tour) or it never crossed the reading line; and if something else
 * keeps it invisible for twice as long, it is let go, so nothing waits hidden on screen for ever.
 */
const HELD_ON_SCREEN = 2200;
const IDLE = 400;
/** The first screen is rebuilt within this long after the click. */
const FIRST_SCREEN = 7000;
/** Safety: no piece takes longer than this to build. */
const LONGEST_BUILD = 12000;
/** Everyone works this much faster than the step durations in recipes.ts. */
const PACE = 2.8;
/** Tour speeds, in screens per second: nothing to build on screen, a little, a lot. */
const TOUR_FREE = 1 / 6;
const TOUR_SOME = 1 / 14;
const TOUR_BUSY = 1 / 30;

const frame = () => new Promise<number>((resolve) => requestAnimationFrame(resolve));
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const onScreen = (r: DOMRect) => r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
const textKind = (kind: Kind) => kind === "type" || kind === "words" || kind === "pop";
/** Not really visible yet, though on screen: hidden or faded out by its own section. */
function faint(el: HTMLElement) {
  if (getComputedStyle(el).visibility === "hidden") return true;
  const match = /opacity\(([\d.]+)\)/.exec(el.style.filter);
  return match ? parseFloat(match[1]) < 0.55 : false;
}

export async function startSwarm({
  canvas,
  agents: count,
  origin,
  dock,
  scrollTo,
}: {
  canvas: HTMLCanvasElement;
  agents: number;
  /** Where the cursors burst out from: the box itself. */
  origin: () => { x: number; y: number };
  /** The box (Stop): waiting agents hide under it. */
  dock: () => DOMRect | null;
  /** Scroll the page to `y` at once (through the page's smooth scroll when it has one). */
  scrollTo: (y: number) => void;
}): Promise<SwarmEngine> {
  await whenBoundariesReady();
  await whenParked();
  // Let the reveal system's undo reach the page before measuring it.
  await frame();
  await frame();

  const root = document.getElementById("main");
  if (!root) throw new Error("swarm: no #main");

  const compact = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  const drawn = compact ? Math.min(40, count) : count;
  // Enough hands that a newly reached section starts at once while earlier ones are still going.
  const maxBusy = compact ? 18 : 56;
  const startedAt = performance.now();
  const layer = createLayer();

  /* ── Agents ── */
  const from = origin();
  const agents: Agent[] = Array.from({ length: drawn }, (_, index) => ({
    index,
    colour: PALETTE[index % PALETTE.length],
    x: from.x,
    y: from.y,
    // They burst out of the box and scatter before gathering by it.
    state: ROAM,
    tool: "arrow",
    aimX: Math.random() * window.innerWidth,
    aimY: window.innerHeight * (0.15 + Math.random() * 0.7),
    until: startedAt + 600 + Math.random() * 900,
    fromX: from.x,
    fromY: from.y,
    leftAt: 0,
    arriveAt: 0,
    press: 0,
  }));
  const jobs = new Map<Agent, Task>();
  const painter = new Painter(canvas, agents, compact);

  /**
   * Where an agent waits: hidden under the box, which is drawn over the cursors. A waiting cursor is
   * drawn at 0.7 size (an 18px square, its tip 2px in), so it fits wholly inside the box.
   */
  const slotOf = (agent: Agent) => {
    const box = dock();
    if (!box) return { x: window.innerWidth - 60, y: window.innerHeight - 40 };
    // Low-discrepancy spread: evenly mixed over the box, every agent in its own place.
    const u = (agent.index * 0.618034 + 0.17) % 1;
    const v = (agent.index * 0.754878 + 0.41) % 1;
    return { x: box.left + 4 + u * Math.max(0, box.width - 22), y: box.top + 4 + v * Math.max(0, box.height - 22) };
  };
  const dockPoint = () => {
    const box = dock();
    return box ? { x: box.left + box.width / 2, y: box.top - 30 } : { x: window.innerWidth / 2, y: window.innerHeight - 40 };
  };

  /* ── Tasks ── */
  const tasks: Task[] = [];
  const byEl = new WeakMap<Element, Task>();
  let seedsTotal = 0;
  let seedsSettled = 0;

  const flagsFrom = (task: Task) => {
    const r = task.el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const across = r.right > 0 && r.left < vw;
    task.top = r.top;
    task.inView = across && r.bottom > 0 && r.top < vh;
    task.inBand = r.right > -0.3 * vw && r.left < 1.3 * vw && r.bottom > -0.6 * vh && r.top < vh * 1.6;
    task.pastLine = across && r.bottom > 0 && r.top < vh * 0.88;
    task.upper = across && r.bottom > 0 && r.top < vh * 0.5;
  };

  const observer = (flag: "inBand" | "inView" | "pastLine" | "upper", rootMargin: string) =>
    new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const task = byEl.get(entry.target);
          if (!task) continue;
          task[flag] = entry.isIntersecting;
          task.top = entry.boundingClientRect.top;
        }
      },
      { rootMargin },
    );
  const observers = [
    observer("inBand", "60% 30% 60% 30%"),
    observer("inView", "0px"),
    observer("pastLine", "0px 0px -12% 0px"),
    observer("upper", "0px 0px -50% 0px"),
  ];

  function create(el: HTMLElement, kind: Kind, parent: Task | null, seed: boolean): Task {
    const task: Task = {
      el,
      kind,
      pieces: [],
      preview: null,
      twin: null,
      source: null,
      parent,
      seed,
      phase: "fresh",
      hold: null,
      inBand: false,
      inView: false,
      pastLine: false,
      upper: false,
      top: 0,
      first: parent?.first ?? false,
      seenSince: 0,
      notBefore: 0,
      eligibleAt: 0,
      eligibleTop: 0,
      deadline: 0,
      graceUntil: 0,
      agent: null,
      speed: 1,
      steps: [],
      stepIndex: 0,
      stepAt: 0,
      progress: 0,
      buildStart: 0,
      run: null,
      copy: false,
      kidsLeft: 0,
      settled: false,
    };
    flagsFrom(task);
    tasks.push(task);
    byEl.set(el, task);
    if (seed) seedsTotal += 1;
    return task;
  }

  /**
   * Worth duplicating: something with a shape (a card, a chip, a row with a rule, a picture) or
   * several fields (a number and a title, a bullet and a line). A plain paragraph is not: copying
   * it only to replace every word would be pointless, so it is typed fresh.
   */
  function worthCopying(task: Task) {
    if (task.kind === "frame" || task.kind === "media" || ownPaint(task.el)) return true;
    let fields = 0;
    for (const el of task.el.querySelectorAll<HTMLElement>("*")) {
      if (ownPaint(el)) return true;
      if ([...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.nodeValue?.trim())) fields += 1;
    }
    return fields >= 2;
  }

  /** Alike siblings in a row become a run: the first is built, the rest are copies of it. */
  function group(batch: Task[]) {
    let run: Task[] = [];
    const flush = () => {
      if (run.length >= 2) {
        for (const [i, task] of run.entries()) {
          task.run = run;
          task.copy = i > 0;
        }
      }
      run = [];
    };
    for (const task of batch) {
      const last = run[run.length - 1];
      const alike =
        last &&
        worthCopying(task) &&
        last.el.parentElement === task.el.parentElement &&
        last.el.tagName === task.el.tagName &&
        last.el.className === task.el.className &&
        last.kind === task.kind;
      if (!alike) flush();
      run.push(task);
    }
    flush();
  }

  const watch = (task: Task) => observers.forEach((o) => o.observe(task.el));
  const unwatch = (task: Task) => observers.forEach((o) => o.unobserve(task.el));

  /** A piece and everything inside it are finished: count it, and tell its frame. */
  function settle(task: Task) {
    if (task.settled) return;
    task.settled = true;
    if (task.seed) seedsSettled += 1;
    const parent = task.parent;
    if (parent) {
      parent.kidsLeft -= 1;
      if (parent.kidsLeft <= 0 && parent.phase === "done") settle(parent);
    }
  }

  function freeAgent(task: Task, now: number) {
    const agent = task.agent;
    task.agent = null;
    if (!agent) return;
    jobs.delete(agent);
    agent.press = 0;
    agent.tool = "arrow";
    agent.state = ROAM;
    agent.aimX = agent.x + (Math.random() - 0.5) * 60;
    agent.aimY = agent.y + (Math.random() - 0.5) * 40;
    agent.until = now + 350 + Math.random() * 400;
  }

  function clearPieces(task: Task) {
    for (const piece of task.pieces) piece.overlay.remove();
    task.pieces = [];
    task.preview?.overlay.remove();
    task.preview = null;
  }

  function markDone(task: Task, now: number) {
    task.phase = "done";
    freeAgent(task, now);
    unwatch(task);
    if (task.kidsLeft <= 0) settle(task);
  }

  /** Show a piece now, as it is: copies go, the real element shows. */
  function finish(task: Task, now: number) {
    if (task.phase === "done") return;
    task.hold?.cancel();
    task.hold = null;
    clearPieces(task);
    markDone(task, now);
  }

  const api: Api = {
    reveal(job) {
      const task = job as Task;
      // The copy and the real element now look the same: swap them in the same frame.
      task.hold?.cancel();
      task.hold = null;
      clearPieces(task);
      markDone(task, performance.now());
    },
    frameDone(job, twins) {
      frameDone(job as Task, twins, performance.now());
    },
  };

  /**
   * A frame is drawn: find the pieces inside it and hide them, then show the frame. A frame dropped
   * as a copy of a finished one shows the copied contents straight away (pictures, inner boxes),
   * and its texts as copies still saying what the original says, until an agent edits them.
   */
  function frameDone(task: Task, twins: HTMLElement[] | null, now: number) {
    const twinKids = twins ?? (task.source ? discover(task.source.el).map((d) => d.el) : null);
    const kids: Task[] = [];
    const cascade: [Task, HTMLElement][] = [];
    discover(task.el).forEach(({ el, kind }, i) => {
      if (byEl.has(el)) return;
      const kid = create(el, kind, task, false);
      kid.hold = hold(el);
      kid.phase = "held";
      const twin = twinKids?.[i];
      if (twin && twin.tagName === el.tagName && twin.className === el.className) {
        kid.twin = twin;
        if (textKind(kind)) kid.preview = previewFor(kid, twin, layer);
        else cascade.push([kid, twin]);
      }
      watch(kid);
      kids.push(kid);
    });
    group(kids.filter((kid) => !kid.twin));
    task.kidsLeft = kids.length;
    task.hold?.cancel();
    task.hold = null;
    clearPieces(task);
    fades.push({ el: task.el, at: now });
    markDone(task, now);
    // Inside a duplicated card: inner boxes come along with the copy; a picture shows the copied
    // one until an agent drags the right file onto it (one that is the same simply shows).
    for (const [kid, twin] of cascade) {
      if (kid.kind === "frame") frameDone(kid, discover(twin).map((d) => d.el), now);
      else if (kid.kind === "media" && pictureChanges(kid.el, twin)) kid.preview = picturePreview(twin, layer);
      else api.reveal(kid);
    }
  }

  /* ── Building ── */

  /** The nearest finished sibling on screen, ready to be copied (a card only once all of it is built). */
  function sourceFor(task: Task): Task | null {
    if (!task.run) return null;
    const at = task.run.indexOf(task);
    let best: Task | null = null;
    let gap = Infinity;
    for (const [i, other] of task.run.entries()) {
      if (other === task || other.phase !== "done") continue;
      if (other.kind === "frame" && !other.settled) continue;
      if (!onScreen(other.el.getBoundingClientRect())) continue;
      if (Math.abs(i - at) < gap) {
        gap = Math.abs(i - at);
        best = other;
      }
    }
    return best;
  }

  function context(task: Task, agent: Agent, now: number): Ctx {
    return { job: task, agent, rect: task.el.getBoundingClientRect(), now, layer, painter, dock: dockPoint };
  }

  function follow(task: Task, rect: DOMRect) {
    const place = (piece: Piece) => piece.overlay.place(rect.left + piece.dx, rect.top + piece.dy);
    task.pieces.forEach(place);
    if (task.preview) place(task.preview);
  }

  function claim(task: Task, agent: Agent, now: number, speed: number) {
    task.source = task.copy && !task.twin ? sourceFor(task) : null;
    task.speed = speed;
    task.phase = "claimed";
    task.agent = agent;
    jobs.set(agent, task);
    task.steps = recipe(task, api);
    const to = task.steps[0]?.at(context(task, agent, now), 0) ?? { x: agent.x, y: agent.y };
    const distance = Math.hypot(to.x - agent.x, to.y - agent.y);
    agent.state = TRAVEL;
    agent.tool = "arrow";
    agent.fromX = agent.x;
    agent.fromY = agent.y;
    agent.leftAt = now;
    agent.arriveAt = now + Math.max(90, clamp(distance / 1.6, 140, 560) / speed);
  }

  function nearestAgent(x: number, y: number) {
    let best: Agent | null = null;
    let bestD = Infinity;
    for (const agent of agents) {
      if (agent.state === TRAVEL || agent.state === WORK) continue;
      const d = (agent.x - x) ** 2 + (agent.y - y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = agent;
      }
    }
    return best;
  }

  function begin(task: Task, now: number) {
    task.phase = "build";
    task.buildStart = now;
    task.stepIndex = 0;
    task.stepAt = now;
    const agent = task.agent;
    if (!agent) return;
    agent.state = WORK;
    task.steps[0]?.start?.(context(task, agent, now));
  }

  /** Run the current step; move on (possibly through several instant steps) when it is done. */
  function work(task: Task, now: number) {
    const agent = task.agent;
    if (!agent) return;
    const c = context(task, agent, now);
    follow(task, c.rect);
    for (let guard = 0; guard < 20 && task.phase === "build"; guard++) {
      const step = task.steps[task.stepIndex];
      if (!step) {
        api.reveal(task);
        break;
      }
      const ms = step.ms / task.speed;
      const p = ms <= 0 ? 1 : clamp((now - task.stepAt) / ms, 0, 1);
      step.update?.(c, p);
      const at = step.at(c, p);
      agent.x = at.x;
      agent.y = at.y;
      agent.press = at.press ?? 0;
      agent.tool = step.tool;
      task.progress = p;
      if (p < 1) break;
      step.end?.(c);
      if (task.phase !== "build") break;
      task.stepIndex += 1;
      task.stepAt = now;
      task.steps[task.stepIndex]?.start?.(c);
      follow(task, c.rect);
    }
  }

  /* ── Outlines that linger a moment after a frame is drawn ── */
  const fades: { el: HTMLElement; at: number }[] = [];

  /* ── The loop ── */
  let raf = 0;
  let last = performance.now();
  let lastY = window.scrollY;
  let lastScrollAt = last;
  let velocity = 0;
  let paused = false;
  let stopping = false;

  /* ── The tour ── */
  let touring = false;
  let tourY = 0;
  let tourSpeed = 0;
  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

  /** Pieces on screen that are being built or are about to be. */
  function buildingOnScreen() {
    let n = 0;
    for (const task of tasks) {
      if (task.phase === "eligible" || task.phase === "claimed" || task.phase === "build") n += task.inView ? 1 : 0;
      else if (task.phase === "held" && task.pastLine) n += 1;
    }
    return n;
  }

  function setTour(on: boolean) {
    if (on && (stopping || paused)) return;
    if (touring === on) return;
    touring = on;
    if (on) {
      // From the end, the tour starts again at the top.
      if (window.scrollY >= maxScroll() - 4) scrollTo(0);
      tourY = window.scrollY;
      tourSpeed = 0;
    }
    setSwarmTour(on);
  }

  function tourStep(dt: number) {
    if (!touring) return;
    // The visitor moved the page some other way (scrollbar, a link): they are in charge again.
    if (Math.abs(window.scrollY - tourY) > 48) {
      setTour(false);
      return;
    }
    // A section with its own pacing (the journey) says how long each stretch takes. The tour brakes
    // a moment before a slower stretch (a card to rest on), so it is already slow when it gets there.
    const segments = tourSegments();
    const speedAt = (y: number) => {
      const segment = segments.find((s) => y >= s.from && y < s.to);
      return segment ? (segment.to - segment.from) / segment.ms : null;
    };
    const paced = speedAt(tourY);
    const ahead = speedAt(tourY + tourSpeed * 300);
    let want: number;
    if (paced !== null) want = ahead !== null ? Math.min(paced, ahead) : paced;
    else {
      const busy = buildingOnScreen();
      want = ((busy === 0 ? TOUR_FREE : busy < 4 ? TOUR_SOME : TOUR_BUSY) * window.innerHeight) / 1000;
      if (ahead !== null) want = Math.min(want, ahead);
    }
    tourSpeed += (want - tourSpeed) * (1 - Math.exp(-dt / (paced !== null || ahead !== null ? 150 : 500)));
    const end = maxScroll();
    tourY = Math.min(end, tourY + tourSpeed * dt);
    scrollTo(tourY);
    if (tourY >= end - 0.5) setTour(false);
  }

  // Any scroll, swipe or navigation key from the visitor ends the tour.
  const handBack = () => setTour(false);
  const onKey = (event: KeyboardEvent) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key) && !(event.target instanceof HTMLButtonElement)) handBack();
  };
  window.addEventListener("wheel", handBack, { passive: true });
  window.addEventListener("touchstart", handBack, { passive: true });
  window.addEventListener("keydown", onKey);

  /** Still close above or below the screen (horizontal position and clipping aside). */
  const nearby = (task: Task) => {
    const r = task.el.getBoundingClientRect();
    return r.bottom > -0.6 * window.innerHeight && r.top < 1.6 * window.innerHeight;
  };

  function update(now: number, flying: boolean, idle: boolean) {
    let backlog = 0;
    let busy = 0;
    for (const task of tasks) {
      if (task.preview && task.phase !== "done" && task.phase !== "build") follow(task, task.el.getBoundingClientRect());
      switch (task.phase) {
        case "done":
          break;
        case "fresh":
          if (paused) break;
          // About to come on screen, or just arrived (a fast scroll or a jump): hide it, then build it.
          if (task.inView || task.inBand) {
            task.hold = hold(task.el);
            task.phase = "held";
          }
          break;
        case "held":
          if (paused) {
            finish(task, now);
            break;
          }
          if (task.hold) {
            keepHolding(task.hold);
            if (task.hold.playState === "finished") {
              task.hold = null;
              finish(task, now);
              break;
            }
          }
          // Out of the band: let it go until it comes near again, unless it is only out sideways
          // (cards in a row that slides). A copy already showing its copied content is shown as is.
          if (!task.inBand && !task.first && !nearby(task)) {
            if (task.preview) finish(task, now);
            else {
              task.hold?.cancel();
              task.hold = null;
              task.seenSince = 0;
              task.phase = "fresh";
            }
            break;
          }
          task.seenSince = task.inView ? task.seenSince || now : 0;
          const overdue = task.seenSince > 0 && now - task.seenSince > HELD_ON_SCREEN;
          if (overdue && now - task.seenSince > HELD_ON_SCREEN * 2 && faint(task.el)) {
            finish(task, now);
            break;
          }
          const ready = !flying && now >= task.notBefore && (task.pastLine || idle || task.first);
          if (task.inView && (ready || overdue) && !faint(task.el)) {
            task.phase = "eligible";
            task.eligibleAt = now;
            task.eligibleTop = task.el.getBoundingClientRect().top;
            // Blank while waiting (no copied content showing yet): the normal deadline.
            const wait = task.preview ? COPY_DEADLINE : DEADLINE;
            task.deadline = Math.max(now + wait, task.first ? startedAt + FIRST_SCREEN : 0);
            task.graceUntil = Math.max(now + GRACE, task.first ? startedAt + FIRST_SCREEN : 0);
          }
          break;
        case "eligible":
        case "claimed": {
          // Off screen, nobody is waiting on it: its clock stops, and it is built when an agent is free.
          if (!task.inView) task.deadline = Math.max(task.deadline, now + DEADLINE);
          if (paused || now > task.deadline) {
            finish(task, now);
            break;
          }
          if (task.hold) keepHolding(task.hold);
          if (task.phase === "eligible" && faint(task.el)) {
            task.deadline = now + DEADLINE;
            break;
          }
          backlog += 1;
          if (task.phase === "claimed") {
            busy += 1;
            if (task.agent && now >= task.agent.arriveAt) begin(task, now);
          }
          break;
        }
        case "build":
          if (paused || now - task.buildStart > LONGEST_BUILD) {
            finish(task, now);
            break;
          }
          if (task.hold) keepHolding(task.hold);
          busy += 1;
          work(task, now);
          break;
      }
    }

    // The more is waiting, the faster everyone works, and faster again while the page scrolls quickly.
    const speed = PACE * clamp(1 + backlog / 10, 1, 4) * (Math.abs(velocity) > 1.2 ? 1.3 : 1);
    // On screen first, nearest to where the visitor reads (a third of the way down); then the rest
    // in page order, so sections above keep building in the background.
    const reading = window.innerHeight * 0.35;
    const queue = tasks
      .filter((task) => task.phase === "eligible")
      .map((task, order) => ({ task, order, rank: task.inView ? Math.abs(task.top - reading) : 1e6 + order }))
      .sort((a, b) => a.rank - b.rank || a.order - b.order)
      .map(({ task }) => task);
    for (const task of queue) {
      if (busy >= maxBusy) break;
      if (faint(task.el)) continue;
      // A copy waits a moment for the piece it copies (a whole card is copied only once it is complete),
      // then is built from scratch rather than leaving a blank on screen.
      if (task.copy && !task.twin && !sourceFor(task) && now < task.eligibleAt + COPY_WAIT) continue;
      const at = task.el.getBoundingClientRect();
      const agent = nearestAgent(at.left, at.top);
      if (!agent) break;
      claim(task, agent, now, speed);
      busy += 1;
    }
  }

  function moveAgents(now: number, dt: number) {
    for (const agent of agents) {
      if (agent.state === TRAVEL) {
        const task = jobs.get(agent);
        if (!task) {
          agent.state = ROAM;
          continue;
        }
        const to = task.steps[0]?.at(context(task, agent, now), 0) ?? { x: agent.x, y: agent.y };
        const p = clamp((now - agent.leftAt) / Math.max(1, agent.arriveAt - agent.leftAt), 0, 1);
        const e = easeInOut(p);
        agent.x = agent.fromX + (to.x - agent.fromX) * e;
        agent.y = agent.fromY + (to.y - agent.fromY) * e;
        agent.press = 0;
        agent.tool = "arrow";
      } else if (agent.state !== WORK) {
        if (agent.state === ROAM && now > agent.until) agent.state = HOME;
        if (agent.state === HOME || agent.state === WAITING) {
          const slot = slotOf(agent);
          agent.aimX = slot.x;
          agent.aimY = slot.y;
          if (agent.state === WAITING) {
            agent.x = slot.x;
            agent.y = slot.y;
          }
        }
        const f = 1 - Math.exp(-dt / (agent.state === WAITING ? 90 : agent.state === HOME ? 230 : 160));
        agent.x += (agent.aimX - agent.x) * f;
        agent.y += (agent.aimY - agent.y) * f;
        agent.press = 0;
        agent.tool = "arrow";
        if (agent.state === HOME && Math.hypot(agent.aimX - agent.x, agent.aimY - agent.y) < 2) agent.state = WAITING;
      }
    }
  }

  function draw(now: number) {
    painter.clear();
    for (let i = fades.length - 1; i >= 0; i--) {
      const age = now - fades[i].at;
      if (age > 420) {
        fades.splice(i, 1);
        continue;
      }
      const r = fades[i].el.getBoundingClientRect();
      painter.selection(r.left, r.top, r.width, r.height, BLUE, true, 1 - age / 420);
    }
    for (const [agent, task] of jobs) {
      if (task.phase !== "build") continue;
      const step = task.steps[task.stepIndex];
      if (!step) continue;
      step.draw?.(context(task, agent, now), task.progress);
      if (step.label) painter.chip(agent.x + 14, agent.y + 38, step.label, BLUE);
    }
    // Idle cursors fade out as they fly home and are not drawn at all once docked: only working
    // agents (and ones on their way to or from a job) are ever on screen.
    for (const agent of agents) {
      if (agent.state === WAITING) continue;
      let alpha = 1;
      if (agent.state === HOME) {
        const slot = slotOf(agent);
        alpha = clamp((Math.hypot(slot.x - agent.x, slot.y - agent.y) - 12) / 140, 0, 1);
        if (alpha <= 0.01) continue;
      }
      painter.cursor(agent, agent.state === TRAVEL || agent.state === WORK, 1, alpha);
    }
  }

  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(50, now - last);
    last = now;
    const y = window.scrollY;
    if (y !== lastY) lastScrollAt = now;
    velocity = velocity * 0.6 + (dt > 0 ? (y - lastY) / dt : 0) * 0.4;
    lastY = y;
    if (!stopping) update(now, Math.abs(velocity) > FLYING, now - lastScrollAt > IDLE);
    if (!stopping && !paused) tourStep(dt);
    moveAgents(now, dt);
    draw(now);
    if (!stopping) setSwarmProgress(seedsTotal ? seedsSettled / seedsTotal : 1);
  }

  /* ── Start: the first screen goes blank and is rebuilt; the rest waits until it comes near ── */
  const seeds: Task[] = [];
  for (const el of findSeeds(root)) {
    const box = el.getBoundingClientRect();
    const task = create(el, classify(el, box), null, true);
    seeds.push(task);
    // Above the screen: it stays as it is for now, and is built when the visitor scrolls back up.
    if (task.inView) {
      task.first = true;
      task.hold = hold(el);
      task.phase = "held";
      task.notBefore = startedAt + 250;
    }
    watch(task);
  }
  group(seeds);

  /* ── Things that end or pause the build ── */
  const onResize = () => {
    painter.resize();
    // Measurements are stale: show whatever is in progress.
    const now = performance.now();
    for (const task of tasks) if (task.phase === "build" || task.phase === "claimed" || task.phase === "eligible") finish(task, now);
  };
  const onVisibility = () => {
    if (document.visibilityState !== "hidden") return;
    const now = performance.now();
    for (const task of tasks) if (task.phase !== "fresh") finish(task, now);
  };
  // Keyboard users must never land on something invisible.
  const onFocus = (event: FocusEvent) => {
    const now = performance.now();
    for (let el = event.target as Element | null; el && el !== root; el = el.parentElement) {
      const task = byEl.get(el);
      if (task && task.phase !== "done") finish(task, now);
    }
  };
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibility);
  document.addEventListener("focusin", onFocus);

  function showEverything() {
    for (const task of tasks) {
      task.hold?.cancel();
      task.hold = null;
      task.pieces = [];
      task.preview = null;
    }
    layer.replaceChildren();
    // Safety net: any swarm animation left anywhere.
    for (const animation of document.getAnimations()) {
      if (animation.id.startsWith("swarm-")) animation.cancel();
    }
    observers.forEach((o) => o.disconnect());
  }

  function teardown() {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
    document.removeEventListener("focusin", onFocus);
    window.removeEventListener("wheel", handBack);
    window.removeEventListener("touchstart", handBack);
    window.removeEventListener("keydown", onKey);
    setTour(false);
    painter.clear();
    layer.remove();
    setSwarmMode("off");
  }

  setSwarmMode("on");
  raf = requestAnimationFrame(tick);

  return {
    async stop() {
      if (stopping) return;
      setTour(false);
      stopping = true;
      showEverything();
      jobs.clear();
      // The cursors fly back into the box, then the page is itself again.
      const box = origin();
      for (const agent of agents) {
        agent.state = ROAM;
        agent.until = Infinity;
        agent.aimX = box.x;
        agent.aimY = box.y;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 340));
      teardown();
    },
    pause(next) {
      if (paused === next) return;
      paused = next;
      if (!paused) return;
      setTour(false);
      const now = performance.now();
      for (const task of tasks) if (task.phase !== "fresh" && task.phase !== "done") finish(task, now);
    },
    destroy() {
      stopping = true;
      showEverything();
      teardown();
    },
    tour(on) {
      setTour(on);
    },
  };
}
