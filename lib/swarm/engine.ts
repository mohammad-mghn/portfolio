/**
 * The agent build mode: as the visitor scrolls, the home page is rebuilt piece by piece by a swarm
 * of agent cursors. Loaded only when the "click me :)" box is clicked (components/swarm/SwarmBox).
 *
 * How a piece moves through the mode:
 *   fresh     known, nothing done yet (still far below the screen)
 *   held      hidden, because it is about to come on screen (see builders.ts for how)
 *   eligible  on screen and waiting for an agent
 *   claimed   an agent is flying to it
 *   build     the agent is building it (outline, typing, scan or click)
 *   done      visible and finished; never hidden again
 *
 * Rules that keep the page from ever looking empty:
 *   - content that is already on screen is never hidden (except the first screen, on purpose, at start)
 *   - the more work is waiting, the faster the agents go (up to 6x)
 *   - nothing waits on screen longer than about a second; then it is shown at once
 *   - scrolling very fast shows everything at once, with no animation
 *   - anything that reaches the top half of the screen unbuilt is shown at once
 */
import { whenBoundariesReady } from "@/lib/hydration";
import { caretAt, fadeIn, hold, keepHolding, measureText, popIn, scanIn, typeIn, type TextPlan } from "./builders";
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
  deadline: number;
  graceUntil: number;
  agent: Agent | null;
  speed: number;
  buildAt: number;
  buildFor: number;
  plan: TextPlan | null;
  /** Frames: pieces inside still unfinished. A piece counts as built once all of its pieces are. */
  kidsLeft: number;
  settled: boolean;
  /** Pop: the click ring has been drawn. */
  clicked: boolean;
};

/** px per ms (2400 px/s), the same "flying past" speed the page's own reveals use. */
const FLYING = 2.4;
const DEADLINE = 1100;
const GRACE = 500;
const IDLE = 400;
/** The first screen is rebuilt within this long after the click. */
const FIRST_SCREEN = 2600;

