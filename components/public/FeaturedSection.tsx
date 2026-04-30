import Image from "next/image";
import { formatPriceCents } from "@/lib/format";
import type { PublicSitePayload } from "@/lib/data/public-site";

export function FeaturedSection({
  items,
}: {
  items: PublicSitePayload["featuredItems"];
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="featured"
      className="scroll-mt-[max(0.75rem,calc(var(--site-header-h,5.25rem)+0.5rem))] border-b border-stone-200/80 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-serif text-3xl text-stone-900 sm:text-4xl">Unsere Favoriten</h2>
        <p className="mt-2 text-stone-600">Ausgewählte Gerichte aus unserer Küche.</p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-stone-200">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                ) : (
                  <div
                    className="flex h-full items-center justify-center text-sm text-stone-500"
                    aria-hidden
                  >
                    Foto folgt
                  </div>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-amber-800/80">
                  {item.categoryName}
                </p>
                <h3 className="mt-1 font-serif text-xl text-stone-900">
                  {item.name}
                </h3>
                {item.description ? (
                  <p className="mt-2 line-clamp-3 text-sm text-stone-600">
                    {item.description}
                  </p>
                ) : null}
                <p className="mt-4 text-lg font-semibold text-stone-900">
                  {item.is_available ? (
                    formatPriceCents(item.price_cents)
                  ) : (
                    <span className="text-stone-500">Aktuell nicht verfügbar</span>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
