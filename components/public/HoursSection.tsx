import type { PublicSitePayload } from "@/lib/data/public-site";

export function HoursSection({
  hoursByDay,
}: {
  hoursByDay: PublicSitePayload["hoursByDay"];
}) {
  return (
    <section
      id="reservations"
      className="scroll-mt-[max(0.75rem,calc(var(--site-header-h,5.25rem)+0.5rem))] border-b border-stone-200/80 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-serif text-3xl text-stone-900 sm:text-4xl">
          Öffnungszeiten
        </h2>
        <p className="mt-2 text-stone-600">Wir freuen uns auf deinen Besuch.</p>
        <ul className="mt-8 max-w-md divide-y divide-stone-200/80 rounded-2xl border border-stone-200/80 bg-white px-4 py-1">
          {hoursByDay.map((row) => (
            <li
              key={row.day}
              className="flex items-center justify-between gap-4 py-3 text-sm"
            >
              <span className="font-medium text-stone-800">{row.label}</span>
              <span className="text-stone-600">{row.line}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
