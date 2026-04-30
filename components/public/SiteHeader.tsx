"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { getHeaderBrand } from "@/lib/brand-name";

const nav = [
  { href: "#top", label: "Start" },
  { href: "#about", label: "Über uns" },
  { href: "#gallery", label: "Galerie" },
  { href: "#menu", label: "Menü" },
  { href: "#reservations", label: "Reservierung" },
  { href: "#reviews", label: "Bewertungen" },
  { href: "#contact", label: "Öffnungszeiten & Standort" },
] as const;

const drawerEase = "cubic-bezier(0.32, 0.72, 0, 1)";

function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function IconClose(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function MobileMenuDrawer({
  open,
  onClose,
  panelId,
  brandLead,
  brandSub,
}: {
  open: boolean;
  onClose: () => void;
  panelId: string;
  brandLead: string;
  brandSub: string;
}) {
  const canUseDom = useSyncExternalStore(
    () => () => {
      // no-op: document availability does not change after mount
    },
    () => true,
    () => false,
  );

  if (!canUseDom) {
    return null;
  }

  return createPortal(
    <div
      className="md:hidden"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200_000,
        pointerEvents: open ? "auto" : "none",
      }}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={-1}
        className="absolute inset-0 z-0 block border-0 bg-stone-950/50 p-0 backdrop-blur-[2px] transition-opacity duration-300"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        aria-label="Menü schließen"
        onClick={onClose}
      />
      <aside
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label="Restaurant-Navigation"
        className="bg-background text-foreground absolute top-0 right-0 z-10 flex h-dvh w-[min(22rem,88vw)] max-w-full flex-col overflow-hidden border-l border-stone-200/90 shadow-[-8px_0_32px_rgba(28,25,23,0.12)] will-change-transform motion-reduce:transform-none"
        style={{
          backgroundColor: "var(--background)",
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
          transform: open ? "translate3d(0,0,0)" : "translate3d(100%,0,0)",
          transition: `transform 320ms ${drawerEase}`,
        }}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-stone-200/70 px-5 py-3 pr-[max(1.25rem,env(safe-area-inset-right,1.25rem))] pl-[max(1.25rem,env(safe-area-inset-left,1.25rem))] sm:gap-3">
          <div className="min-w-0 flex-1 pr-1">
            <p className="font-serif text-3xl font-semibold leading-tight tracking-tight text-stone-900 min-[400px]:text-4xl">
              {brandLead}
            </p>
            <p className="mt-1.5 max-w-60 font-sans text-xs font-medium leading-snug tracking-[0.16em] text-amber-900/90 uppercase sm:mt-2 sm:max-w-none sm:text-sm sm:leading-snug sm:tracking-[0.2em]">
              {brandSub}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 touch-manipulation items-center justify-center self-center rounded-full border border-stone-200/80 bg-white/80 text-stone-700 shadow-sm transition active:bg-stone-200/50 hover:bg-amber-50/90"
            aria-label="Menü schließen"
            onClick={onClose}
          >
            <IconClose className="block h-6 w-6" />
          </button>
        </div>

        <nav
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain"
          aria-label="Hauptnavigation"
        >
          <ul className="divide-y divide-stone-300/40">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block touch-manipulation py-4 pr-[max(1.25rem,env(safe-area-inset-right,1.25rem))] pl-5 font-serif text-2xl font-bold leading-tight text-stone-900 transition active:bg-stone-200/50 hover:bg-stone-200/25 focus-visible:bg-stone-200/25 focus-visible:outline-none sm:py-5 sm:pr-5 sm:text-3xl"
                  onClick={onClose}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

      </aside>
    </div>,
    document.body,
  );
}

