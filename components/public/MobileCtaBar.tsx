export function MobileCtaBar({
  telHref,
  directionsUrl,
}: {
  telHref: string | null;
  directionsUrl: string | null;
}) {
  const locationHref = directionsUrl ?? "https://maps.app.goo.gl/omxtAs8qfxaDdPD18";
  const phoneHref = telHref ?? "tel:+496519664588";

  return (
    <div className="safe-area-pb pointer-events-none fixed right-0 bottom-0 left-0 z-30 p-3 pl-[max(0.75rem,env(safe-area-inset-left,0.75rem))] pr-[max(0.75rem,env(safe-area-inset-right,0.75rem))] sm:hidden">
      <div className="pointer-events-auto mx-auto flex max-w-sm overflow-hidden rounded-full border border-stone-200/90 bg-[#faf7f2]/92 shadow-[0_14px_40px_rgba(28,25,23,0.16)] backdrop-blur-md">
        <a
          href={phoneHref}
          className="flex min-h-12 min-w-0 flex-1 touch-manipulation items-center justify-center px-5 text-sm font-semibold text-red-900 transition active:bg-red-50"
        >
          Anrufen
        </a>
        <span className="my-3 w-px bg-stone-300/80" aria-hidden />
        <a
          href={locationHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 min-w-0 flex-1 touch-manipulation items-center justify-center px-5 text-sm font-semibold text-stone-800 transition active:bg-stone-100"
        >
          Standort
        </a>
      </div>
    </div>
  );
}
