/**
 * The agent build mode: as the visitor scrolls, the home page is rebuilt piece by piece by a swarm
 * of named agent cursors. Loaded only when the "click me :)" box is clicked (components/swarm/SwarmBox).
 *
 * How a piece moves through the mode:
 *   fresh     known, nothing done yet (still far below the screen)
 *   held      hidden, because it is about to come on screen (see builders.ts for how)
 *   eligible  on screen and waiting for an agent
 *   claimed   an agent is on its way (to the piece, or to the item it will copy)
 *   build     the agent is working on it, in steps:
 *               drag     a copy of a finished sibling is dragged into place (lists, chips, cards)
 *               outline  a box is dragged out with its size (containers, pictures)
 *               load     a picture arrives: scanned in, blurred, then sharp, with its file name
 *               press    a small thing is clicked into place
 *               type     its text is typed, character by character, with a caret
 *   done      visible and finished; never hidden again
 *
 * Rules that keep the page from ever looking empty:
 *   - content that is already on screen is never hidden (except the first screen, on purpose, at start)
 *   - the more work is waiting, the faster the agents go (up to 6x)
 *   - nothing waits on screen longer than about a second; then it is shown at once
 *   - scrolling very fast shows everything at once, with no animation
 *   - anything scrolled into the top half of the screen unbuilt is shown at once
 */
import { whenBoundariesReady } from "@/lib/hydration";
import { createLayer, fadeIn, fileName, Ghost, hold, keepHolding, loadIn, Typist } from "./builders";
import { HOME, PALETTE, PARKED, Painter, ROAM, TRAVEL, WORK, type Agent } from "./cursors";
import { setSwarmMode, setSwarmProgress, whenParked } from "./store";
import { classify, discover, findSeeds, type Kind } from "./targets";

export type SwarmEngine = {
  /** Show everything at once, send the cursors home and end the mode. */
  stop(): Promise<void>;
  /** While a case study is open over the page: finish what is in progress and wait. */
  pause(paused: boolean): void;
  /** Immediate stop, for when the page is going away. */
  destroy(): void;
};

type Phase = "fresh" | "held" | "eligible" | "claimed" | "build" | "done";
type Step = "" | "drag" | "outline" | "load" | "press" | "type";

type Task = {
  el: HTMLElement;
  kind: Kind;
  parent: Task | null;
  seed: boolean;
  phase: Phase;
  hold: Animation | null;
  anim: Animation | null;
  /** Kept up to date by the observers. */
  inBand: boolean;
  inView: boolean;
  pastLine: boolean;
  upper: boolean;
  top: number;
  /** Part of the first screen, which is wiped and rebuilt on purpose when the mode starts. */
  first: boolean;
  notBefore: number;
  eligibleAt: number;
  eligibleTop: number;
  deadline: number;
  graceUntil: number;
  agent: Agent | null;
  speed: number;
  step: Step;
  stepAt: number;
  stepFor: number;
  typeFor: number;
  typist: Typist | null;
  ghost: Ghost | null;
  /** Siblings that look alike (list items, chips, cards): all but the first are copies of another. */
  run: Task[] | null;
  copy: boolean;
  source: Task | null;
  label: string;
  clicked: boolean;
  /** Frames: pieces inside still unfinished. A piece counts as built once all of its pieces are. */
  kidsLeft: number;
  settled: boolean;
};

/** px per ms (2400 px/s), the same "flying past" speed the page's own reveals use. */
const FLYING = 2.4;
const DEADLINE = 1100;
const GRACE = 500;
const IDLE = 400;
/** The first screen is rebuilt within this long after the click. */
const FIRST_SCREEN = 3200;
/** A copy waits this long for the item it copies to be finished, then is built on its own. */
const COPY_WAIT = 400;
/** Longest a piece may stay out of sight once it is on screen, travel and dragging included. */
const UNSEEN = 1600;

const frame = () => new Promise<number>((resolve) => requestAnimationFrame(resolve));
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const isRtl = (el: HTMLElement) => getComputedStyle(el).direction === "rtl";
const onScreen = (r: DOMRect) => r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
/**
 * Not really visible yet, though on screen: hidden or faded out by its own section (the journey's
 * cards wait in the distance like this until the camera reaches them).
 */
