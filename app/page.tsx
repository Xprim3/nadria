import { BackToTopButton } from "@/components/public/BackToTopButton";
import { ContactSection } from "@/components/public/ContactSection";
import { FeaturedSection } from "@/components/public/FeaturedSection";
import { GallerySection } from "@/components/public/GallerySection";
import { HeroSection } from "@/components/public/HeroSection";
import { MenuSection } from "@/components/public/MenuSection";
import { MobileCtaBar } from "@/components/public/MobileCtaBar";
import { NoticesStrip } from "@/components/public/NoticesStrip";
import { PublicSetupFallback } from "@/components/public/PublicSetupFallback";
import { ReservationDeliverySection } from "@/components/public/ReservationDeliverySection";
import { ReviewsSection } from "@/components/public/ReviewsSection";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { StorySection } from "@/components/public/StorySection";
import { loadPublicSiteData } from "@/lib/data/public-site";
import { loadPublicSeo } from "@/lib/data/public-seo";
import { getSiteUrl } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await loadPublicSeo();
  const siteUrl = getSiteUrl();
  const name = seo?.name ?? "Restaurant";
  const description =
    seo?.tagline ?? "Speisekarte, Öffnungszeiten und Kontakt — lokal und frisch.";
  return {
    title: name,
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      url: siteUrl,
      title: name,
      description,
      locale: "de_DE",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: ["/twitter-image"],
    },
  };
}

export default async function Home() {
  const data = await loadPublicSiteData();

  if (!data) {
    return <PublicSetupFallback />;
  }

  const { restaurant } = data;

  return (
    <div className="flex min-h-svh flex-col pb-20 sm:pb-0" id="top">
      <SiteHeader restaurantName={restaurant.name} />
      <div className="relative">
        <HeroSection restaurant={restaurant} gallery={data.gallery} />
      </div>
      {restaurant.show_notices ? <NoticesStrip notices={data.notices} /> : null}
      <main className="flex-1">
        <StorySection restaurant={restaurant} />
        <GallerySection items={data.gallery} />
        <FeaturedSection items={data.featuredItems} />
        <MenuSection restaurant={restaurant} />
        <ReservationDeliverySection
          telHref={data.telHref}
          mailtoHref={data.mailtoHref}
        />
        <ReviewsSection restaurant={restaurant} reviews={data.reviews} />
        <ContactSection
          restaurant={restaurant}
          hoursByDay={data.hoursByDay}
          telHref={data.telHref}
          mailtoHref={data.mailtoHref}
        />
      </main>
      <SiteFooter
        restaurant={restaurant}
        telHref={data.telHref}
        mailtoHref={data.mailtoHref}
      />
      <MobileCtaBar telHref={data.telHref} directionsUrl={data.directionsUrl} />
      <BackToTopButton />
    </div>
  );
}
