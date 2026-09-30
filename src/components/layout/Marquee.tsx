"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Scroll-velocity ticker. The track renders the list twice and loops on
   `xPercent: -50` — shifting by half of `max-content` is exactly one copy, so
   the seam never shows. ScrollTrigger does not position the track; it only
   retimes the loop (`timeScale`) from the signed scroll velocity, so the band
   drifts on its own and leans into the scroll instead of being pinned to it.
   Scrolling up runs it backwards.

   The retime MUST decay on its own. `onUpdate` stops firing the moment
   scrolling stops, so setting `timeScale` directly there leaves the band
   stuck at whatever speed the last flick had — measured at 10px/frame
   resting instead of the 2px/frame base. `gsap.ticker` eases the target back
   to 1 every frame, so the ticker always returns to its base drift.

   Decorative: `aria-hidden`, so nothing here may be the only place a fact
   appears. The list is duplicated for the loop, which would double every item
   for a screen reader. */
export default function Marquee({ items }: { items: string[] }) {
  const bandRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const loop = gsap.to(trackRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 30,
        ease: "none",
      });

      let target = 1;
      const trigger = ScrollTrigger.create({
        trigger: bandRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity(); // px/s, signed
          target = gsap.utils.clamp(1, 6, Math.abs(v) / 400) * (v < 0 ? -1 : 1);
        },
      });

      const tick = () => {
        target += (1 - target) * 0.04; // ease back to base drift
        loop.timeScale(target);
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        trigger.kill();
      };
    }, bandRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={bandRef} className="marquee" aria-hidden="true">
      <div ref={trackRef} className="marquee-track">
        {[0, 1].map((copy) =>
          items.map((item, i) => (
            <span key={`${copy}-${i}`} className="marquee-item">
              {item}
            </span>
          )),
        )}
      </div>
    </div>
  );
}
