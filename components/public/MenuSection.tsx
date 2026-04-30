import Image from "next/image";
import type { PublicSitePayload } from "@/lib/data/public-site";
import { getMenuPdfUrl } from "@/lib/supabase/public-urls";

function IconDining(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v9M10 3v9M6 7h4M14 3v18M18 3c1.657 0 3 1.567 3 3.5S19.657 10 18 10V3Z" />
    </svg>
  );
}

function IconDelivery(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v9H3V7ZM14 10h3.2l2.8 3.2V16h-6v-6ZM6.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </svg>
  );
}

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
    Icon: IconDining,
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
    Icon: IconDelivery,
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-200">
              Unsere Menüs
            </p>
            <h2 className="mt-4 max-w-2xl font-serif text-[clamp(2.2rem,4.2vw+0.8rem,4.6rem)] font-medium leading-[0.97] tracking-tight text-white">
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
                  <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.24em] text-amber-200 uppercase">
                    <menu.Icon className="h-4 w-4" />
                    <span>{menu.eyebrow}</span>
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
                    className="mt-8 inline-flex w-fit items-center justify-center gap-2 rounded-full border border-amber-200/55 bg-amber-100 px-5 py-3 text-sm font-semibold text-red-950 shadow-[0_14px_35px_rgba(0,0,0,0.2)] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100"
                  >
                    <span>Menü öffnen</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5l8 7-8 7" />
                    </svg>
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