function faint(el: HTMLElement) {
  if (getComputedStyle(el).visibility === "hidden") return true;
  const match = /opacity\(([\d.]+)\)/.exec(el.style.filter);
  return match ? parseFloat(match[1]) < 0.55 : false;
}

export async function startSwarm({
  canvas,
  agents: count,
  origin,
}: {
  canvas: HTMLCanvasElement;
  agents: number;
  /** Where the cursors come from and go back to: the box itself. */
  origin: () => { x: number; y: number };
}): Promise<SwarmEngine> {
  await whenBoundariesReady();
  await whenParked();
  // Let the reveal system's undo reach the page before measuring it.
  await frame();
  await frame();

  const root = document.getElementById("main");
  if (!root) throw new Error("swarm: no #main");

  const compact = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  const drawn = compact ? Math.min(30, count) : count;
  const maxBusy = compact ? 8 : 24;
  const startedAt = performance.now();
  const layer = createLayer();

  /* ── Agents ── */
  const from = origin();
  const agents: Agent[] = Array.from({ length: drawn }, (_, index) => ({
    index,
    colour: PALETTE[index % PALETTE.length],
    x: from.x,
    y: from.y,
    // They burst out of the box and scatter before settling at the edges.
    state: ROAM,
    aimX: Math.random() * window.innerWidth,
    aimY: window.innerHeight * (0.15 + Math.random() * 0.8),
    until: startedAt + 700 + Math.random() * 1100,
    fromX: from.x,
    fromY: from.y,
    leftAt: 0,
    arriveAt: 0,
    press: 0,
  }));
  const jobs = new Map<Agent, Task>();
  const painter = new Painter(canvas, agents, compact);

  /** Where an idle agent waits: just outside the left, right or bottom edge. */
  const homeOf = (agent: Agent) => {
    const f = (agent.index * 0.618034) % 1;
    const side = agent.index % 3;
    if (side === 0) return { x: -40, y: window.innerHeight * f };
    if (side === 1) return { x: window.innerWidth + 40, y: window.innerHeight * f };
    return { x: window.innerWidth * f, y: window.innerHeight + 40 };
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
    task.inBand = r.right > -0.3 * vw && r.left < 1.3 * vw && r.bottom > 0 && r.top < vh * 1.6;
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
    observer("inBand", "0px 30% 60% 30%"),
    observer("inView", "0px"),
    observer("pastLine", "0px 0px -12% 0px"),
    observer("upper", "0px 0px -50% 0px"),
  ];

  function create(el: HTMLElement, kind: Kind, parent: Task | null, seed: boolean): Task {
    const task: Task = {
      el,
      kind,
      parent,
      seed,
      phase: "fresh",
      hold: null,
      anim: null,
      inBand: false,
      inView: false,
      pastLine: false,
      upper: false,
      top: 0,
      first: parent?.first ?? false,
      notBefore: 0,
      eligibleAt: 0,
      eligibleTop: 0,
      deadline: 0,
      graceUntil: 0,
      agent: null,
      speed: 1,
      step: "",
      stepAt: 0,
      stepFor: 1,
      typeFor: 1,
      typist: null,
      ghost: null,
      run: null,
      copy: false,
      source: null,
      label: "",
      clicked: false,
      kidsLeft: 0,
      settled: false,
    };
    flagsFrom(task);
    tasks.push(task);
    byEl.set(el, task);
    if (seed) seedsTotal += 1;
    return task;
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
    agent.state = ROAM;
    agent.aimX = agent.x + (Math.random() - 0.5) * 140;
    agent.aimY = agent.y + (Math.random() - 0.5) * 100;
    agent.until = now + 450 + Math.random() * 500;
  }

  function markDone(task: Task, now: number) {
    task.phase = "done";
    task.step = "";
    freeAgent(task, now);
    unwatch(task);
    if (task.kidsLeft <= 0) settle(task);
  }

  /** Show a piece now, whatever it was doing: nothing of it stays hidden. */
  function finish(task: Task, now: number) {
    if (task.phase === "done") return;
    task.hold?.cancel();
    task.anim?.cancel();
    task.typist?.remove();
    task.ghost?.remove();
    task.hold = null;
    task.anim = null;
    task.typist = null;
    task.ghost = null;
    markDone(task, now);
  }

  /* ── Building ── */

  /** The nearest finished sibling on screen, to copy from. */
  function sourceFor(task: Task): Task | null {
    if (!task.run) return null;
    const at = task.run.indexOf(task);
    let best: Task | null = null;
    let gap = Infinity;
    for (const [i, other] of task.run.entries()) {
      if (other === task || other.phase !== "done" || !onScreen(other.el.getBoundingClientRect())) continue;
      if (Math.abs(i - at) < gap) {
        gap = Math.abs(i - at);
        best = other;
      }
    }
    return best;
  }

  /** Where the agent goes first, in screen coordinates. */
  function startPoint(task: Task) {
    if (task.source && task.phase === "claimed") {
      const s = task.source.el.getBoundingClientRect();
      return { x: s.left + Math.min(s.width, 160) / 2, y: s.top + Math.min(s.height, 60) / 2 };
    }
    const r = task.el.getBoundingClientRect();
    const rtl = isRtl(task.el);
    if (task.kind === "frame" || task.kind === "media") return { x: rtl ? r.right : r.left, y: r.top };
    if (task.kind === "pop") return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    return { x: rtl ? r.right : r.left, y: r.top + Math.min(r.height, 60) / 2 };
  }

  function claim(task: Task, agent: Agent, now: number, speed: number) {
    task.source = task.copy ? sourceFor(task) : null;
    task.speed = speed;
    task.phase = "claimed";
    task.agent = agent;
    jobs.set(agent, task);
    const to = startPoint(task);
    const distance = Math.hypot(to.x - agent.x, to.y - agent.y);
    agent.state = TRAVEL;
    agent.fromX = agent.x;
    agent.fromY = agent.y;
    agent.leftAt = now;
    agent.arriveAt = now + Math.max(90, clamp(distance / 1.5, 140, 520) / speed);
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

  function setStep(task: Task, step: Step, duration: number, now: number) {
    task.step = step;
    task.stepAt = now;
    task.stepFor = Math.max(1, duration);
  }

  const outlineTime = (el: HTMLElement, k: number) => {
    const r = el.getBoundingClientRect();
    return Math.max(140, clamp(Math.hypot(r.width, Math.min(r.height, window.innerHeight)) / 1.8, 260, 650) / k);
  };

  /** The agent has arrived: start the first step. */
  function begin(task: Task, now: number) {
    task.phase = "build";
    if (task.agent) task.agent.state = WORK;
    if (task.source && task.agent) {
      task.ghost = new Ghost(task.source.el, layer, task.agent.colour);
      const s = task.source.el.getBoundingClientRect();
      const r = task.el.getBoundingClientRect();
      setStep(task, "drag", Math.max(160, clamp(Math.hypot(r.left - s.left, r.top - s.top) / 1.6, 240, 480) / task.speed), now);
      return;
    }
    startKind(task, now, false);
  }

  /** The step that builds the piece itself. `copied`: it was just dropped in as a copy. */
  function startKind(task: Task, now: number, copied: boolean) {
    const k = task.speed;
    const el = task.el;
    if (task.kind === "frame") {
      if (copied) frameDone(task, now);
      else setStep(task, "outline", outlineTime(el, k), now);
      return;
    }
    if (task.kind === "media") {
      task.label = fileName(el);
      if (copied) startLoad(task, now);
      else setStep(task, "outline", outlineTime(el, k) * 0.8, now);
      return;
    }
    // Text: typed into an exact copy of the element, laid over it.
    const characters = (el.textContent ?? "").length;
    const typist = new Typist(el, layer, characters > 420 ? "word" : "grapheme");
    if (!typist.size) {
      typist.remove();
      task.hold?.cancel();
      task.hold = null;
      task.anim = fadeIn(el, 160);
      markDone(task, now);
      return;
    }
    task.typist = typist;
    const per = task.kind === "pop" ? 20 : 34;
    const longest = task.kind === "pop" ? 700 : task.kind === "type" ? 1500 : 1800;
    task.typeFor = Math.max(160, clamp(typist.size * per, 240, longest) / k);
    if (task.kind === "pop" && !copied) setStep(task, "press", Math.max(80, 150 / k), now);
    else setStep(task, "type", task.typeFor, now);
  }

  function startLoad(task: Task, now: number) {
    const duration = Math.max(220, 900 / task.speed);
    task.hold?.cancel();
    task.hold = null;
    task.anim = loadIn(task.el, duration);
    setStep(task, "load", duration, now);
  }

  /** The outline is drawn: find the pieces inside, hide them, then let the frame itself appear. */
  function frameDone(task: Task, now: number) {
    const kids: Task[] = [];
    for (const { el, kind } of discover(task.el)) {
      if (byEl.has(el)) continue;
      const kid = create(el, kind, task, false);
      kid.hold = hold(el, false);
      kid.phase = "held";
      watch(kid);
      kids.push(kid);
    }
    group(kids);
    task.kidsLeft = kids.length;
    task.hold?.cancel();
    task.hold = null;
    task.anim = fadeIn(task.el, 140);
    fades.push({ el: task.el, colour: task.agent?.colour ?? PALETTE[0], at: now });
    markDone(task, now);
  }

  function work(task: Task, now: number) {
    const agent = task.agent;
    const p = clamp((now - task.stepAt) / task.stepFor, 0, 1);
    const r = task.el.getBoundingClientRect();
    switch (task.step) {
      case "drag": {
        const s = (task.source ?? task).el.getBoundingClientRect();
        const e = easeInOut(p);
        const x = s.left + (r.left - s.left) * e;
        const y = s.top + (r.top - s.top) * e;
        task.ghost?.place(x, y);
        if (agent) {
          agent.x = x + Math.min(r.width, 160) / 2;
          agent.y = y + Math.min(r.height, 60) / 2;
          agent.press = 1;
        }
        if (p >= 1) {
          task.ghost?.remove();
          task.ghost = null;
          startKind(task, now, true);
        }
        break;
      }
      case "outline": {
        const rtl = isRtl(task.el);
        const e = easeOut(p);
        const x0 = rtl ? r.right : r.left;
        const x1 = rtl ? r.left : r.right;
        if (agent) {
          agent.x = x0 + (x1 - x0) * e;
          agent.y = r.top + r.height * e;
          agent.press = 1;
        }
        if (p >= 1) {
          if (task.kind === "frame") frameDone(task, now);
          else startLoad(task, now);
        }
        break;
      }
      case "load": {
        // The scan reaches the bottom at 60% of the load; the rest is the picture sharpening.
        const scan = Math.min(1, p / 0.6);
        if (agent) {
          agent.x = r.left + r.width * (0.5 + 0.3 * Math.sin(scan * Math.PI * 2));
          agent.y = r.top + r.height * scan;
          agent.press = 0;
        }
        if (p >= 1) {
          task.anim = null; // it has ended on its own: no fill, so the picture is simply visible
          markDone(task, now);
        }
        break;
      }
      case "press": {
        task.typist?.place(r.left, r.top);
        if (agent) {
          agent.x = r.left + r.width / 2;
          agent.y = r.top + r.height / 2;
          agent.press = 1;
        }
        if (!task.clicked && agent) {
          task.clicked = true;
          rings.push({ el: task.el, colour: agent.colour, at: now });
        }
        if (p >= 1) setStep(task, "type", task.typeFor, now);
        break;
      }
      case "type": {
        const typist = task.typist;
        if (!typist) break;
        typist.place(r.left, r.top);
        typist.show(p >= 1 ? typist.size : Math.floor(p * (typist.size + 1)));
        if (agent) {
          agent.x = r.left + typist.caret.x + (typist.rtl ? -3 : 3);
          agent.y = r.top + (typist.caret.top + typist.caret.bottom) / 2;
          agent.press = 0;
        }
        if (p >= 1) {
          // The copy and the real element are identical: swap them in the same frame.
          task.hold?.cancel();
          task.hold = null;
          typist.remove();
          task.typist = null;
          markDone(task, now);
        }
        break;
      }
    }
  }

  /* ── Things drawn for a moment after a step ── */
  const fades: { el: HTMLElement; colour: string; at: number }[] = [];
  const rings: { el: HTMLElement; colour: string; at: number }[] = [];

  /* ── The loop ── */
  let raf = 0;
  let last = performance.now();
  let lastY = window.scrollY;
  let lastScrollAt = last;
  let velocity = 0;
  let paused = false;
  let stopping = false;

  /** Still close above or below the screen (horizontal position and clipping aside). */
  const nearby = (task: Task) => {
    const r = task.el.getBoundingClientRect();
    return r.bottom > -0.3 * window.innerHeight && r.top < 1.6 * window.innerHeight;
  };

  function update(now: number, flying: boolean, idle: boolean) {
    let backlog = 0;
    let busy = 0;
    for (const task of tasks) {
      switch (task.phase) {
        case "done":
          break;
        case "fresh":
          if (paused) break;
          if (task.inView && faint(task.el) && !flying) {
            // On screen but not showing yet: safe to hide, and built once it comes forward.
            task.hold = hold(task.el, false);
            task.phase = "held";
          } else if (task.inView) markDone(task, now); // already on screen: leave it alone
          else if (!task.inBand && task.top < 0) markDone(task, now); // scrolled past
          else if (task.inBand && !flying) {
            task.hold = hold(task.el, false);
            task.phase = "held";
          }
          break;
        case "held":
          if (flying || paused) {
            finish(task, now);
            break;
          }
          if (task.hold) {
            keepHolding(task.hold);
            if (task.hold.playState === "finished") {
              task.hold = null;
              markDone(task, now);
              break;
            }
          }
          // Out of the band: let it go, unless it is only out sideways (cards in a row that slides).
          if (!task.inBand && !task.first && !nearby(task)) {
            if (task.top < 0) finish(task, now);
            else {
              task.hold?.cancel();
              task.hold = null;
              task.phase = "fresh";
            }
            break;
          }
          if (task.inView && now >= task.notBefore && (task.pastLine || idle || task.first) && !faint(task.el)) {
            task.phase = "eligible";
            task.eligibleAt = now;
            task.eligibleTop = task.el.getBoundingClientRect().top;
            task.deadline = Math.max(now + DEADLINE, task.first ? startedAt + FIRST_SCREEN : 0);
            task.graceUntil = Math.max(now + GRACE, task.first ? startedAt + FIRST_SCREEN : 0);
          }
          break;
        case "eligible":
        case "claimed": {
          if (flying || paused || now > task.deadline) {
            finish(task, now);
            break;
          }
          // Scrolled into the top half while still waiting: show it now. (Pieces that sit still in a
          // pinned section, like the cards of the sliding row, are not moving up and may wait.)
          if (task.upper && now > task.graceUntil && task.el.getBoundingClientRect().top < task.eligibleTop - window.innerHeight * 0.15) {
            finish(task, now);
            break;
          }
          if (task.hold) keepHolding(task.hold);
          if (task.phase === "eligible" && faint(task.el)) {
            // Faded out by its own section again (the journey's cards): wait without a deadline.
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
          // Still nothing of it on screen (the copy is on its way, or the outline is being drawn) for too long.
          if (flying || paused || ((task.step === "drag" || task.step === "outline") && now - task.eligibleAt > UNSEEN && !task.first)) {
            finish(task, now);
            break;
          }
          if (task.hold) keepHolding(task.hold);
          busy += 1;
          work(task, now);
          break;
      }
    }

    // The more is waiting, the faster everyone works, and faster again while the page is scrolling quickly.
    const speed = clamp(1 + backlog / 8, 1, 5) * (Math.abs(velocity) > 1.2 ? 1.5 : 1);
    for (const task of tasks) {
      if (busy >= maxBusy) break;
      if (task.phase !== "eligible" || faint(task.el)) continue;
      // A copy waits a moment for the item it copies.
      if (task.copy && now < task.eligibleAt + COPY_WAIT && !task.run?.some((o) => o !== task && o.phase === "done")) continue;
      const at = startPoint(task);
      const agent = nearestAgent(at.x, at.y);
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
        const to = startPoint(task);
        const p = clamp((now - agent.leftAt) / Math.max(1, agent.arriveAt - agent.leftAt), 0, 1);
        const e = easeInOut(p);
        agent.x = agent.fromX + (to.x - agent.fromX) * e;
        agent.y = agent.fromY + (to.y - agent.fromY) * e;
        agent.press = 0;
      } else if (agent.state === ROAM || agent.state === HOME) {
        if (agent.state === ROAM && now > agent.until) {
          const home = homeOf(agent);
          agent.state = HOME;
          agent.aimX = home.x;
          agent.aimY = home.y;
        }
        const f = 1 - Math.exp(-dt / (agent.state === HOME ? 260 : 180));
        agent.x += (agent.aimX - agent.x) * f;
        agent.y += (agent.aimY - agent.y) * f;
        agent.press = 0;
        if (agent.state === HOME && Math.hypot(agent.aimX - agent.x, agent.aimY - agent.y) < 3) agent.state = PARKED;
      }
    }
  }

  function draw(now: number) {
    painter.clear();
    // Outlines fading out after a frame appears.
    for (let i = fades.length - 1; i >= 0; i--) {
      const fade = fades[i];
      const age = now - fade.at;
      if (age > 380) {
        fades.splice(i, 1);
        continue;
      }
      const r = fade.el.getBoundingClientRect();
      painter.outline(r.left, r.top, r.right, r.bottom, fade.colour, 1 - age / 380);
    }
    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i];
      const age = now - ring.at;
      if (age > 420) {
        rings.splice(i, 1);
        continue;
      }
      const r = ring.el.getBoundingClientRect();
      painter.ring(r.left + r.width / 2, r.top + r.height / 2, 8 + age / 12, ring.colour, 1 - age / 420);
    }
    for (const [agent, task] of jobs) {
      if (task.phase !== "build") continue;
      const r = task.el.getBoundingClientRect();
      const p = clamp((now - task.stepAt) / task.stepFor, 0, 1);
      if (task.step === "outline") {
        painter.outline(isRtl(task.el) ? r.right : r.left, r.top, agent.x, agent.y, agent.colour);
      } else if (task.step === "load") {
        const scan = Math.min(1, p / 0.6);
        painter.scan(r.left, r.right, r.top + r.height * scan, agent.colour);
        painter.chip(agent.x + 12, agent.y + 38, `${task.label} · ${Math.round(scan * 100)}%`, agent.colour);
      } else if (task.step === "type" && task.typist) {
        const caret = task.typist.caret;
        painter.caret(r.left + caret.x, r.top + caret.top, r.top + caret.bottom, agent.colour);
      } else if (task.step === "drag") {
        painter.chip(agent.x + 12, agent.y + 38, "copy", agent.colour);
      }
    }
    const bursting = now - startedAt < 1400;
    for (const agent of agents) {
      if (agent.state === PARKED) continue;
      painter.cursor(agent, bursting || agent.state === TRAVEL || agent.state === WORK);
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
    if (box.bottom <= 0) {
      markDone(task, startedAt); // above the screen: already seen, stays as it is
      continue;
    }
    if (task.inView) {
      task.first = true;
      task.hold = hold(el, true);
      task.phase = "held";
      task.notBefore = startedAt + 280;
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
      task.anim?.cancel();
      task.hold = null;
      task.anim = null;
      task.typist = null;
      task.ghost = null;
    }
    layer.replaceChildren();
    // Safety net: any swarm animation left anywhere (frames fading in, for example).
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
    painter.clear();
    layer.remove();
    setSwarmMode("off");
  }

  setSwarmMode("on");
  raf = requestAnimationFrame(tick);

  return {
    async stop() {
      if (stopping) return;
      stopping = true;
      showEverything();
      jobs.clear();
      // The cursors fly back into the box, then the page is itself again.
      const box = origin();
      for (const agent of agents) {
        if (agent.state === PARKED) continue;
        agent.state = HOME;
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
      const now = performance.now();
      for (const task of tasks) if (task.phase !== "fresh" && task.phase !== "done") finish(task, now);
    },
    destroy() {
      stopping = true;
      showEverything();
      teardown();
    },
  };
}
