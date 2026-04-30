const FALLBACK_SITE_URL = "https://pizzeriaadria.de";

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return FALLBACK_SITE_URL;
  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    return FALLBACK_SITE_URL;
  }
}
