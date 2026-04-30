"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "@/app/actions/auth";
import {
  IconClock,
  IconDashboard,
  IconExternal,
  IconGallery,
  IconMenu,
  IconNotice,
  IconReview,
  IconSettings,
} from "@/components/admin/icons";

const nav: {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { href: "/admin", label: "Dashboard", Icon: IconDashboard },
  { href: "/admin/menu", label: "Menu PDFs", Icon: IconMenu },
  { href: "/admin/hours", label: "Hours", Icon: IconClock },
  { href: "/admin/notices", label: "Notices", Icon: IconNotice },
  { href: "/admin/reviews", label: "Reviews", Icon: IconReview },
  { href: "/admin/gallery", label: "Gallery", Icon: IconGallery },
  { href: "/admin/settings", label: "Settings", Icon: IconSettings },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin" || pathname === "/admin/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClass(active: boolean) {
  return [
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
    active
      ? "bg-zinc-800/90 text-white shadow-sm ring-1 ring-white/10"
      : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white",
  ].join(" ");
}

function NavList({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-0.5" aria-label="Main">
      {nav.map((item) => {
        const active = isActivePath(pathname, item.href);
        const Icon = item.Icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={navLinkClass(active)}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                active
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-zinc-800/0 text-zinc-500 group-hover:text-zinc-200"
              }`}
            >
              <Icon className="h-5 w-5" />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/admin";
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-zinc-100">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-zinc-200/90 bg-white/90 px-3 shadow-sm shadow-zinc-900/5 backdrop-blur sm:px-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-zinc-700 transition hover:bg-zinc-100 md:hidden"
            aria-label="Open menu"
          >
            <span className="sr-only">Open menu</span>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              Restaurant
            </p>
            <p className="truncate text-sm font-semibold text-zinc-900">
              Control center
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconExternal className="h-4 w-4 shrink-0 opacity-80" />
            <span className="hidden sm:inline">View site</span>
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="h-10 rounded-xl bg-zinc-900 px-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
            >
              <span className="hidden sm:inline">Log out</span>
              <span className="sm:hidden" aria-hidden>
                Out
              </span>
            </button>
          </form>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className="hidden w-64 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950 text-zinc-300 md:flex lg:w-72"
          aria-label="Main navigation"
        >
          <div className="border-b border-zinc-800/80 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white shadow-lg shadow-emerald-900/40">
                A
              </div>
              <div className="min-w-0">
                <p className="text-xs text-zinc-500">Adriade</p>
                <p className="truncate text-sm font-semibold text-white">
                  Admin
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto p-3">
            <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Workspace
            </p>
            <NavList pathname={pathname} />
            <div className="mt-auto border-t border-zinc-800/80 pt-4">
              <p className="px-1 text-xs text-zinc-500">
                Tip: keep photos bright and your menu up to date.
              </p>
            </div>
          </div>
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-[2px] md:hidden"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}
        {mobileOpen ? (
          <aside
            className="fixed left-0 top-0 z-50 flex h-dvh w-[min(20rem,88vw)] flex-col border-r border-zinc-800/80 bg-zinc-950 text-zinc-300 shadow-2xl md:hidden"
            aria-label="Main navigation"
          >
            <div className="flex h-14 items-center justify-between border-b border-zinc-800/80 px-3">
              <div className="flex items-center gap-2 pl-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-semibold text-white">Menu</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                aria-label="Close menu"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <NavList
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </aside>
        ) : null}

        <main
          className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden"
          style={{
            background:
              "radial-gradient(1200px 500px at 20% 0%, rgba(16, 185, 129, 0.08), transparent 50%), #f4f4f5",
          }}
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
