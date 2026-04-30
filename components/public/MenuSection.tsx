import Image from "next/image";
import type { PublicSitePayload } from "@/lib/data/public-site";
import { getMenuPdfUrl } from "@/lib/supabase/public-urls";

const menuCards = [
  {
    title: "Restaurant-Menü",
    eyebrow: "Restaurant",
    description:
      "Italienische Klassiker, Hauspizzen, Pasta, Antipasti und Desserts direkt am Tisch serviert.",
    href: getMenuPdfUrl("dineIn"),
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    items: ["Holzofenpizza", "Hausgemachte Pasta", "Antipasti", "Desserts"],
  },
  {
    title: "Liefer-Menü",
    eyebrow: "Abholung & Lieferung",
    description:
      "Eine praktische Auswahl für Abholung und Lieferung, frisch aus unserer Küche zubereitet.",
    href: getMenuPdfUrl("delivery"),
    image:
      "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=80",
    items: ["Pizza", "Pasta-Boxen", "Salate", "Familienfavoriten"],
  },
] as const;

export function MenuSection({
  restaurant,
}: {
  restaurant: PublicSitePayload["restaurant"];
}) {
  const restaurantName = restaurant.name?.trim() || "unserem Restaurant";

  return (
    <section
      id="menu"
      className="relative isolate scroll-mt-[max(0.75rem,calc(var(--site-header-h,5.25rem)+0.5rem))] overflow-hidden border-b border-stone-900/20 bg-stone-950 py-20 text-white sm:py-24 lg:py-28"
    >
      <Image
        src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=2200&q=80"
        alt=""
        fill
        className="-z-30 object-cover opacity-35"
        sizes="100vw"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(110deg,rgba(12,10,9,0.96)_0%,rgba(28,25,23,0.86)_42%,rgba(69,26,3,0.66)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-black/60 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-t from-black/70 to-transparent"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-200">
              Unsere Menüs
            </p>
            <h2 className="mt-4 max-w-2xl font-serif text-[clamp(2.6rem,5vw+0.75rem,5.5rem)] font-medium leading-[0.95] tracking-tight text-white">
              Ein Tisch voller italienischer Klassiker.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-stone-200 sm:text-lg lg:pb-2">
            Wähle das Restaurant-Menü für den Besuch bei {restaurantName} oder öffne das Liefer-Menü für Abholung und Bestellungen nach Hause.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-14 lg:gap-6">
          {menuCards.map((menu) => (
            <article
              key={menu.href}
              className="group relative overflow-hidden rounded-4xl border border-white/12 bg-white/8 p-3 shadow-[0_28px_90px_rgba(0,0,0,0.28)] ring-1 ring-white/10 backdrop-blur-md sm:p-4"
            >
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber-200/18 blur-3xl transition duration-700 group-hover:scale-125"
                aria-hidden
              />
              <div className="relative grid overflow-hidden rounded-[1.75rem] border border-white/10 bg-stone-950/45 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] sm:items-stretch">
                <div className="relative min-h-64 overflow-hidden bg-stone-900 sm:min-h-full">
                  <Image
                    src={menu.image}
                    alt=""
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.035]"
                    sizes="(min-width: 768px) 22vw, 100vw"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-stone-950/70 via-stone-950/5 to-transparent sm:bg-linear-to-r sm:from-transparent sm:to-stone-950/35"
                    aria-hidden
                  />
                </div>

                <div className="flex min-w-0 flex-col p-5 sm:p-6 lg:p-7">
                  <p className="text-xs font-semibold tracking-[0.24em] text-amber-200 uppercase">
                    {menu.eyebrow}
                  </p>
                  <h3 className="mt-4 font-serif text-3xl font-medium leading-tight text-white sm:text-4xl">
                    {menu.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-200 sm:text-base">
                    {menu.description}
                  </p>

                  <ul className="mt-6 grid gap-2.5 text-sm text-stone-200">
                    {menu.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={menu.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex w-fit items-center justify-center rounded-full border border-amber-200/55 bg-amber-100 px-5 py-3 text-sm font-semibold text-red-950 shadow-[0_14px_35px_rgba(0,0,0,0.2)] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100"
                  >
                    Menü öffnen
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-stone-300">
          Die Menüs öffnen als PDF-Dateien, damit du sie auf dem Handy oder Desktop klar lesen kannst.
        </p>
      </div>
    </section>
  );
}
