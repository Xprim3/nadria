import { BrandMark } from "@/components/public/BrandMark";
import {
  HeroImageCarousel,
  type HeroSlide,
} from "@/components/public/HeroImageCarousel";
import type { PublicSitePayload } from "@/lib/data/public-site";

function toHeroSlides(
  gallery: PublicSitePayload["gallery"],
): HeroSlide[] {
  return gallery
    .filter(
      (g): g is typeof g & { imageUrl: string } =>
        Boolean(g.imageUrl) && g.storage_path.startsWith("hero/"),
    )
    .map((g) => ({
      id: g.id,
      src: g.imageUrl,
      alt: (g.caption && g.caption.trim()) || "Restaurant",
    }));
}

export function HeroSection({
  restaurant,
  gallery,
}: {
  restaurant: PublicSitePayload["restaurant"];
  gallery: PublicSitePayload["gallery"];
}) {
  const heroSubtitle =
    restaurant.tagline?.trim() || "Authentische italienische Küche in Trier-Quint";

  return (
    <section
      id="hero"
      className="relative min-h-svh overflow-hidden"
      aria-labelledby="hero-welcome"
    >
      <HeroImageCarousel slides={toHeroSlides(gallery)} />
      {/* Must sit above images (z-0). Stronger top→bottom + bottom vignette. */}
      <div
        className="pointer-events-none absolute inset-0 z-1"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.14) 25%, rgba(0,0,0,0.3) 55%, rgba(9,9,11,0.52) 82%, rgba(0,0,0,0.66) 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-1 bg-linear-to-t from-black/42 via-black/6 to-transparent to-58%"
        aria-hidden
      />
      {/* Blur in lower area only; separate layer so it stacks above base scrim */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-2 h-[min(70vh,68%)] max-h-[900px] mask-[linear-gradient(to_top,black_0%,black_30%,rgba(0,0,0,0.5)_55%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_top,black_0%,black_30%,rgba(0,0,0,0.5)_55%,transparent_100%)]"
        aria-hidden
      >
        <div className="absolute inset-0 bg-linear-to-t from-stone-950/48 via-stone-950/14 to-transparent backdrop-blur-sm sm:backdrop-blur-md" />
      </div>

      <div className="relative z-10 flex min-h-svh flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-20 pt-[calc(var(--site-header-h,5.25rem)+1rem)] text-center sm:px-6 sm:pb-24 sm:pt-[calc(var(--site-header-h,5.25rem)+1.25rem)] md:pb-28 lg:pb-32">
          <div className="mb-5 flex w-full max-w-full justify-center sm:mb-6 md:mb-7 lg:mb-8">
            <BrandMark
              className="h-auto w-full max-w-[min(16rem,78vw)] object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.18)] min-[400px]:max-w-[min(18rem,76vw)] sm:max-w-88 md:max-w-md lg:max-w-lg xl:max-w-136"
              priority
            />
          </div>

          <div className="flex w-full max-w-[min(42rem,92vw)] flex-col items-center gap-2.5 min-[400px]:gap-3 sm:max-w-3xl sm:gap-4">
            <h1
              id="hero-welcome"
              className="text-balance font-hero-script text-[clamp(2.35rem,7vw+0.75rem,4.65rem)] leading-[1.06] text-white/95 drop-shadow-[0_3px_18px_rgba(0,0,0,0.35)] min-[400px]:leading-[1.08] sm:leading-[1.1]"
            >
              <span className="sr-only">{restaurant.name}. </span>
              <span>Willkommen</span>
            </h1>
            <p className="text-balance max-w-2xl px-0.5 font-serif text-[clamp(1.05rem,1.6vw+0.72rem,1.75rem)] leading-[1.48] text-stone-100/95 drop-shadow-[0_2px_14px_rgba(0,0,0,0.34)] min-[400px]:px-0 min-[400px]:tracking-wide sm:leading-normal sm:tracking-wide md:leading-[1.55] md:tracking-wider">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
