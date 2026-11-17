"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Milestone } from "@/lib/content/types";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setTone } from "@/lib/tone";
import { cameraAt, layoutJourney, stopGap, type JourneyLayout, type Vec3 } from "./layout";
import styles from "./Journey.module.css";

type Labels = {
  eyebrow: string;
  title: string;
  hint: string;
  kinds: Record<Milestone["kind"], string>;
};

type Props = {
  milestones: Milestone[];
  dir: "ltr" | "rtl";
  labels: Labels;
  /** Locale-formatted counters, e.g. "01" or "۰۱". */
  numbers: string[];
};

const LIGHT = { bg: "#edeae3", ink: "#151412", card: "#f4f2ec", hair: "#d3cec3", thread: "#ff5a1f" };
const DARK = { bg: "#121311", ink: "#ece8df", card: "#1c1d1a", hair: "#2f302b", thread: "#ff7a3d" };

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type Star = Vec3 & { r: number };

export function Journey3D({ milestones, dir, labels, numbers }: Props) {
  const root = useRef<HTMLElement>(null);
  const count = milestones.length;
  const breakIndex = milestones.findIndex((m) => m.sceneBreak);
  // Scroll length in "stops": early (minor) stops pass quicker than the last two years.
  const scrollStops = milestones.reduce((sum, m) => sum + (m.weight === "major" ? 1.2 : 0.75), 0);

  useGSAP(
    () => {
      const section = root.current;
      if (!section || count === 0) return;
      const stage = section.querySelector<HTMLElement>(`.${styles.stage}`)!;
      const world = section.querySelector<HTMLElement>(`.${styles.world}`)!;
      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`, section);
      const ghosts = gsap.utils.toArray<HTMLElement>(`.${styles.ghost}`, section);
      const threadCanvas = section.querySelector<HTMLCanvasElement>(`.${styles.thread}`)!;
      const starCanvas = section.querySelector<HTMLCanvasElement>(`.${styles.stars}`)!;
      const counter = section.querySelector<HTMLElement>(`.${styles.counter}`)!;
      const bar = section.querySelector<HTMLElement>(`.${styles.barFill}`)!;

      const mm = gsap.matchMedia();
      mm.add(
        {
          // matchMedia only fires when ≥1 condition matches, so reduce/motion are complementary.
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
          compact: "(max-width: 767px)",
        },
        (ctx) => {
          const { reduce, compact } = ctx.conditions as { reduce: boolean; compact: boolean };
          if (reduce) {
            section.dataset.mode = "flat";
            return;
          }
          section.dataset.mode = "3d";

          const tctx = threadCanvas.getContext("2d")!;
          const sctx = starCanvas.getContext("2d")!;
          const dprCap = compact ? 1.5 : 2;
          let W = 0;
          let H = 0;
          let layout: JourneyLayout;
          let stars: Star[] = [];
          const state = { p: 0 };
          let lastP = -1;
          let lastTone = -1;
          let dirty = true;
          let stuck = false;

          const build = () => {
            W = stage.clientWidth;
            H = stage.clientHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
            for (const c of [threadCanvas, starCanvas]) {
              c.width = Math.round(W * dpr);
              c.height = Math.round(H * dpr);
              c.style.width = `${W}px`;
              c.style.height = `${H}px`;
            }
            tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            sctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            layout = layoutJourney({
              count,
              dir,
              vw: W,
              vh: H,
              compact,
              placements: milestones.map((m) => m.placement),
              weights: milestones.map((m) => m.weight),
            });
            stage.style.perspective = `${layout.perspective}px`;

            cards.forEach((el, i) => {
              const p = layout.points[i];
              el.style.transform = `translate3d(${p.x}px, ${p.y}px, ${p.z}px) translate(-50%, -50%)`;
            });
            ghosts.forEach((el, i) => {
              const g = layout.ghosts[i];
              el.style.transform = `translate3d(${g.x}px, ${g.y}px, ${g.z}px) translate(-50%, -50%)`;
            });

            // Deterministic star field spanning the whole flight.
            const total = layout.length + layout.depth;
            const n = compact ? 70 : 170;
            let seed = 7;
            const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
            stars = Array.from({ length: n }, () => ({
              x: (rnd() - 0.5) * W * 2.6,
              y: (rnd() - 0.5) * H * 2.6,
              z: layout.depth * 0.8 - rnd() * total,
              r: 0.4 + rnd() * 1.3,
            }));
            dirty = true;
          };

          const project = (pt: Vec3, cam: Vec3) => {
            const Z = pt.z + cam.z;
            const P = layout.perspective;
            if (Z > P - 40) return null;
            const s = P / (P - Z);
            return { x: W / 2 + (pt.x - cam.x) * s, y: H / 2 + (pt.y - cam.y) * s, s, Z };
          };

          const fade = (Z: number, nearFrom = 0.22, nearTo = 0.55) => {
            const P = layout.perspective;
            const far = gsap.utils.clamp(0, 1, gsap.utils.mapRange(-3.4 * layout.depth, -1.3 * layout.depth, 0, 1, Z));
            const near = gsap.utils.clamp(0, 1, gsap.utils.mapRange(P * nearFrom, P * nearTo, 1, 0, Z));
            return Math.min(far, near);
          };

          const render = () => {
            if (!dirty && state.p === lastP) return;
            dirty = false;
            lastP = state.p;
            const cam = cameraAt(layout, state.p);

            world.style.transform = `translate3d(${-cam.x}px, ${-cam.y}px, ${cam.z}px)`;

            cards.forEach((el, i) => {
              const o = fade(layout.points[i].z + cam.z);
              el.style.opacity = o.toFixed(3);
              el.style.visibility = o < 0.01 ? "hidden" : "visible";
            });
            ghosts.forEach((el, i) => {
              const o = fade(layout.ghosts[i].z + cam.z, -0.15, 0.12) * 0.85;
              el.style.opacity = o.toFixed(3);
              el.style.visibility = o < 0.01 ? "hidden" : "visible";
            });

            // Scene tone: light paper → night, around the sceneBreak stop.
            const tone = breakIndex > 0 ? smoothstep(breakIndex - 0.75, breakIndex - 0.15, state.p) : 0;
            if (Math.abs(tone - lastTone) > 0.001) {
              lastTone = tone;
              const mix = (k: keyof typeof LIGHT) => gsap.utils.interpolate(LIGHT[k], DARK[k], tone);
              section.style.setProperty("--j-bg", mix("bg"));
              section.style.setProperty("--j-ink", mix("ink"));
              section.style.setProperty("--j-card", mix("card"));
              section.style.setProperty("--j-hair", mix("hair"));
              setTone("journey", stuck && tone > 0.5);
            }

            // Stars (only meaningful once the scene darkens).
            sctx.clearRect(0, 0, W, H);
            const starAlpha = 0.12 + tone * 0.88;
            sctx.fillStyle = tone > 0.5 ? "#ece8df" : "#151412";
            for (const st of stars) {
              const q = project(st, { x: cam.x * 0.6, y: cam.y * 0.6, z: cam.z });
              if (!q || q.x < -10 || q.x > W + 10 || q.y < -10 || q.y > H + 10) continue;
              const depthFade = gsap.utils.clamp(0, 1, 1 + q.Z / (layout.depth * 4));
              sctx.globalAlpha = starAlpha * depthFade;
              sctx.beginPath();
              sctx.arc(q.x, q.y, Math.min(3, st.r * q.s), 0, Math.PI * 2);
              sctx.fill();
            }
            sctx.globalAlpha = 1;

            // Thread: wide faint glow pass, then the thin bright line, then the leading head.
            tctx.clearRect(0, 0, W, H);
            const color = gsap.utils.interpolate(LIGHT.thread, DARK.thread, tone);
            const pts = layout.samples.map((s) => project(s, cam));
            for (const pass of [0, 1]) {
              tctx.strokeStyle = color;
              tctx.lineCap = "round";
              for (let i = 1; i < pts.length; i++) {
                const a = pts[i - 1];
                const b = pts[i];
                if (!a || !b) continue;
                const alpha = fade(b.Z);
                if (alpha <= 0.01) continue;
                tctx.globalAlpha = pass === 0 ? alpha * 0.16 : alpha * 0.95;
                tctx.lineWidth = (pass === 0 ? 9 : 1.6) * Math.min(2.4, b.s);
                tctx.beginPath();
                tctx.moveTo(a.x, a.y);
                tctx.lineTo(b.x, b.y);
                tctx.stroke();
              }
            }
            const head = pts.find((q) => q && q.Z < -layout.depth * 0.08);
            if (head) {
              const r = 5 * Math.min(2, head.s);
              const g = tctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, r * 6);
              g.addColorStop(0, color);
              g.addColorStop(1, "transparent");
              tctx.globalAlpha = 0.5;
              tctx.fillStyle = g;
              tctx.beginPath();
              tctx.arc(head.x, head.y, r * 6, 0, Math.PI * 2);
              tctx.fill();
              tctx.globalAlpha = 1;
              tctx.fillStyle = color;
              tctx.beginPath();
              tctx.arc(head.x, head.y, r, 0, Math.PI * 2);
              tctx.fill();
            }
            tctx.globalAlpha = 1;

            // HUD
            const stop = Math.round(state.p);
            counter.textContent = `${numbers[stop]} / ${numbers[count - 1]}`;
            bar.style.transform = `scaleX(${count > 1 ? state.p / (count - 1) : 1})`;
          };

          build();

          const tl = gsap.timeline({
            defaults: { ease: "house" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              onToggle: (self) => {
                stuck = self.isActive;
                setTone("journey", stuck && lastTone > 0.5);
              },
            },
          });
          // Travel time follows the gap to each stop; recent stops also hold a little longer.
          const hold = (i: number) => (milestones[i].weight === "major" ? 0.45 : 0.2);
          tl.addLabel("m0").to({}, { duration: hold(0) });
          for (let i = 1; i < count; i++) {
            tl.to(state, { p: i, duration: stopGap(milestones[i].weight) })
              .addLabel(`m${i}`)
              .to({}, { duration: hold(i) });
          }

          const onResize = () => {
            build();
            render();
          };
          const ro = new ResizeObserver(onResize);
          ro.observe(stage);
          gsap.ticker.add(render);
          render();
          document.fonts?.ready.then(() => ScrollTrigger.refresh());

          return () => {
            gsap.ticker.remove(render);
            ro.disconnect();
            setTone("journey", false);
            section.dataset.mode = "flat";
            [...cards, ...ghosts].forEach((el) => {
              el.style.transform = "";
              el.style.opacity = "";
              el.style.visibility = "";
            });
            world.style.transform = "";
            stage.style.perspective = "";
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root, dependencies: [milestones, dir], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id="journey"
      data-mode="flat"
      className={styles.section}
      style={{ "--stops": scrollStops } as React.CSSProperties}
      aria-labelledby="journey-title"
    >
      <div className={styles.stage}>
        <canvas className={styles.stars} aria-hidden />
        <canvas className={styles.thread} aria-hidden />

        <div className={styles.world}>
          {milestones.map((m, i) => (
            <span
              key={`${m.id}-ghost`}
              className={styles.ghost}
              data-weight={m.weight}
              // Two stops in the same year share one numeral.
              data-dup={i > 0 && milestones[i - 1].year === m.year ? "" : undefined}
              aria-hidden
            >
              {m.year}
            </span>
          ))}
          <ol className={styles.list}>
            {milestones.map((m, i) => (
              <li key={m.id} className={styles.card} data-kind={m.kind} data-weight={m.weight}>
                <div className="text-label flex items-center justify-between gap-4 opacity-70">
                  <span>
                    {numbers[i]} / {numbers[count - 1]}
                  </span>
                  <span>{labels.kinds[m.kind]}</span>
                </div>
                <p className={styles.year}>{m.year}</p>
                {m.media ? (
                  <div className={styles.media}>
                    <Image
                      src={m.media.src}
                      alt={m.media.alt}
                      width={m.media.width}
                      height={m.media.height}
                      sizes="(max-width: 767px) 80vw, 520px"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                ) : null}
                <h3 className={styles.cardTitle}>{m.title}</h3>
                <p className={styles.outcome}>{m.outcome}</p>
                {m.tags.length ? (
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {m.tags.map((t) => (
                      <li key={t} className={styles.tag}>
                        {t}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <header className={styles.hud}>
          <p className="text-label">{labels.eyebrow}</p>
          <h2 id="journey-title" className={styles.hudTitle}>
            {labels.title}
          </h2>
        </header>
        <div className={styles.hudBottom} aria-hidden>
          <span className="text-label">{labels.hint}</span>
          <span className={styles.bar}>
            <span className={styles.barFill} />
          </span>
          <span className={`text-label ${styles.counter}`}>
            {numbers[0]} / {numbers[count - 1]}
          </span>
        </div>
      </div>
    </section>
  );
}
