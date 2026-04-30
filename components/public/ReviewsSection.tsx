import type { PublicSitePayload } from "@/lib/data/public-site";

const googleReviewUrl = "https://maps.app.goo.gl/UwQNgqgPpVPTQFv68";

function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-0.5 text-amber-500 ${className}`} aria-label="5-Sterne-Bewertung">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}

export function ReviewsSection({
  restaurant,
  reviews,
}: {
  restaurant: PublicSitePayload["restaurant"];
  reviews: PublicSitePayload["reviews"];
}) {
  const reviewLinks = [
    {
      label: "Google",
      href: googleReviewUrl,
    },
  ] as const;

  return (
    <section
      id="reviews"
      className="relative isolate scroll-mt-[max(0.75rem,calc(var(--site-header-h,5.25rem)+0.5rem))] overflow-hidden border-b border-amber-200/70 bg-[#fff8f3] py-20 text-stone-950 sm:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(185,28,28,0.11),transparent_32%),radial-gradient(circle_at_84%_64%,rgba(251,191,36,0.16),transparent_34%)]"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-800">
              Gästebewertungen
            </p>
            <h2 className="mt-4 max-w-xl font-serif text-[clamp(2.1rem,3.6vw+0.8rem,4.1rem)] font-medium leading-[1.01] tracking-tight">
              Was unsere Gäste über uns sagen
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
              Ehrliches italienisches Essen, herzliche Gastfreundschaft und entspannte Abende am Tisch.
            </p>
          </div>
          <div className="rounded-4xl border border-amber-200/80 bg-white/80 p-5 shadow-[0_18px_60px_rgba(68,64,60,0.12)] ring-1 ring-stone-900/3 backdrop-blur-md sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Stars className="text-xl" />
              <span className="rounded-full bg-red-800 px-4 py-2 text-sm font-semibold text-white">
                Von Gästen geschätzt
              </span>
            </div>
            <blockquote className="mt-6 font-serif text-2xl leading-relaxed text-stone-950 sm:text-3xl">
              &ldquo;Einfache, ehrliche italienische Küche mit einem Service, der jeden Besuch persönlich macht.&rdquo;
            </blockquote>
            <p className="mt-5 text-sm font-medium text-stone-600">Gast der Pizzeria Adria</p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <article
              key={`${r.name}-${r.quote}`}
              className="rounded-4xl border border-amber-200/80 bg-white/80 p-6 shadow-[0_18px_60px_rgba(68,64,60,0.12)] ring-1 ring-stone-900/3 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white sm:p-7"
            >
              <Stars />
              <blockquote className="mt-5 font-serif text-xl leading-relaxed text-stone-800">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <footer className="mt-7 border-t border-amber-200/80 pt-5">
                <p className="font-semibold text-stone-950">{r.name}</p>
                <p className="mt-1 text-sm text-stone-500">{r.detail}</p>
              </footer>
            </article>
          ))}
        </div>

        {reviews.length === 0 ? (
          <div className="mt-12 rounded-4xl border border-dashed border-amber-300/80 bg-white/70 p-8 text-center text-stone-600">
            Noch keine Bewertungen veröffentlicht. Füge im Adminbereich Bewertungen hinzu, um sie hier anzuzeigen.
          </div>
        ) : null}

        <div className="mt-12 overflow-hidden rounded-4xl border border-amber-300/35 bg-[linear-gradient(135deg,#fff7ed_0%,#fef3c7_48%,#fff_100%)] text-stone-950 shadow-[0_22px_70px_rgba(68,64,60,0.14)]">
          <div className="grid gap-0 lg:grid-cols-[1fr_23rem]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div
                className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-amber-300/30 blur-3xl"
                aria-hidden
              />
              <div className="relative">
                <div className="inline-flex items-center gap-3 rounded-full border border-amber-300/60 bg-white/75 px-4 py-2 text-sm font-semibold text-amber-900 shadow-sm">
                  <Stars />
                  <span>Google-Bewertung hinterlassen</span>
                </div>
                <h3 className="mt-5 max-w-2xl font-serif text-[clamp(1.9rem,2.6vw+0.85rem,3.4rem)] font-medium tracking-tight">
                  Hat es dir geschmeckt? Sag es dem nächsten Gast.
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-700 sm:text-lg">
                  Deine Google-Bewertung hilft mehr Menschen, {restaurant.name} zu finden, und unterstützt unser Familienrestaurant in Trier-Quint.
                </p>
                <p className="mt-5 text-sm font-medium text-stone-500">
                  Es dauert nur eine Minute und macht einen echten Unterschied.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4 border-t border-amber-200/80 bg-red-800 p-6 text-white sm:p-8 lg:border-l lg:border-t-0">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-100">
                  Danke
                </p>
                <p className="mt-2 text-sm leading-relaxed text-red-50/90">
                  Teile deine Erfahrung direkt auf Google Maps.
                </p>
              </div>
              {reviewLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-amber-100 px-6 py-4 text-base font-bold text-red-900 shadow-lg shadow-red-950/20 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100"
                >
                  Auf {link.label} bewerten
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
