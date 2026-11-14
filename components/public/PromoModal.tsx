"use client";

import Image from "@/components/AppImage";
import {
  promoDismissSignature,
  type PublicPromoPoster,
} from "@/lib/promo";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

const DISMISS_MS = 2 * 60 * 60 * 1000;
const STORAGE_KEY = "adriade-promo-modal-dismiss";

type DismissState = {
  at: number;
  signature: string;
};

function readDismiss(): DismissState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      at?: unknown;
      signature?: unknown;
      path?: unknown;
    };
    if (typeof parsed?.at !== "number") return null;
    if (typeof parsed.signature === "string") {
      return { at: parsed.at, signature: parsed.signature };
    }
    if (typeof parsed.path === "string") {
      return { at: parsed.at, signature: parsed.path };
    }
    return null;
  } catch {
    return null;
  }
}

function writeDismiss(signature: string) {
  const payload = { at: Date.now(), signature, path: signature };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function shouldShow(signature: string) {
  const dismiss = readDismiss();
  if (!dismiss) return true;
  if (dismiss.signature !== signature) return true;
  return Date.now() - dismiss.at >= DISMISS_MS;
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function PosterImage({
  src,
  priority = true,
}: {
  src: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt="Aktuelle Aktion"
      width={720}
      height={960}
      className="h-auto max-h-[min(78vh,820px)] w-auto max-w-full object-contain"
      sizes="(min-width: 768px) 420px, 88vw"
      {...(priority ? { priority: true } : { loading: "lazy" as const })}
    />
  );
}

export function PromoModal({ posters }: { posters: PublicPromoPoster[] }) {
  const titleId = useId();
  const scrollerId = useId();
  const signature = promoDismissSignature(posters);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef({ moved: false });
  const mounted = useIsClient();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [indexSignature, setIndexSignature] = useState(signature);
  const multiple = posters.length >= 2;

  if (signature !== indexSignature) {
    setIndexSignature(signature);
    setIndex(0);
  }

  const goTo = useCallback(
    (next: number) => {
      const count = posters.length;
      if (count < 2) return;
      const wrapped = ((next % count) + count) % count;
      setIndex(wrapped);
      const scroller = scrollerRef.current;
      if (!scroller || scroller.clientWidth <= 0) return;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      scroller.scrollTo({
        left: wrapped * scroller.clientWidth,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    },
    [posters.length],
  );

  useEffect(() => {
    if (!mounted || posters.length === 0) return;
    if (!shouldShow(signature)) return;

    const openTimer = window.setTimeout(() => {
      setOpen(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    }, 450);

    return () => window.clearTimeout(openTimer);
  }, [mounted, posters.length, signature]);

  useEffect(() => {
    if (!open) return;
    scrollerRef.current?.scrollTo({ left: 0 });
  }, [open, signature]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setVisible(false);
        writeDismiss(signature);
        window.setTimeout(() => setOpen(false), 280);
        return;
      }
      if (posters.length < 2) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      goTo(index + delta);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, signature, posters.length, index, goTo]);

  function close() {
    setVisible(false);
    writeDismiss(signature);
    window.setTimeout(() => setOpen(false), 280);
  }

  function requestClose() {
    if (swipeRef.current.moved) {
      swipeRef.current.moved = false;
      return;
    }
    close();
  }

  function onPosterLinkClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (swipeRef.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      swipeRef.current.moved = false;
      return;
    }
    close();
  }

  function onScrollerPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const startX = event.clientX;
    const startY = event.clientY;
    swipeRef.current.moved = false;
    const mark = (ev: PointerEvent) => {
      if (
        Math.abs(ev.clientX - startX) > 10 ||
        Math.abs(ev.clientY - startY) > 10
      ) {
        swipeRef.current.moved = true;
      }
    };
    const end = () => {
      window.removeEventListener("pointermove", mark);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      window.setTimeout(() => {
        swipeRef.current.moved = false;
      }, 400);
    };
    window.addEventListener("pointermove", mark);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  }

  function onScrollerScroll(event: React.UIEvent<HTMLDivElement>) {
    const el = event.currentTarget;
    if (el.clientWidth <= 0) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    const clamped = Math.min(posters.length - 1, Math.max(0, next));
    setIndex((current) => (current === clamped ? current : clamped));
  }

  const primary = posters[0];
  if (!mounted || !open || !primary) return null;

  const singlePoster = <PosterImage src={primary.imageUrl} />;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-stone-950/55 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Schließen"
        onClick={multiple ? requestClose : close}
      />
      <div
        className={`relative z-10 w-full max-w-[min(92vw,26rem)] transition-[opacity,transform] duration-300 ease-out ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        <h2 id={titleId} className="sr-only">
          Aktion
        </h2>
        <button
          type="button"
          onClick={multiple ? requestClose : close}
          className="absolute -top-3 -right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-stone-950 text-white shadow-lg transition hover:bg-red-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100"
          aria-label="Schließen"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div
          className={`overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(28,25,23,0.35)] ring-1 ring-stone-950/10 ${
            multiple ? "relative" : ""
          }`}
        >
          {multiple ? (
            <>
              <div
                id={scrollerId}
                ref={scrollerRef}
                className="flex w-full min-w-0 snap-x snap-mandatory overflow-x-auto overscroll-x-contain touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                onScroll={onScrollerScroll}
                onPointerDown={onScrollerPointerDown}
                aria-label="Aktionen"
              >
                {posters.map((poster, posterIndex) => {
                  const image = (
                    <PosterImage
                      src={poster.imageUrl}
                      priority={posterIndex === 0}
                    />
                  );
                  return (
                    <div
                      key={poster.id}
                      className="flex min-w-0 shrink-0 grow-0 basis-full snap-center snap-always items-center justify-center overflow-hidden"
                    >
                      {poster.linkUrl ? (
                        <a
                          href={poster.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block max-w-full"
                          onClick={onPosterLinkClick}
                        >
                          {image}
                        </a>
                      ) : (
                        image
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                className="promo-poster-arrow absolute top-1/2 left-2 z-20 h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-stone-950/80 text-white shadow-lg transition hover:bg-red-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100"
                aria-label="Vorherige Aktion"
                aria-controls={scrollerId}
                onClick={() => goTo(index - 1)}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 6 9 12l6 6"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="promo-poster-arrow absolute top-1/2 right-2 z-20 h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-stone-950/80 text-white shadow-lg transition hover:bg-red-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100"
                aria-label="Nächste Aktion"
                aria-controls={scrollerId}
                onClick={() => goTo(index + 1)}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9 6 6 6-6 6"
                  />
                </svg>
              </button>
            </>
          ) : primary.linkUrl ? (
            <a
              href={primary.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              onClick={close}
            >
              {singlePoster}
            </a>
          ) : (
            singlePoster
          )}
        </div>
        {multiple ? (
          <div className="mt-1 flex flex-wrap items-center justify-center">
            {posters.map((poster, posterIndex) => (
              <button
                key={poster.id}
                type="button"
                className="flex h-11 w-11 items-center justify-center"
                aria-label={`Aktion ${posterIndex + 1} von ${posters.length}`}
                aria-current={posterIndex === index ? "true" : undefined}
                aria-controls={scrollerId}
                onClick={() => goTo(posterIndex)}
              >
                <span
                  className={`rounded-full ${
                    posterIndex === index
                      ? "h-2.5 w-2.5 bg-white"
                      : "h-2 w-2 bg-white/50"
                  }`}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
