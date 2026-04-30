"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PublicSitePayload } from "@/lib/data/public-site";

const FEATURED_AUTO_MS = 5000;
const FEATURED_MANUAL_PAUSE_MS = 7000;

const DESKTOP_TILE_LABELS = ["Antipasti", "Salate", "Pizza", "Fisch"];

function NoImagePlaceholder({ label = "Kein Bild" }: { label?: string }) {
  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 bg-stone-100 px-6 text-center text-stone-500 sm:min-h-0">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/70">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-7 w-7"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16l4.5-4.5a2 2 0 0 1 2.8 0L16 16m-2-2 1.5-1.5a2 2 0 0 1 2.8 0L20 14.2M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Zm4.75 1.75h.01"
          />
        </svg>
      </div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
}

export function GallerySection({
  items,
}: {
  items: PublicSitePayload["gallery"];
}) {
  const galleryItems =
    items
      .filter((item): item is typeof item & { imageUrl: string } =>
        Boolean(item.imageUrl),
      )
      .map((item) => ({
        id: item.id,
        imageUrl: item.imageUrl,
        caption: item.caption || "Galeriebild",
        sortOrder: item.sort_order,
        storagePath: item.storage_path,
      })) || [];

  const staticItems = galleryItems.filter((item) =>
    item.storagePath.startsWith("static/"),
  );
  const sliderItems = galleryItems.filter(
    (item) =>
      !item.storagePath.startsWith("static/") &&
      !item.storagePath.startsWith("hero/"),
  );
  const sliderDisplayItems = sliderItems;
  const staticDisplayItems = [1, 2, 3, 4].map(
    (slot, index) =>
      staticItems.find((item) => item.sortOrder === slot) ??
      staticItems[index] ??
      null,
  );
  const totalCount = sliderDisplayItems.length;
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const autoResumeAtRef = useRef(0);
  const normalizedFeaturedIndex = totalCount > 0 ? featuredIndex % totalCount : 0;

  const pauseAutoSlider = () => {
    autoResumeAtRef.current = Date.now() + FEATURED_MANUAL_PAUSE_MS;
  };

  useEffect(() => {
    if (totalCount < 2) return;

    let id: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (id) clearInterval(id);
      id = setInterval(() => {
        if (Date.now() < autoResumeAtRef.current) return;
        setFeaturedIndex((current) => (current + 1) % totalCount);
      }, FEATURED_AUTO_MS);
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
  }, [totalCount]);

  const showPrevious = () => {
    if (totalCount < 2) return;
    pauseAutoSlider();
    setFeaturedIndex((current) => (current - 1 + totalCount) % totalCount);
  };

  const showNext = () => {
    if (totalCount < 2) return;
    pauseAutoSlider();
    setFeaturedIndex((current) => (current + 1) % totalCount);
  };

  return (
    <section
      id="gallery"
      className="scroll-mt-[max(0.75rem,calc(var(--site-header-h,5.25rem)+0.5rem))] overflow-hidden border-b border-amber-200/70 bg-[#fff8f3] py-18 text-stone-950 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="max-w-2xl font-serif text-[clamp(2rem,4vw+0.75rem,3.8rem)] font-medium leading-[1.04] tracking-tight">
              Ein Eindruck aus unserer Küche.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-stone-600 sm:text-base">
            Frischer Teig, warme Teller, italienische Klassiker und Momente zum Teilen.
          </p>
        </div>

        <ul
          className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-smooth gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-12 sm:grid-rows-[13rem_13rem] sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-rows-[15rem_15rem] [&::-webkit-scrollbar]:hidden"
          onPointerDown={pauseAutoSlider}
          onScroll={pauseAutoSlider}
          onTouchStart={pauseAutoSlider}
          onWheel={pauseAutoSlider}
        >
          {[sliderDisplayItems[0] ?? null, ...staticDisplayItems].map((g, index) => {
            const desktopLabel =
              index === 0 || !g
                ? null
                : g.caption || DESKTOP_TILE_LABELS[index - 1];
            return (
              <li
                key={`${index}-${g?.id ?? "empty"}`}
                className={
                  "group relative min-w-[82vw] shrink-0 snap-center overflow-hidden rounded-3xl bg-amber-100 ring-1 ring-amber-200/80 sm:min-w-0 " +
                  (index === 0
                    ? "sm:col-span-6 sm:row-span-2"
                    : index === 1
                      ? "sm:col-span-3"
                      : index === 2
                        ? "sm:col-span-3"
                        : "sm:col-span-3")
                }
              >
                <div
                  className={
                    index === 0
                      ? "relative aspect-4/5 sm:h-full sm:aspect-auto"
                      : "relative aspect-4/5 sm:h-full sm:aspect-auto"
                  }
                >
                  {index === 0 ? (
                    g ? (
                    <>
                      <Image
                        src={g.imageUrl}
                        alt={g.caption}
                        fill
                        className="object-cover transition duration-700 ease-out sm:hidden"
                        sizes="82vw"
                      />
                      {sliderDisplayItems.map((item, itemIndex) => (
                        <Image
                          key={item.id}
                          src={item.imageUrl}
                          alt={item.caption}
                          fill
                          className={
                            "hidden object-cover transition-[opacity,transform] duration-700 ease-out sm:block " +
                            (itemIndex === normalizedFeaturedIndex
                              ? "opacity-100"
                              : "opacity-0")
                          }
                          sizes="(min-width: 640px) 50vw, 100vw"
                        />
                      ))}
                    </>
                    ) : (
                      <NoImagePlaceholder label="Kein Slider-Bild" />
                    )
                  ) : g ? (
                    <Image
                      src={g.imageUrl}
                      alt={g.caption}
                      fill
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                      sizes="(min-width: 640px) 25vw, 100vw"
                    />
                  ) : (
                    <NoImagePlaceholder />
                  )}
                  {index === 0 && totalCount > 1 ? (
                    <>
                      <button
                        type="button"
                        className="absolute top-1/2 left-4 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-red-800/80 text-3xl leading-none text-white shadow-[0_12px_32px_rgba(127,29,29,0.22)] backdrop-blur-md transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 sm:flex lg:left-5"
                        aria-label="Vorheriges Galeriebild anzeigen"
                        onClick={showPrevious}
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className="absolute top-1/2 right-4 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-red-800/80 text-3xl leading-none text-white shadow-[0_12px_32px_rgba(127,29,29,0.22)] backdrop-blur-md transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 sm:flex lg:right-5"
                        aria-label="Nächstes Galeriebild anzeigen"
                        onClick={showNext}
                      >
                        ›
                      </button>
                    </>
                  ) : null}
                  {index > 0 && desktopLabel ? (
                    <div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-red-950/32 sm:flex">
                      <p className="px-4 text-center font-serif text-2xl leading-none text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.75)] lg:text-3xl">
                        {desktopLabel}
                      </p>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