export function SiteHeader({
  restaurantName,
}: {
  restaurantName: string;
}) {
  const { lead: brandLead, sub: brandSub } = getHeaderBrand();
  const [menuOpen, setMenuOpen] = useState(false);
  const [solidBar, setSolidBar] = useState(false);
  const panelId = useId();
  const headerRef = useRef<HTMLElement | null>(null);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    /** Same scroll the browser uses; window.scrollY alone is often 0 in nested scrollers or some mobile cases. */
    const getPageScrollY = () => {
      const se = document.scrollingElement ?? document.documentElement;
      return Math.max(
        0,
        window.pageYOffset,
        se.scrollTop,
        document.body.scrollTop,
        document.documentElement.scrollTop,
      );
    };

    const findNonWindowScrollport = (start: Element | null): HTMLElement | null => {
      let node: Element | null = start;
      while (node) {
        if (node === document.body || node === document.documentElement) {
          return null;
        }
        if (!(node instanceof HTMLElement)) {
          node = node.parentElement;
          continue;
        }
        const { overflowY } = getComputedStyle(node);
        if (
          (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
          node.scrollHeight > node.clientHeight + 1
        ) {
          return node;
        }
        node = node.parentElement;
      }
      return null;
    };

    const tick = () => {
      const hero = document.getElementById("hero");
      if (!hero) {
        setSolidBar(true);
        return;
      }
      const inner = findNonWindowScrollport(hero);
      const y = inner
        ? Math.max(0, inner.scrollTop)
        : getPageScrollY();
      // > 0.5: first real scroll, not iOS overscroll jiggle
      setSolidBar(y > 0.5);
    };

    const opts: AddEventListenerOptions = { passive: true };
    const capOpts: AddEventListenerOptions = { passive: true, capture: true };

    tick();
    window.addEventListener("scroll", tick, opts);
    document.addEventListener("scroll", tick, capOpts);
    window.addEventListener("resize", tick, opts);
    const vv = window.visualViewport;
    vv?.addEventListener("scroll", tick, opts);

    return () => {
      window.removeEventListener("scroll", tick, opts);
      document.removeEventListener("scroll", tick, capOpts);
      window.removeEventListener("resize", tick, opts);
      vv?.removeEventListener("scroll", tick, opts);
    };
  }, []);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const setVar = () => {
      document.documentElement.style.setProperty(
        "--site-header-h",
        `${el.getBoundingClientRect().height}px`,
      );
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    window.addEventListener("resize", setVar);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
      document.documentElement.style.removeProperty("--site-header-h");
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const onLight = solidBar;

  const linkClass = onLight
    ? "relative rounded-lg px-2.5 py-2 text-sm font-medium text-stone-600 transition-[color,transform] duration-200 ease-out after:absolute after:right-2.5 after:bottom-1.5 after:left-2.5 after:h-px after:origin-left after:scale-x-0 after:bg-amber-900 after:transition-transform after:duration-200 after:ease-out hover:text-amber-900 hover:after:scale-x-100 active:scale-[0.97] active:text-amber-950 xl:px-3 xl:after:right-3 xl:after:left-3 2xl:px-3.5 2xl:text-[0.95rem] 2xl:after:right-3.5 2xl:after:left-3.5"
    : "relative rounded-lg px-2.5 py-2 text-sm font-medium text-white/90 transition-[color,transform] duration-200 ease-out after:absolute after:right-2.5 after:bottom-1.5 after:left-2.5 after:h-px after:origin-left after:scale-x-0 after:bg-amber-100 after:transition-transform after:duration-200 after:ease-out hover:text-amber-100 hover:after:scale-x-100 active:scale-[0.97] active:text-amber-200 xl:px-3 xl:after:right-3 xl:after:left-3 2xl:px-3.5 2xl:text-[0.95rem] 2xl:after:right-3.5 2xl:after:left-3.5";

  const menuButtonClass = onLight
    ? "inline-flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 touch-manipulation items-center justify-center rounded-full border border-stone-200/90 bg-white text-stone-900 shadow-sm transition active:scale-[0.98] active:bg-stone-100 hover:bg-stone-50"
    : "inline-flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 touch-manipulation items-center justify-center rounded-full border border-white/35 bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition active:scale-[0.98] active:bg-white/20 hover:bg-white/20";

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 right-0 left-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-[background-color,backdrop-filter,color] duration-300 ease-out ${
          onLight
            ? "bg-background/95 text-foreground shadow-[0_1px_0_rgba(28,25,23,0.06)] backdrop-blur-sm"
            : "bg-transparent text-white backdrop-blur-none"
        }`}
      >
        <div className="mx-auto max-w-7xl box-border px-4 py-3 sm:px-6 sm:py-3.5 lg:max-h-[84px] lg:overflow-hidden lg:px-8 lg:py-3 xl:py-3.5">
          <div className="box-border flex min-h-0 items-center justify-between gap-3 lg:h-full lg:gap-4">
            <a
              href="#top"
              className="flex min-w-0 flex-1 touch-manipulation items-center lg:max-w-[18rem] xl:max-w-88"
              aria-label={restaurantName}
            >
              <span className="min-w-0 text-left">
                <span
                  className={
                    (onLight ? "text-amber-900" : "text-white") +
                    " block max-w-prose font-serif text-[1.45rem] font-semibold leading-tight tracking-tight transition-colors duration-300" +
                    " min-[400px]:text-[1.7rem] sm:text-[1.9rem]" +
                    " md:text-[2rem] md:leading-tight" +
                    " lg:text-[1.6rem] lg:leading-none" +
                    " xl:text-[1.85rem]" +
                    " xl:max-w-none"
                  }
                >
                  {brandLead}
                </span>
                <span
                  className={
                    (onLight
                      ? "text-amber-900/80 md:text-stone-600"
                      : "text-amber-50/90 md:text-white/85") +
                    " mt-0.5 block max-w-prose font-serif text-[0.82rem] italic font-medium leading-snug tracking-[0.01em]" +
                    " min-[400px]:text-[0.9rem] sm:mt-1 sm:max-w-md sm:text-[0.98rem]" +
                    " md:mt-0.5 md:max-w-lg md:text-[0.9rem] md:leading-tight" +
                    " lg:max-w-xl lg:text-[0.78rem] lg:tracking-[0.02em]" +
                    " xl:text-[0.9rem] 2xl:text-[0.98rem]"
                  }
                >
                  {brandSub}
                </span>
              </span>
            </a>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <div className="hidden items-center gap-1 lg:flex xl:gap-1.5">
                <nav aria-label="Hauptnavigation">
                  <ul className="flex max-w-172 flex-nowrap items-center justify-end gap-0 overflow-x-auto py-0.5 [scrollbar-width:none] xl:max-w-none [&::-webkit-scrollbar]:hidden">
                    {nav.map((item) => (
                      <li key={item.href} className="shrink-0">
                        <a href={item.href} className={linkClass}>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              <div className="flex items-center gap-1 lg:hidden">
                <button
                  type="button"
                  className={menuButtonClass}
                  aria-expanded={menuOpen}
                  aria-controls={panelId}
                  aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
                  onClick={() => setMenuOpen((o) => !o)}
                >
                  {menuOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenuDrawer
        open={menuOpen}
        onClose={closeMenu}
        panelId={panelId}
        brandLead={brandLead}
        brandSub={brandSub}
      />
    </>
  );
}
