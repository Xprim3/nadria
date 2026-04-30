import type { PublicSitePayload } from "@/lib/data/public-site";

const fallbackAddress = ["Koblenzer Str. 1F", "54293 Trier", "Deutschland"];
const fallbackPhone = "+49 651 966 45 88";
const fallbackTelHref = "tel:+496519664588";
const fallbackEmail = "info@pizzeriaadria.de";
const fallbackMailtoHref = "mailto:info@pizzeriaadria.de";

export function ContactSection({
  restaurant,
  hoursByDay,
  telHref,
  mailtoHref,
}: {
  restaurant: PublicSitePayload["restaurant"];
  hoursByDay: PublicSitePayload["hoursByDay"];
  telHref: string | null;
  mailtoHref: string | null;
}) {
  const configuredAddressParts = [
    restaurant.address_line,
    [restaurant.postal_code, restaurant.city].filter(Boolean).join(" "),
    restaurant.country,
  ].filter((x) => x && String(x).trim());
  const addressParts =
    configuredAddressParts.length > 1 ? configuredAddressParts : fallbackAddress;
  const line = addressParts.join("\n");
  const mapQuery =
    addressParts.length > 1
      ? addressParts.join(", ")
      : "Pizzeria Adria Trier-Quint, Deutschland";
  const mapSrc = mapEmbedSrc(restaurant.maps_url, mapQuery);
  const phoneText = restaurant.phone?.trim() || fallbackPhone;
  const phoneLink = telHref ?? fallbackTelHref;
  const emailText = restaurant.email?.trim() || fallbackEmail;
  const emailLink = mailtoHref ?? fallbackMailtoHref;
  const hasConfiguredHours = hoursByDay.some((row) => row.line !== "—");
  const displayHours = hasConfiguredHours
    ? hoursByDay
    : [
        { day: 0, label: "Montag", line: "Geschlossen" },
        {
          day: 1,
          label: "Dienstag – Sonntag",
          line: "11:00 – 14:00 und 17:00 – 22:00",
        },
      ];

  return (
    <section
      id="contact"
      className="relative isolate scroll-mt-[max(0.75rem,calc(var(--site-header-h,5.25rem)+0.5rem))] overflow-hidden border-b border-stone-200/80 bg-[#fff8f3] py-18 text-stone-950 sm:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_16%,rgba(217,119,6,0.1),transparent_32%),radial-gradient(circle_at_88%_80%,rgba(127,29,29,0.08),transparent_36%)]"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-800">
            Besuche uns
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2.15rem,4vw+0.75rem,3.8rem)] font-medium leading-[1.04] tracking-tight">
            Öffnungszeiten & Standort
          </h2>
          <p className="mt-5 text-base leading-relaxed text-stone-600 sm:text-lg">
            Besuche unser Restaurant in Trier. Wir sind mit dem Auto oder öffentlichen Verkehrsmitteln gut erreichbar.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:gap-8">
          <div className="grid gap-6">
            <article className="rounded-4xl border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(68,64,60,0.11)] ring-1 ring-stone-900/3 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800">
                Öffnungszeiten
              </p>
              <ul className="mt-6 divide-y divide-stone-200/80">
                {displayHours.map((row) => (
                  <li
                    key={row.day}
                    className="flex items-center justify-between gap-4 py-3 text-sm"
                  >
                    <span className="font-medium text-stone-900">{row.label}</span>
                    <span className="text-right text-stone-600">{row.line}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-4xl border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(68,64,60,0.09)] ring-1 ring-stone-900/3 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800">
                Kontakt
              </p>
              <div className="mt-6 space-y-5">
                {line ? (
                  <div>
                    <p className="text-sm font-semibold text-stone-950">Adresse</p>
                    <p className="mt-1 whitespace-pre-line leading-relaxed text-stone-600">
                      {line}
                    </p>
                  </div>
                ) : null}
                <div>
                  <p className="text-sm font-semibold text-stone-950">Telefon</p>
                  <a
                    className="mt-1 inline-block font-medium text-red-900 underline-offset-4 transition hover:text-red-700 hover:underline"
                    href={phoneLink}
                  >
                    {phoneText}
                  </a>
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-950">E-Mail</p>
                  <a
                    className="wrap-break-word mt-1 inline-block font-medium text-red-900 underline-offset-4 transition hover:text-red-700 hover:underline"
                    href={emailLink}
                  >
                    {emailText}
                  </a>
                </div>
              </div>
            </article>
          </div>

          <div className="min-h-[420px] overflow-hidden rounded-4xl border border-white/80 bg-stone-100 shadow-[0_24px_80px_rgba(68,64,60,0.13)] ring-1 ring-stone-900/3 lg:min-h-full">
            {mapSrc ? (
              <iframe
                title={`${restaurant.name} Standortkarte`}
                className="h-full min-h-[420px] w-full"
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-3 p-6 text-center">
                <p className="text-sm text-stone-600">
                  Füge in den Einstellungen eine Adresse oder Google-Maps-URL hinzu, damit die Karte hier angezeigt wird.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function mapEmbedSrc(mapsUrl: string | null, address: string) {
  if (mapsUrl?.includes("google.com/maps/embed")) return mapsUrl;
  if (mapsUrl?.includes("mapbox.com") && mapsUrl.includes("html")) return mapsUrl;
  if (address) {
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  }
  return null;
}
