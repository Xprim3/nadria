"use client";

import Image from "@/components/AppImage";
import { useEffect, useId, useRef, useState } from "react";

const DISMISS_MS = 2 * 60 * 60 * 1000;
const STORAGE_KEY = "adriade-promo-modal-dismiss";

type DismissState = {
  at: number;
  path: string;
};

type PromoModalProps = {
  enabled: boolean;
  imageUrl: string | null;
  imagePath: string | null;
  linkUrl: string | null;
};

function readDismiss(): DismissState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DismissState;
    if (typeof parsed?.at !== "number" || typeof parsed?.path !== "string") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeDismiss(path: string) {
  const payload: DismissState = { at: Date.now(), path };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function shouldShow(path: string) {
  const dismiss = readDismiss();
  if (!dismiss) return true;
  if (dismiss.path !== path) return true;
  return Date.now() - dismiss.at >= DISMISS_MS;
}

export function PromoModal({
  enabled,
  imageUrl,
  imagePath,
  linkUrl,
}: PromoModalProps) {
  const titleId = useId();
  const imagePathRef = useRef(imagePath);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  imagePathRef.current = imagePath;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !enabled || !imageUrl || !imagePath) return;
    if (!shouldShow(imagePath)) return;

    const openTimer = window.setTimeout(() => {
      setOpen(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    }, 450);

    return () => window.clearTimeout(openTimer);
  }, [mounted, enabled, imageUrl, imagePath]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };

    function dismiss() {
      setVisible(false);
      const path = imagePathRef.current;
      if (path) writeDismiss(path);
      window.setTimeout(() => setOpen(false), 280);
    }
  }, [open]);

  function close() {
    setVisible(false);
    if (imagePath) writeDismiss(imagePath);
    window.setTimeout(() => setOpen(false), 280);
  }

  if (!mounted || !open || !imageUrl) return null;

  const poster = (
    <Image
      src={imageUrl}
      alt="Aktuelle Aktion"
      width={720}
      height={960}
      className="h-auto max-h-[min(78vh,820px)] w-auto max-w-full object-contain"
      sizes="(min-width: 768px) 420px, 88vw"
      priority
    />
  );

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
        onClick={close}
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
          onClick={close}
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
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(28,25,23,0.35)] ring-1 ring-stone-950/10">
          {linkUrl ? (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              onClick={close}
            >
              {poster}
            </a>
          ) : (
            poster
          )}
        </div>
      </div>
    </div>
  );
}
