/**
 * Split a restaurant name into a lead word and subtitle line (header / hero).
 */
export function splitBrandName(name: string, tagline: string | null) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return { lead: words[0]!, sub: words.slice(1).join(" ") };
  }
  return { lead: name.trim(), sub: tagline?.trim() || "Pizzeria & Restaurant" };
}

/** Shown in the site header next to the logo: “Adria” + type line. */
export const HEADER_TYPELINE = "Pizzeria & Restaurant";

/** Fixed public header lines (matches brand mark). */
export function getHeaderBrand() {
  return {
    lead: "Adria" as const,
    sub: HEADER_TYPELINE,
  };
}
