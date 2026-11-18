"use client";

import { imgProps } from "@/lib/img";
import { useLenis } from "@/lib/lenis";
import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { Img, JourneyLink } from "@/lib/content/types";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { registerTourPath, type TourSegment } from "@/lib/swarm/store";
import { setTone } from "@/lib/tone";
import { cameraAt, layoutJourney, WEIGHTS, type JourneyLayout, type Vec3 } from "./layout";
import styles from "./Journey.module.css";

/** A stop as the scene draws it. Every string arrives formatted for the locale (see JourneySection). */
export type StopView =
  | {
      kind: "role";
      id: string;
      weight: "major" | "minor";
      /** Role number, "01" … "07". */
      number: string;
      /** "Pishgaman Farda · Full-time": shown in the bottom bar while this role and its projects pass. */
      chapter: string;
      year: string;
      title: string;
      type: string;
      roles: { title: string; period: string }[];
      highlights: string[];
      media?: Img;
      /** A note without a link is a plain card. */
      link?: JourneyLink;
      cta: string;
      sceneBreak: boolean;
    }
  | {
      kind: "project";
      id: string;
      weight: "project";
      number: string;
      chapter: string;
      /** "Built at Pishgaman Farda", "Freelance client project"… */
      attach: string;
      items: { slug: string; title: string; meta: string; cover?: Img; link: JourneyLink; cta: string }[];
    };

type Labels = { eyebrow: string; title: string; hint: string };

type Props = {
  stops: StopView[];
  dir: "ltr" | "rtl";
  labels: Labels;
  /** Number of roles, formatted: the "07" in "02 / 07". */
  total: string;
};

// `label` is the orange used for small text: a darker orange on the light cards (the bright one is
// too faint to read at 12px on paper), the bright one once the scene turns to night.
const LIGHT = { bg: "#edeae3", ink: "#151412", card: "#f4f2ec", hair: "#d3cec3", thread: "#ff5a1f", label: "#b8380a" };
const DARK = { bg: "#121311", ink: "#ece8df", card: "#1c1d1a", hair: "#2f302b", thread: "#ff7a3d", label: "#ff8a52" };

/** Cards are drawn this much larger than their CSS size in the 3D scene (less on a screen too narrow for it). */
const CARD_SCALE = 1.1;

/**
 * A card is "live" (its links exist and can be clicked) when it is this opaque and no further
 * ahead than LIVE_DEPTH × the base depth. Cards further away are only a preview: at that distance
 * their links would be a few pixels tall, too small to hit.
 */
const LIVE_OPACITY = 0.6;
const LIVE_DEPTH = 0.9;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type Star = Vec3 & { r: number };

/** Internal pages go through the router (case studies open in the overlay), other sites open a new tab. */
function StopLink({ link, className, children }: { link: JourneyLink; className?: string; children: ReactNode }) {
  if (link.kind === "external") {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={link.href} scroll={link.kind === "modal" ? false : undefined} className={className}>
      {children}
    </Link>
  );
}

const Arrow = ({ external }: { external: boolean }) => (
  <span aria-hidden className={external ? undefined : "inline-block rtl:-scale-x-100"}>
    {external ? "↗" : "→"}
  </span>
);

