import { loadRestaurantLegal } from "@/lib/data/public-site";
import { loadPublicSeo } from "@/lib/data/public-seo";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await loadPublicSeo();
  return {
    title: "Impressum",
    description: `Impressum — ${seo?.name ?? "Restaurant"}`,
  };
}

const PLACEHOLDER =
  "Rechtliche Informationen zum Betreiber dieser Website (Unternehmensdaten, Registrierung, Kontakt für offizielle Mitteilungen). Hinterlege den vollständigen Impressumstext im Adminbereich (Restaurant-Einstellungen).";

export default async function ImprintPage() {
  const legal = await loadRestaurantLegal();
  const name = legal?.name ?? "Restaurant";
  const body = legal?.impressum_content?.trim() || PLACEHOLDER;

  return (
    <div className="min-h-svh bg-[#faf7f2]">
      <div className="border-b border-stone-200/80 bg-white/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="text-sm font-medium text-amber-900 hover:underline"
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-serif text-4xl text-stone-900">Impressum</h1>
        <p className="mt-1 text-stone-500">{name}</p>
        <div className="mt-8">
          <p className="whitespace-pre-wrap text-base leading-relaxed text-stone-700">
            {body}
          </p>
        </div>
      </article>
    </div>
  );
}
