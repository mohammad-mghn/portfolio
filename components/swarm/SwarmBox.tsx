"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/locales";
import { localizeDigits } from "@/lib/format";
import type { SwarmEngine } from "@/lib/swarm/engine";
import { setSwarmMode, swarmStore, type SwarmMode } from "@/lib/swarm/store";

export type SwarmLine = { text: string; face: string };
export type SwarmLabels = {
  /** What the box says the longer it is ignored: calm, impatient, angry, furious. */
  levels: SwarmLine[];
  /** Shown after the visitor stopped the mode, until the box gets impatient again. */
  again: SwarmLine;
  stop: string;
  /** "{agents} agents · {percent}% built" */
  counter: string;
  /** Read by screen readers after the button's own text. */
  hint: string;
};

/** Seconds ignored at which the box gets more impatient (levels 1, 2 and 3). */
const ANGER_AT = [20, 45, 80];
const ICONS = ["?", "?", "!", "!!"];
const AGENTS = 100;

const serverMode = (): SwarmMode => "off";
const serverProgress = () => 0;

/**
 * The "click me :)" box on the home page. It wiggles now and then, and gets angrier the longer it
 * is ignored. Clicking it starts the build mode: as the visitor scrolls, the page is rebuilt by a
 * swarm of agent cursors (lib/swarm/engine.ts, fetched on that first click). While it runs, the
 * box is the Stop button and a counter shows how much of the page is built.
 */
export function SwarmBox({ labels, locale }: { labels: SwarmLabels; locale: Locale }) {
  const mode = useSyncExternalStore(swarmStore.subscribe, swarmStore.mode, serverMode);
  const progress = useSyncExternalStore(swarmStore.subscribe, swarmStore.progress, serverProgress);
  const [level, setLevel] = useState(0);
  const [again, setAgain] = useState(false);
  const [lift, setLift] = useState(false);
  const engine = useRef<SwarmEngine | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const hintId = useId();
  const on = mode !== "off";
  // A case study opened over the home page changes the URL but not the page underneath: pause.
  const paused = usePathname() !== "/";

  // The anger clock runs only while the box is in view of a visitor: tab visible, mode off.
  useEffect(() => {
    if (on) return;
    let ignored = 0;
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      ignored += 1;
      const next = ANGER_AT.filter((at) => ignored >= at).length;
      setLevel((current) => (current === next ? current : next));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [on]);

  // Step aside for the footer's last row and the journey's bottom bar while they are on screen.
  // Checked on scroll against whatever is in the page now (sections can be re-rendered after load).
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const strip = window.innerHeight * 0.88;
      const covered = [...document.querySelectorAll<HTMLElement>("#main footer, #journey")].some((el) => {
        const box = el.getBoundingClientRect();
        return box.top < window.innerHeight && box.bottom > strip;
      });
      setLift((current) => (current === covered ? current : covered));
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(check);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    engine.current?.pause(paused);
  }, [paused]);

  // Leaving the home page ends the mode: the page it was building is gone.
  useEffect(
    () => () => {
      engine.current?.destroy();
      engine.current = null;
    },
    [],
  );

  async function stop() {
    const running = engine.current;
    engine.current = null;
    setAgain(true);
    setLevel(0);
    if (running) await running.stop();
    else setSwarmMode("off");
  }

  async function start() {
    const surface = canvas.current;
    if (!surface) return;
    setLevel(0);
    setSwarmMode("loading");
    try {
      const { startSwarm } = await import("@/lib/swarm/engine");
      engine.current = await startSwarm({
        canvas: surface,
        agents: AGENTS,
        origin: () => {
          const box = button.current?.getBoundingClientRect();
          return box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : { x: innerWidth / 2, y: innerHeight };
        },
      });
      engine.current.pause(paused);
    } catch {
      engine.current = null;
      setSwarmMode("off");
    }
  }

  function toggle() {
    if (mode === "loading") return;
    void (on ? stop() : start());
  }

  // Esc stops the mode (unless a case study is open: there Esc closes the case study).
  const stopRef = useRef(stop);
  useEffect(() => {
    stopRef.current = stop;
  });
  useEffect(() => {
    if (!on || paused) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") void stopRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [on, paused]);

  const line = level === 0 && again ? labels.again : labels.levels[Math.min(level, labels.levels.length - 1)];
  const counter = localizeDigits(
    labels.counter.replace("{agents}", String(AGENTS)).replace("{percent}", String(Math.round(progress * 100))),
    locale,
  );

  return (
    <>
      <canvas ref={canvas} className="swarm-canvas" aria-hidden />
      <div className="swarm-dock" data-lift={lift ? "" : undefined}>
        {on ? (
          <p className="swarm-count text-label" aria-hidden>
            {counter}
          </p>
        ) : null}
        <button
          ref={button}
          type="button"
          className="swarm-box text-label"
          data-anger={on ? undefined : level}
          data-on={on ? "" : undefined}
          aria-pressed={on}
          aria-describedby={hintId}
          onClick={toggle}
        >
          <span className="swarm-icon" aria-hidden>
            {on ? <span className="swarm-stop" /> : ICONS[level]}
          </span>
          <span>
            {on ? (
              labels.stop
            ) : (
              <>
                {line.text}
                {line.face ? (
                  <>
                    {" "}
                    <bdi dir="ltr">{line.face}</bdi>
                  </>
                ) : null}
              </>
            )}
          </span>
        </button>
        <span id={hintId} className="sr-only">
          {labels.hint}
        </span>
      </div>
    </>
  );
}
