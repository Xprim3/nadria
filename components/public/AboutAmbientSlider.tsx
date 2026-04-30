import Image from "next/image";

const DINING_ROOM_IMAGE =
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80";
const TRADITION_IMAGE =
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1000&q=80";

export function AboutAmbientSlider({
  mainImageUrl,
  detailImageUrl,
}: {
  mainImageUrl?: string | null;
  detailImageUrl?: string | null;
}) {
  const mainImage = mainImageUrl ?? DINING_ROOM_IMAGE;
  const detailImage = detailImageUrl ?? TRADITION_IMAGE;

  return (
    <div className="relative min-h-112 w-full sm:min-h-136 lg:min-h-152">
      <figure
        className="absolute right-0 top-0 h-[78%] w-[86%] overflow-hidden rounded-3xl border border-white/60 bg-stone-200 shadow-[0_24px_80px_rgba(68,64,60,0.22)] ring-1 ring-stone-900/5"
        aria-label="Warmer Gastraum"
      >
        <Image
          src={mainImage}
          alt="Gemütlicher Esstisch im Familienstil"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 42vw, 90vw"
          priority
          loading="eager"
          fetchPriority="high"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-stone-950/18 via-transparent to-amber-50/5"
          aria-hidden
        />
      </figure>

      <div className="absolute bottom-0 left-0 z-10 w-[58%] -rotate-3 bg-stone-50 p-2 shadow-[0_22px_60px_rgba(68,64,60,0.26)] transition-transform duration-700 hover:rotate-0 sm:w-[52%]">
        <figure
          className="relative aspect-4/3 overflow-hidden bg-stone-200"
          aria-label="Traditionelles Küchendetail"
        >
          <Image
            src={detailImage}
            alt="Traditionelle Küchenzubereitung"
            fill
            className="object-cover grayscale sepia-[0.28] contrast-125"
            sizes="(min-width: 1024px) 24vw, 55vw"
          />
        </figure>
      </div>

      <div
        className="absolute bottom-8 right-5 hidden rounded-full border border-amber-900/15 bg-amber-50/90 px-5 py-3 font-serif text-sm text-amber-950 shadow-lg backdrop-blur-sm sm:block"
        aria-hidden
      >
        Seit 2008
      </div>
    </div>
  );
}
