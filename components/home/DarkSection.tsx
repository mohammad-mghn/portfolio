"use client";

import clsx from "clsx";
import { useRef, type ReactNode } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setTone } from "@/lib/tone";

/** Night-coloured band that flips the header/rail tone while it sits under the header. */
export function DarkSection({
  id,
  labelledBy,
  className,
  children,
}: {
  id: string;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: "top top+=32",
        end: "bottom top+=32",
        onToggle: (self) => setTone(id, self.isActive),
      });
      return () => {
        st.kill();
        setTone(id, false);
      };
    },
    { scope: ref },
  );
  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      className={clsx("relative z-1 bg-night text-[#ece8df] [--hair:#2c2d29]", className)}
    >
      {children}
    </section>
  );
}
