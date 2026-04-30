import { AboutAmbientSlider } from "@/components/public/AboutAmbientSlider";
import type { PublicSitePayload } from "@/lib/data/public-site";

const STORY_HIGHLIGHTS = [
  {
    title: "Authentische Rezepte",
    line: "Traditionelle italienische Aromen, mit Sorgfalt und hochwertigen Zutaten zubereitet.",
  },
  {
    title: "Familiäre Atmosphäre",
    line: "Ein herzlicher Ort, an dem sich Gäste wie ein Teil der Familie fühlen.",
  },
  {
    title: "Trier-Quint seit 2008",
    line: "Ein Treffpunkt im Viertel für Pizza, Pasta und gemeinsame Momente.",
  },
] as const;

export function StorySection({
  restaurant,
}: {
  restaurant: PublicSitePayload["restaurant"];
}) {
  const storyParagraphs =
    restaurant.story
      ?.split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean) ?? [];
  const hasStory = storyParagraphs.length > 0;

  return (
    <section
      id="about"
      className="relative isolate scroll-mt-[max(0.75rem,calc(var(--site-header-h,5.25rem)+0.5rem))] overflow-hidden border-t border-stone-200/80 bg-[#fff8f3] py-18 sm:py-24 lg:py-28"
      aria-labelledby="about-title"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_14%,rgba(146,64,14,0.11),transparent_30%),linear-gradient(to_bottom,rgba(245,236,231,0.58),transparent_52%)]"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="min-w-0 lg:col-span-6">
            <AboutAmbientSlider
              mainImageUrl={restaurant.aboutImageUrl}
              detailImageUrl={restaurant.aboutDetailImageUrl}
            />
          </div>

          <div className="min-w-0 lg:col-span-6">
            <p className="text-xs font-semibold tracking-[0.26em] text-amber-900/75 uppercase">
              Unsere Geschichte
            </p>
            <h2
              id="about-title"
              className="mt-4 max-w-2xl font-serif text-[clamp(2.2rem,4vw+0.9rem,4rem)] font-medium leading-[1.03] tracking-tight text-stone-950"
            >
              Ein herzlicher Ort für italienisches Essen, gemeinsame Momente und ehrliche Gastfreundschaft.
            </h2>
            {hasStory ? (
              storyParagraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={`${index === 0 ? "mt-6" : "mt-4"} max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg`}
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
                  Von Anfang an war die Vision einfach: authentische italienische Aromen,
                  traditionelle Rezepte und eine einladende Atmosphäre nach Trier-Quint bringen.
                </p>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
                  Heute ist die Pizzeria Adria weiterhin ein familiengeführtes Restaurant, in dem jedes Gericht
                  Sorgfalt, Handwerk und das Gefühl von Zuhause trägt.
                </p>
              </>
            )}

            <div className="mt-9 space-y-5 border-l border-amber-900/20 pl-6">
              {STORY_HIGHLIGHTS.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-800/75"
                    aria-hidden
                  />
                  <div>
                    <h3 className="font-serif text-lg font-medium text-stone-950">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-stone-600 sm:text-base">
                      {item.line}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex items-center justify-between gap-6">
              <p className="font-hero-script text-3xl leading-none text-amber-950 sm:text-4xl">
                — Bashkim Aliu
              </p>
              <div
                className="hidden h-px flex-1 bg-linear-to-r from-amber-900/30 to-transparent sm:block"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
