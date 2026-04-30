"use client";

import { useEffect, useState } from "react";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setVisible(window.scrollY > 500);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <button
      type="button"
      className={`fixed right-4 bottom-24 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-stone-950/90 text-xl leading-none text-white shadow-[0_14px_35px_rgba(28,25,23,0.25)] backdrop-blur transition-[opacity,transform,background-color] duration-300 will-change-transform hover:bg-red-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100 sm:right-6 sm:bottom-6 ${
        visible
          ? "scale-100 opacity-100"
          : "pointer-events-none scale-95 opacity-0"
      }`}
      aria-label="Nach oben"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      ↑
    </button>
  );
}
