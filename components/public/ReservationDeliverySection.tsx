import type { ComponentType, SVGProps } from "react";

const lieferandoUrl =
  "https://www.lieferando.de/en/menu/ristorante-pizzeria-adria-trier";
const fallbackTelHref = "tel:+496519664588";
const fallbackMailtoHref = "mailto:info@pizzeriaadria.de";

function displayPhoneFromTel(tel: string) {
  const raw = tel
    .replace(/^tel:\s*/i, "")
    .replace(/[^\d+]/g, "");
  const local = raw.startsWith("+49") ? `0${raw.slice(3)}` : raw;

  if (local === "06519664588") {
    return "0651 966 45 88";
  }

  return local.replace(/(.{4})(?=.)/g, "$1 ").trim();
}

function displayEmailFromMailto(mailto: string) {
  return decodeURIComponent(
    mailto
      .replace(/^mailto:\s*/i, "")
      .split("?")[0]
      ?.trim() || "info@pizzeriaadria.de",
  );
}

function IconTable(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M6 10l-1.5 9M18 10l1.5 9M8 10V6.5A2.5 2.5 0 0 1 10.5 4h3A2.5 2.5 0 0 1 16 6.5V10M9 19h6" />
    </svg>
  );
}

function IconDelivery(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v9H3V7ZM14 10h3.2l2.8 3.2V16h-6v-6ZM6.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </svg>
  );
}

