"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

const AUTO_MS = 7000;

export type HeroSlide = { id: string; src: string; alt: string };

function useReducedMotion() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function HeroImageCarousel({ slides }: { slides: HeroSlide[] }) {
  const list: HeroSlide[] = useMemo(() => slides, [slides]);

  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const activeIndex = list.length > 0 ? index % list.length : 0;

  useEffect(() => {
    if (list.length < 2 || reduced) return;

    let id: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (id) clearInterval(id);
      id = setInterval(() => {
        setIndex((i) => (i + 1) % list.length);
      }, AUTO_MS);
    };

    const onVis = () => {
      if (document.hidden) {
        if (id) {
          clearInterval(id);
          id = null;
        }
      } else {
        start();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (id) clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [list.length, reduced]);

  return (
    <div className="absolute inset-0 z-0" aria-hidden>
      {list.length === 0 ? (
        <div className="absolute inset-0 bg-stone-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.16),transparent_36%),linear-gradient(135deg,rgba(120,53,15,0.45),rgba(28,25,23,0.95))]" />
        </div>
      ) : null}
      {list.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none"
          style={{
            opacity: i === activeIndex ? 1 : 0,
            zIndex: i === activeIndex ? 1 : 0,
          }}
        >
          <Image
            src={slide.src}
            alt=""
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
            loading={i === 0 ? undefined : "lazy"}
          />
        </div>
      ))}
    </div>
  );
}
