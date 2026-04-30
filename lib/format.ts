const eur = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "EUR",
});

export function formatPriceCents(cents: number) {
  return eur.format(cents / 100);
}

const weekdayShort = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

const weekdayLong = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

/** `day_of_week` in DB: 0 = Monday … 6 = Sunday */
export function weekdayLabel(
  day: number,
  form: "short" | "long" = "long",
) {
  const list = form === "short" ? weekdayShort : weekdayLong;
  return list[day] ?? "";
}

/**
 * Returns DB `day_of_week` (0 = Monday) for a Date in a given IANA time zone.
 */
export function getDbDayOfWeek(
  at: Date,
  timeZone: string,
): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  const w = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(at);
  // Map English weekday to Monday=0
  const map: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };
  return (map[w] ?? 0) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export function formatTimeHm(value: string | null | undefined) {
  if (!value) return null;
  const part = value.slice(0, 5);
  return part;
}

export function getTodayYmdInZone(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")?.value;
  const mo = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  if (y && mo && d) return `${y}-${mo}-${d}`;
  return new Date().toISOString().slice(0, 10);
}