function IconBadge({
  label,
  Icon,
  dark = false,
}: {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  dark?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-sm ${
          dark ? "bg-amber-100 text-red-900" : "bg-stone-950 text-amber-100"
        }`}
        aria-hidden
      >
        <Icon className="h-7 w-7" />
      </div>
      <p
        className={`text-xs font-semibold uppercase tracking-[0.28em] ${
          dark ? "text-amber-100" : "text-stone-950"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

export function ReservationDeliverySection({
  telHref,
  mailtoHref,
}: {
  telHref: string | null;
  mailtoHref: string | null;
}) {
  const phoneLink = telHref ?? fallbackTelHref;
  const emailLink = mailtoHref ?? fallbackMailtoHref;
  const phoneText = displayPhoneFromTel(phoneLink);
  const emailText = displayEmailFromMailto(emailLink);

  return (
    <section
      id="reservations"
      className="relative isolate scroll-mt-[max(0.75rem,calc(var(--site-header-h,5.25rem)+0.5rem))] overflow-hidden border-b border-stone-200/80 bg-[#fff8f3] py-18 text-stone-950 sm:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_20%,rgba(217,119,6,0.1),transparent_30%),radial-gradient(circle_at_86%_74%,rgba(127,29,29,0.08),transparent_34%)]"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-800">
            Reservierung & Lieferung
          </p>
          <h2 className="font-serif text-[clamp(2.15rem,4vw+0.75rem,3.8rem)] font-medium leading-[1.04] tracking-tight text-stone-950">
            Einfach planen, entspannt genießen.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-stone-600 sm:text-lg">
            Ob du einen Tisch reservieren, eine Bestellung abholen oder zur Lieferung fragen möchtest – hier findest du alle wichtigen Informationen auf einen Blick.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <article className="relative overflow-hidden rounded-4xl border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(68,64,60,0.11)] ring-1 ring-stone-900/3 backdrop-blur-sm sm:p-8 lg:p-10">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-200/40 blur-3xl"
              aria-hidden
            />
            <div className="relative">
              <IconBadge label="Reservierung" Icon={IconTable} />
              <h3 className="mt-4 font-serif text-4xl font-medium leading-tight text-stone-950 sm:text-5xl">
                Tisch reservieren
              </h3>
              <p className="mt-5 text-base leading-relaxed text-stone-600 sm:text-lg">
                Für Reservierungen erreichst du uns am einfachsten telefonisch. Du kannst uns auch per E-Mail schreiben – besonders bei größeren Gruppen oder besonderen Anlässen.
              </p>

              <div className="mt-7 rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-200/70">
                <dl className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
                      Telefon
                    </dt>
                    <dd className="mt-2">
                      <a
                        href={phoneLink}
                        className="font-serif text-3xl font-medium leading-none text-red-900 underline-offset-4 transition hover:text-red-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800/40"
                      >
                        {phoneText}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
                      E-Mail
                    </dt>
                    <dd className="mt-2">
                      <a
                        href={emailLink}
                        className="wrap-break-word text-base font-semibold text-red-900 underline-offset-4 transition hover:text-red-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-800/40"
                      >
                        {emailText}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-7 grid gap-4 rounded-3xl border border-stone-200/80 bg-stone-50 p-5 sm:p-6">
                <p className="font-serif text-2xl font-medium">Bitte angeben</p>
                <ul className="grid gap-3 text-sm leading-relaxed text-stone-700">
                  {[
                    "Gewünschtes Datum und Uhrzeit",
                    "Anzahl der Gäste",
                    "Name und Telefonnummer zur Bestätigung",
                    "Sonderwünsche, Kindersitz oder größere Gruppe",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 rounded-3xl bg-white p-5 ring-1 ring-stone-200/80">
                <p className="font-serif text-2xl font-medium">Gut zu wissen</p>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  Für Wochenenden und Gruppen empfehlen wir eine frühzeitige Reservierung. Für Anfragen am selben Tag ist ein Anruf am zuverlässigsten.
                </p>
              </div>

            </div>
          </article>

          <article className="relative overflow-hidden rounded-4xl border border-red-900/20 bg-red-950 p-6 text-white shadow-[0_24px_80px_rgba(127,29,29,0.2)] ring-1 ring-red-900/20 sm:p-8 lg:p-10">
            <div
              className="pointer-events-none absolute -right-20 top-10 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-0 left-0 h-28 w-full bg-linear-to-t from-red-800/30 to-transparent"
              aria-hidden
            />
            <div className="relative">
              <IconBadge label="Lieferung" Icon={IconDelivery} dark />
              <h3 className="mt-4 font-serif text-4xl font-medium leading-tight sm:text-5xl">
                Bestellen & abholen
              </h3>
              <p className="mt-5 text-base leading-relaxed text-red-50/90 sm:text-lg">
                Für Abholbestellungen oder Fragen zur Lieferung ruf uns bitte direkt an. So können wir Verfügbarkeit, Liefergebiet und ungefähre Zeit am schnellsten bestätigen.
              </p>

              <div className="mt-7 rounded-3xl border border-white/10 bg-white/8 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
                  Telefonisch bestellen
                </p>
                <a
                  href={phoneLink}
                  className="mt-2 inline-block font-serif text-3xl font-medium leading-none text-white underline-offset-4 transition hover:text-amber-100 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-100/70"
                >
                  {phoneText}
                </a>
              </div>

              <div className="mt-7 rounded-3xl border border-white/10 bg-white/8 p-5">
                <p className="font-serif text-2xl font-medium text-white">Wichtige Informationen</p>
                <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-red-50/85">
                  {[
                    "Abholung ist direkt im Restaurant möglich.",
                    "Lieferung hängt von Adresse, Entfernung und aktueller Auslastung ab.",
                    "Bitte teile uns Bestellung, Adresse und Rückrufnummer mit.",
                    "Zahlungsarten und Lieferzeit werden telefonisch bestätigt.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 rounded-3xl border border-amber-200/80 bg-white p-5 text-stone-950 shadow-xl shadow-red-950/10">
                <p className="font-serif text-2xl font-medium">Online bestellen</p>
                <p className="mt-3 text-sm leading-relaxed text-red-950/75">
                  Für eine bequeme Online-Bestellung kannst du auch unseren Partner{" "}
                  <a
                    href={lieferandoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-red-900 underline underline-offset-4 transition hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-900"
                  >
                    Lieferando
                  </a>
                  .
                </p>
              </div>

            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
