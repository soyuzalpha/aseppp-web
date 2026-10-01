"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/* Cursor spotlight — a soft lime glow that trails the pointer, so the paper
   grain only reads where you're actually looking. Mounted once in the root
   layout, so every page gets it; `position: fixed` means it works the same
   whether the page scrolls or not.

   Guarded on `pointerType === "mouse"` rather than `(hover: hover)`: a
   touchscreen laptop reports hover-capable yet still fires `pointermove` on a
   finger drag, which would smear the glow across the page while scrolling. A
   real cursor is the only thing that should move it.

   `is-on` is added on the first real pointermove. Without it the glow sits
   parked at the top-left corner on load.

   Decorative: `aria-hidden`, and it bails out entirely under
   prefers-reduced-motion. */
export default function Spotlight() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.set(el, { xPercent: -50, yPercent: -50 });
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

      let shown = false;
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        xTo(e.clientX);
        yTo(e.clientY);
        if (!shown) {
          shown = true;
          el.classList.add("is-on");
        }
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    /* The layer exists only to give the glow an isolated stacking context.
       `mix-blend-mode: soft-light` blends against whatever is painted behind
       the element *inside its own stacking context*. As a bare child of body
       that backdrop is the near-white paper, and soft-light lime over near-white
       paper is mathematically a no-op — measured G-B (green minus blue) of 4.4
       versus 89.9 for the same element with blending off. Isolating it means the
       glow blends against a transparent backdrop and renders as the soft lime
       wash it is everywhere else. */
    <div className="spotlight-layer" aria-hidden="true">
      <div ref={spotRef} className="spotlight" />
    </div>
  );
}