const frame = () => new Promise<number>((resolve) => requestAnimationFrame(resolve));
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;

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
      deadline: 0,
      graceUntil: 0,
      agent: null,
      speed: 1,
      buildAt: 0,
      buildFor: 0,
      plan: null,
      kidsLeft: 0,
      settled: false,
      clicked: false,
    };
    flagsFrom(task);
    tasks.push(task);
    byEl.set(el, task);
    if (seed) seedsTotal += 1;
    return task;
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
    freeAgent(task, now);
    unwatch(task);
    if (task.kidsLeft <= 0) settle(task);
  }

  /** Show a piece now, whatever it was doing: nothing of it stays hidden. */
  function finish(task: Task, now: number) {
    if (task.phase === "done") return;
    task.hold?.cancel();
    task.anim?.cancel();
    task.hold = null;
    task.anim = null;
    markDone(task, now);
  }

  /* ── Building ── */

  /** Where the agent starts on a piece, in screen coordinates. */
  function startPoint(task: Task) {
    const r = task.el.getBoundingClientRect();
    const rtl = getComputedStyle(task.el).direction === "rtl";
    if (task.kind === "frame") return { x: rtl ? r.right : r.left, y: r.top };
    if (task.kind === "media") return { x: r.left + r.width / 2, y: r.top };
    if (task.kind === "pop") return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    return { x: rtl ? r.right : r.left, y: r.top + Math.min(r.height, 60) / 2 };
  }

  function claim(task: Task, agent: Agent, now: number, speed: number) {
    const to = startPoint(task);
    const distance = Math.hypot(to.x - agent.x, to.y - agent.y);
    agent.state = TRAVEL;
    agent.fromX = agent.x;
    agent.fromY = agent.y;
    agent.leftAt = now;
    agent.arriveAt = now + Math.max(90, clamp(distance / 1.5, 140, 520) / speed);
    jobs.set(agent, task);
    task.agent = agent;
    task.speed = speed;
    task.phase = "claimed";
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
    const k = task.speed;
    const el = task.el;
    let duration = 0;
    let kind = task.kind;

    if (kind === "type" || kind === "words") {
      const words = (el.textContent ?? "").trim().split(/\s+/).length;
      const grain = kind === "type" ? "grapheme" : words > 60 ? "line" : "word";
      task.plan = measureText(el, grain);
      if (!task.plan) kind = "pop";
      else {
        const per = grain === "grapheme" ? 34 : grain === "word" ? 60 : 150;
        duration = Math.max(140, clamp(task.plan.stops.length * per, 300, 1400) / k);
        task.anim = typeIn(el, task.plan, duration);
      }
    }
    if (kind === "media") {
      duration = Math.max(160, 560 / k);
      task.anim = scanIn(el, duration);
    }
    if (kind === "pop") {
      duration = Math.max(120, 300 / k);
      const pressing = duration * 0.3;
      task.anim = popIn(el, duration - pressing, pressing);
    }
    if (kind === "frame") {
      const r = el.getBoundingClientRect();
      duration = Math.max(140, clamp(Math.hypot(r.width, Math.min(r.height, window.innerHeight)) / 1.8, 260, 650) / k);
    } else {
      // The build animation now hides what is not built yet, so the hold can go.
      task.hold?.cancel();
      task.hold = null;
    }

    task.kind = kind;
    task.phase = "build";
    task.buildAt = now;
    task.buildFor = duration;
    if (task.agent) task.agent.state = WORK;
  }

  /** The outline is drawn: find the pieces inside, hide them, then let the frame itself appear. */
  function frameDone(task: Task, now: number) {
    let kids = 0;
    for (const { el, kind } of discover(task.el)) {
      if (byEl.has(el)) continue;
      const kid = create(el, kind, task, false);
      kid.hold = hold(el, false);
      kid.phase = "held";
      watch(kid);
      kids += 1;
    }
    task.kidsLeft = kids;
    task.hold?.cancel();
    task.hold = null;
    fadeIn(task.el, 140);
    fades.push({ el: task.el, colour: task.agent?.colour ?? PALETTE[0], at: now });
    markDone(task, now);
  }

  function work(task: Task, now: number) {
    const agent = task.agent;
    const p = clamp((now - task.buildAt) / task.buildFor, 0, 1);
    const r = task.el.getBoundingClientRect();
    if (agent) {
      if (task.kind === "frame") {
        const rtl = getComputedStyle(task.el).direction === "rtl";
        const e = easeOut(p);
        const x0 = rtl ? r.right : r.left;
        const x1 = rtl ? r.left : r.right;
        agent.x = x0 + (x1 - x0) * e;
        agent.y = r.top + r.height * e;
        agent.press = 1;
      } else if (task.plan) {
        const caret = caretAt(task.plan, p);
        agent.x = r.left + caret.x + (task.plan.rtl ? -2 : 2);
        agent.y = r.top + (caret.top + caret.bottom) / 2;
        agent.press = 0;
      } else if (task.kind === "media") {
        agent.x = r.left + r.width * (0.5 + 0.32 * Math.sin(p * Math.PI * 3));
        agent.y = r.top + r.height * p;
      } else {
        agent.x = r.left + r.width / 2;
        agent.y = r.top + r.height / 2;
        agent.press = p < 0.3 ? 1 : 0;
        if (p >= 0.3 && !task.clicked) {
          task.clicked = true;
          rings.push({ el: task.el, colour: agent.colour, at: now });
        }
      }
    }
    if (p >= 1) {
      if (task.kind === "frame") frameDone(task, now);
      else {
        task.anim = null; // it has ended on its own: no fill, so the piece is simply visible
        markDone(task, now);
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

  function update(now: number, flying: boolean, idle: boolean) {
    let backlog = 0;
    let busy = 0;
    for (const task of tasks) {
      switch (task.phase) {
        case "done":
          break;
        case "fresh":
          if (paused) break;
          if (task.inView) markDone(task, now); // already on screen: leave it alone
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
          if (!task.inBand && !task.first) {
            if (task.top < 0) finish(task, now);
            else {
              task.hold?.cancel();
              task.hold = null;
              task.phase = "fresh";
            }
            break;
          }
          if (task.inView && now >= task.notBefore && (task.pastLine || idle || task.first)) {
            task.phase = "eligible";
            task.deadline = Math.max(now + DEADLINE, task.first ? startedAt + FIRST_SCREEN : 0);
            task.graceUntil = Math.max(now + GRACE, task.first ? startedAt + FIRST_SCREEN : 0);
          }
          break;
        case "eligible":
        case "claimed":
          if (flying || paused || now > task.deadline || (task.upper && now > task.graceUntil)) {
            finish(task, now);
            break;
          }
          if (task.hold) keepHolding(task.hold);
          backlog += 1;
          if (task.phase === "claimed") {
            busy += 1;
            if (task.agent && now >= task.agent.arriveAt) begin(task, now);
          }
          break;
        case "build":
          if (flying || paused) {
            finish(task, now);
            break;
          }
          busy += 1;
          work(task, now);
          break;
      }
    }

    // The more is waiting, the faster everyone works, and faster again while the page is scrolling quickly.
    const speed = clamp(1 + backlog / 8, 1, 5) * (Math.abs(velocity) > 1.2 ? 1.5 : 1);
    for (const task of tasks) {
      if (busy >= maxBusy) break;
      if (task.phase !== "eligible") continue;
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
      if (task.kind === "frame") {
        const rtl = getComputedStyle(task.el).direction === "rtl";
        painter.outline(rtl ? r.right : r.left, r.top, agent.x, agent.y, agent.colour);
      } else if (task.plan && task.plan.lines.length) {
        const p = clamp((now - task.buildAt) / task.buildFor, 0, 1);
        const caret = caretAt(task.plan, p);
        painter.caret(r.left + caret.x, r.top + caret.top, r.top + caret.bottom, agent.colour);
      } else if (task.kind === "media") {
        painter.scan(r.left, r.right, agent.y, agent.colour);
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
  for (const el of findSeeds(root)) {
    const box = el.getBoundingClientRect();
    const task = create(el, classify(el, box), null, true);
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
    }
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
