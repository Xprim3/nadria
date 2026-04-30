import Link from "next/link";
import type { PublicSitePayload } from "@/lib/data/public-site";

const fallbackAddress = ["Koblenzer Str. 1F", "54293 Trier", "Deutschland"];
const fallbackPhone = "+49 651 966 45 88";
const fallbackEmail = "info@pizzeriaadria.de";

const footerNav = [
  { href: "#about", label: "Über uns" },
  { href: "#gallery", label: "Galerie" },
  { href: "#menu", label: "Menü" },
  { href: "#reservations", label: "Reservierung" },
  { href: "#contact", label: "Öffnungszeiten & Standort" },
] as const;

export function SiteFooter({
  restaurant,
  telHref,
  mailtoHref,
}: {
  restaurant: PublicSitePayload["restaurant"];
  telHref: string | null;
  mailtoHref: string | null;
}) {
  const addressParts = [
    restaurant.address_line,
    [restaurant.postal_code, restaurant.city].filter(Boolean).join(" "),
    restaurant.country,
  ].filter((x) => x && String(x).trim());
  const address =
    addressParts.length > 1 ? addressParts.join(", ") : fallbackAddress.join(", ");
  const phone = restaurant.phone?.trim() || fallbackPhone;
  const email = restaurant.email?.trim() || fallbackEmail;
  const brandName = restaurant.name?.trim() || "Pizzeria Adria";
  const brandTagline = restaurant.tagline?.trim() || "Pizzeria & Restaurant";
  const footerDescription =
    restaurant.story
      ?.split(/\n+/)
      .map((line) => line.trim())
      .find(Boolean) ||
    "Authentische italienische Küche, herzliche Gastfreundschaft und entspannte Abende in Trier-Quint.";
  const socialLinks = [
    restaurant.social_instagram
      ? { href: restaurant.social_instagram, label: "Instagram" }
      : null,
    restaurant.social_facebook
      ? { href: restaurant.social_facebook, label: "Facebook" }
      : null,
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  return (
    <footer className="relative overflow-hidden bg-stone-950 text-stone-100">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(245,158,11,0.16),transparent_32%),radial-gradient(circle_at_86%_78%,rgba(127,29,29,0.22),transparent_38%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr_0.8fr] lg:gap-12">
          <div>
            <Link
              href="#top"
              className="inline-block font-serif text-4xl font-medium leading-none tracking-tight text-white transition hover:text-amber-100"
            >
              {brandName}
            </Link>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.26em] text-amber-200">
              {brandTagline}
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-stone-300">
              {footerDescription}
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
              Entdecken
            </p>
            <ul className="mt-5 grid gap-3 text-sm text-stone-300">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
              Kontakt
            </p>
            <div className="mt-5 space-y-3 text-sm leading-relaxed text-stone-300">
              <p>{address}</p>
              <p>
                <a
                  href={telHref ?? "tel:+496519664588"}
                  className="underline-offset-4 transition hover:text-white hover:underline"
                >
                  {phone}
                </a>
              </p>
              <p>
                <a
                  href={mailtoHref ?? "mailto:info@pizzeriaadria.de"}
                  className="wrap-break-word underline-offset-4 transition hover:text-white hover:underline"
                >
                  {email}
                </a>
              </p>
            </div>

            {socialLinks.length > 0 ? (
              <div className="mt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
                  Folgen
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-stone-200 transition hover:border-amber-200/70 hover:bg-white/10 hover:text-white"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-6 text-sm text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} {brandName}. Alle Rechte vorbehalten.</p>
            <p className="text-xs text-stone-500">
              Entwickelt von{" "}
              <a
                href="https://www.denisjanuzi.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 transition hover:text-stone-200 hover:underline"
              >
                Denis Januzi
              </a>
            </p>
          </div>
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2"
            aria-label="Legal"
          >
            <Link className="transition hover:text-white" href="/imprint">
              Impressum
            </Link>
            <Link className="transition hover:text-white" href="/privacy">
              Datenschutz
            </Link>
            <Link className="transition hover:text-stone-200" href="/admin" prefetch={false}>
              Adminbereich
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
