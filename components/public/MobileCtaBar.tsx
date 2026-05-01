export function MobileCtaBar({
  telHref,
  directionsUrl: _directionsUrl,
}: {
  telHref: string | null;
  directionsUrl: string | null;
}) {
  const deliveryHref = "https://skanom.com/adriatrier";
  const phoneHref = telHref ?? "tel:+496519664588";

  return (
    <div className="safe-area-pb pointer-events-none fixed right-0 bottom-5 left-0 z-30 p-3 pl-[max(0.75rem,env(safe-area-inset-left,0.75rem))] pr-[max(0.75rem,env(safe-area-inset-right,0.75rem))] sm:hidden">
      <div className="pointer-events-auto mx-auto flex max-w-md overflow-hidden rounded-[1.35rem] border border-amber-200/30 bg-stone-950/88 shadow-[0_20px_48px_rgba(12,10,9,0.55)] ring-1 ring-amber-100/10 backdrop-blur-xl">
        <a
          href={phoneHref}
          className="flex min-h-14 min-w-0 flex-1 touch-manipulation items-center justify-center gap-2.5 bg-linear-to-br from-red-900 via-red-950 to-stone-950 px-4.5 font-serif text-base font-semibold tracking-[0.01em] text-amber-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:brightness-110 active:brightness-95"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4.5 w-4.5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.294a1.125 1.125 0 0 1-1.21.393 12.035 12.035 0 0 1-7.143-7.143 1.125 1.125 0 0 1 .393-1.21l1.294-.97c.36-.27.53-.728.417-1.173L7.091 3.102A1.125 1.125 0 0 0 6 2.25H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
          Reservieren
        </a>
        <span className="my-3 w-px bg-amber-200/25" aria-hidden />
        <a
          href={deliveryHref}
          target="_blank"
          rel="external noopener noreferrer"
          className="flex min-h-14 min-w-0 flex-1 touch-manipulation items-center justify-center gap-2.5 bg-linear-to-br from-amber-200 via-amber-300 to-amber-400 px-4.5 font-serif text-base font-semibold tracking-[0.01em] text-stone-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.34)] transition hover:brightness-105 active:brightness-95"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4.5 w-4.5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v8H3V7Zm11 2h3.2l2.8 3.2V15h-6V9Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          </svg>
          Lieferung
        </a>
      </div>
    </div>
  );
}