export function Journey3D({ stops, dir, labels, total }: Props) {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  const count = stops.length;
  const breakIndex = stops.findIndex((s) => s.kind === "role" && s.sceneBreak);
  // Scroll length in "stops": projects pass quickly, recent roles hold longest.
  const scrollStops = stops.reduce((sum, s) => sum + WEIGHTS[s.weight].scroll, 0);
  // Rebuild the scene only when the stops themselves change, not on every content refresh.
  const stopsKey = stops.map((s) => `${s.id}:${s.weight}`).join("|");

  useGSAP(
    () => {
      const section = root.current;
      if (!section || count === 0) return;
      const stage = section.querySelector<HTMLElement>(`.${styles.stage}`)!;
      const world = section.querySelector<HTMLElement>(`.${styles.world}`)!;
      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`, section);
      const ghosts = gsap.utils.toArray<HTMLElement>(`.${styles.ghost}`, section);
      const ghostStop = ghosts.map((el) => Number(el.dataset.i));
      const threadCanvas = section.querySelector<HTMLCanvasElement>(`.${styles.thread}`)!;
      const starCanvas = section.querySelector<HTMLCanvasElement>(`.${styles.stars}`)!;
      const counter = section.querySelector<HTMLElement>(`.${styles.counter}`)!;
      const chapter = section.querySelector<HTMLElement>(`.${styles.chapter}`)!;
      const bar = section.querySelector<HTMLElement>(`.${styles.barFill}`)!;
      const weights = stops.map((s) => s.weight);

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
          const live = cards.map(() => false);
          let lastP = -1;
          let lastTone = -1;
          let lastStop = -1;
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

            // Scale every card up, but never wider than the screen minus a small margin.
            const widest = Math.max(...cards.map((el) => el.offsetWidth));
            const scale = Math.min(CARD_SCALE, (W - 16) / widest);
            layout = layoutJourney({ dir, vw: W, vh: H, compact, weights, heights: cards.map((el) => el.offsetHeight * scale) });
            stage.style.perspective = `${layout.perspective}px`;
            // The stem is drawn inside the scaled card, so shrink it by the same factor to keep its real length.
            stage.style.setProperty("--stem", `${layout.stem / scale}px`);

            cards.forEach((el, i) => {
              const p = layout.points[i];
              el.style.transform = `translate3d(${p.x}px, ${p.y}px, ${p.z}px) translate(-50%, -50%) scale(${scale})`;
            });
            ghosts.forEach((el, n) => {
              const g = layout.ghosts[ghostStop[n]];
              el.style.transform = `translate3d(${g.x}px, ${g.y}px, ${g.z}px) translate(-50%, -50%)`;
            });

            // Deterministic star field spanning the whole flight.
            const span = layout.length + layout.depth;
            const n = compact ? 70 : 170;
            let seed = 7;
            const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
            stars = Array.from({ length: n }, () => ({
              x: (rnd() - 0.5) * W * 2.6,
              y: (rnd() - 0.5) * H * 2.6,
              z: layout.depth * 0.8 - rnd() * span,
              r: 0.4 + rnd() * 1.3,
            }));
            dirty = true;
          };

          const project = (pt: Vec3, cam: Vec3) => {
            const Z = pt.z + cam.z;
            const P = layout.perspective;
            if (Z > P - 40) return null;
            const s = P / (P - Z);
            // The world's origin sits at 52% of the stage height (see the CSS), 2% below the vanishing point.
            return { x: W / 2 + (pt.x - cam.x) * s, y: H / 2 + (H * 0.02 + pt.y - cam.y) * s, s, Z };
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
              const Z = layout.points[i].z + cam.z;
              const o = fade(Z);
              // Depth fade as a filter, not `opacity`: it looks the same, and accessibility tools then
              // judge the text by its real colours instead of by how far away the card happens to be.
              el.style.filter = o >= 0.999 ? "" : `opacity(${o.toFixed(3)})`;
              el.style.visibility = o < 0.01 ? "hidden" : "visible";
              // Only cards near the camera take clicks; faded ones and distant previews do not.
              const isLive = o >= LIVE_OPACITY && Z > -LIVE_DEPTH * layout.depth;
              if (isLive !== live[i]) {
                live[i] = isLive;
                el.toggleAttribute("data-live", isLive);
              }
            });
            ghosts.forEach((el, n) => {
              const o = fade(layout.ghosts[ghostStop[n]].z + cam.z, -0.15, 0.12) * 0.85;
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
              section.style.setProperty("--j-label", mix("label"));
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
            // A bead on the thread at every stop: a ring for a role, a dot where a project's stem lands.
            const bg = gsap.utils.interpolate(LIGHT.bg, DARK.bg, tone);
            layout.anchors.forEach((anchor, i) => {
              const q = project(anchor, cam);
              if (!q) return;
              const alpha = fade(q.Z);
              if (alpha <= 0.01) return;
              const isProject = weights[i] === "project";
              const r = (isProject ? 3 : 5.5) * Math.min(2, q.s);
              tctx.globalAlpha = alpha;
              tctx.beginPath();
              tctx.arc(q.x, q.y, r, 0, Math.PI * 2);
              tctx.fillStyle = isProject ? color : bg;
              tctx.fill();
              if (!isProject) {
                tctx.lineWidth = 1.6 * Math.min(2, q.s);
                tctx.strokeStyle = color;
                tctx.stroke();
              }
            });
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
            }
            tctx.globalAlpha = 1;

            // HUD: the role number and chapter stay put while that role's project cards pass.
            const stop = Math.round(state.p);
            if (stop !== lastStop) {
              lastStop = stop;
              counter.textContent = `${stops[stop].number} / ${total}`;
              chapter.textContent = stops[stop].chapter;
            }
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
          // Travel time follows the gap to each stop; the camera then rests on it for its `hold`.
          // The last stop holds like a major one so the section does not end abruptly on a small card.
          const hold = (i: number) => (i === count - 1 ? WEIGHTS.major.hold : WEIGHTS[weights[i]].hold);
          tl.addLabel("m0").to({}, { duration: hold(0) });
          for (let i = 1; i < count; i++) {
            tl.to(state, { p: i, duration: WEIGHTS[weights[i]].gap })
              .addLabel(`m${i}`)
              .to({}, { duration: hold(i) });
          }

          // The build mode's tour plays the journey like a film: a quick flight to each card, then a
          // pause on it long enough to read it. Times per stop weight, in ms.
          const tourMs = { major: { gap: 1300, hold: 1700 }, minor: { gap: 1000, hold: 1200 }, project: { gap: 700, hold: 700 } };
          let tourCache: { key: string; segments: TourSegment[] } = { key: "", segments: [] };
          const unregisterTour = registerTourPath(() => {
            const st = tl.scrollTrigger;
            if (!st) return [];
            const key = `${st.start}|${st.end}`;
            if (tourCache.key === key) return tourCache.segments;
            const total = tl.duration();
            const toScroll = (t: number) => st.start + (t / total) * (st.end - st.start);
            const segments: TourSegment[] = [];
            for (let i = 0; i < count; i++) {
              const at = tl.labels[`m${i}`];
              if (i > 0) segments.push({ from: toScroll(at - WEIGHTS[weights[i]].gap), to: toScroll(at), ms: tourMs[weights[i]].gap });
              segments.push({ from: toScroll(at), to: toScroll(at + hold(i)), ms: tourMs[i === count - 1 ? "major" : weights[i]].hold });
            }
            tourCache = { key, segments };
            return segments;
          });

          // Keyboard: tabbing to a card that is still far away flies the camera to it.
          const onFocusIn = (e: FocusEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target?.matches(":focus-visible")) return;
            const i = cards.indexOf(target.closest<HTMLElement>(`.${styles.card}`)!);
            const st = tl.scrollTrigger;
            if (i < 0 || !st) return;
            const y = st.labelToScroll(`m${i}`);
            if (lenisRef.current) lenisRef.current.scrollTo(y);
            else window.scrollTo({ top: y });
          };
          section.addEventListener("focusin", onFocusIn);

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
            unregisterTour();
            gsap.ticker.remove(render);
            ro.disconnect();
            section.removeEventListener("focusin", onFocusIn);
            setTone("journey", false);
            section.dataset.mode = "flat";
            [...cards, ...ghosts].forEach((el) => {
              el.style.transform = "";
              el.style.opacity = "";
              el.style.filter = "";
              el.style.visibility = "";
              el.removeAttribute("data-live");
            });
            world.style.transform = "";
            stage.style.perspective = "";
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root, dependencies: [stopsKey, dir, total], revertOnUpdate: true },
  );

  // One outlined year per new year, behind the first role that starts in it: 2021, 2024, 2025, 2026.
  const roleStops = stops.flatMap((s, i) => (s.kind === "role" ? [{ i, year: s.year, weight: s.weight }] : []));
  const ghostYears = roleStops.filter((r, n) => n === 0 || roleStops[n - 1].year !== r.year);

  return (
    <section
      ref={root}
      id="journey"
      // The build mode leaves the journey alone: the scene already builds itself as it scrolls.
      data-swarm="skip"
      data-mode="flat"
      className={styles.section}
      style={{ "--stops": scrollStops } as React.CSSProperties}
      aria-labelledby="journey-title"
    >
      <div className={styles.stage}>
        <canvas className={styles.stars} aria-hidden />
        <canvas className={styles.thread} aria-hidden />

        <div className={styles.world}>
          {ghostYears.map((g) => (
            <span key={`ghost-${g.i}`} className={styles.ghost} data-i={g.i} data-weight={g.weight} aria-hidden>
              {g.year}
            </span>
          ))}
          <ol className={styles.list}>
            {stops.map((s) =>
              s.kind === "role" ? (
                <li key={s.id} className={styles.card} data-kind="role" data-weight={s.weight}>
                  <div className="text-label flex items-center justify-between gap-4 opacity-70">
                    <span>
                      {s.number} / {total}
                    </span>
                    <span>{s.type}</span>
                  </div>
                  <p className={styles.year}>{s.year}</p>
                  {s.media ? (
                    <div className={styles.media}>
                      <Image
                        src={s.media.src}
                        {...imgProps(s.media)}
                        alt={s.media.alt}
                        width={s.media.width}
                        height={s.media.height}
                        sizes="(max-width: 767px) 80vw, 520px"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  ) : null}
                  <h3 className={styles.cardTitle}>{s.title}</h3>
                  {s.roles.length ? (
                    <ul className={styles.roles}>
                      {s.roles.map((r) => (
                        <li key={`${r.title}-${r.period}`}>
                          <span className={styles.roleTitle}>{r.title}</span>
                          <span className={styles.period}>{r.period}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {s.highlights.length ? (
                    <ul className={styles.highlights}>
                      {s.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  ) : null}
                  {s.link ? (
                    <>
                      <p className={styles.cta} aria-hidden>
                        {s.cta} <Arrow external={s.link.kind === "external"} />
                      </p>
                      {/* The link is a layer over the whole card, so the click target is the card itself. */}
                      <StopLink link={s.link} className={styles.cover}>
                        <span className="sr-only">
                          {s.title}: {s.cta}
                        </span>
                      </StopLink>
                    </>
                  ) : null}
                </li>
              ) : s.items.length === 1 ? (
                <li key={s.id} className={styles.card} data-kind="project" data-weight="project">
                  {s.items[0].cover ? (
                    <div className={styles.thumb}>
                      <Image
                        src={s.items[0].cover.src}
                        {...imgProps(s.items[0].cover)}
                        alt=""
                        width={s.items[0].cover.width}
                        height={s.items[0].cover.height}
                        sizes="280px"
                        loading="lazy"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  ) : null}
                  <p className={styles.attach}>{s.attach}</p>
                  <h4 className={styles.projectTitle}>{s.items[0].title}</h4>
                  <p className={styles.meta}>{s.items[0].meta}</p>
                  <p className={styles.cta} aria-hidden>
                    {s.items[0].cta} <Arrow external={s.items[0].link.kind === "external"} />
                  </p>
                  <StopLink link={s.items[0].link} className={styles.cover}>
                    <span className="sr-only">
                      {s.items[0].title}: {s.items[0].cta}
                    </span>
                  </StopLink>
                </li>
              ) : (
                <li key={s.id} className={styles.card} data-kind="project" data-weight="project" data-stack="">
                  <p className={styles.attach}>{s.attach}</p>
                  <ul className={styles.stack}>
                    {s.items.map((item) => (
                      <li key={item.slug} className={styles.stackRow}>
                        <span>
                          <span className={styles.projectTitle}>{item.title}</span>
                          <span className={styles.meta}>{item.meta}</span>
                        </span>
                        <Arrow external={item.link.kind === "external"} />
                        <StopLink link={item.link} className={styles.cover}>
                          <span className="sr-only">
                            {item.title}: {item.cta}
                          </span>
                        </StopLink>
                      </li>
                    ))}
                  </ul>
                </li>
              ),
            )}
          </ol>
        </div>

        <header className={styles.hud}>
          <p className="text-label">{labels.eyebrow}</p>
          <h2 id="journey-title" className={styles.hudTitle}>
            {labels.title}
          </h2>
        </header>
        <div className={styles.hudBottom} aria-hidden>
          <span className={`text-label ${styles.hint}`}>{labels.hint}</span>
          <span className={styles.bar}>
            <span className={styles.barFill} />
          </span>
          <span className={`text-label ${styles.chapter}`}>{stops[0].chapter}</span>
          <span className={`text-label ${styles.counter}`}>
            {stops[0].number} / {total}
          </span>
        </div>
      </div>
    </section>
  );
}
