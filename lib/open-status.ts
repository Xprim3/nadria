import { formatTimeHm, getDbDayOfWeek } from "./format";

const TZ = "Europe/Berlin";

type HoursRow = {
  day_of_week: number;
  is_closed: boolean;
  open_time: string | null;
  close_time: string | null;
  second_open_time: string | null;
  second_close_time: string | null;
};

export type OpenStatusResult =
  | { state: "closed" }
  | { state: "open"; open: string; close: string }
  | { state: "unknown" };

function intervalContainsNow(
  now: number,
  openTime: string | null,
  closeTime: string | null,
) {
  const o = formatTimeHm(openTime);
  const c = formatTimeHm(closeTime);
  if (!o || !c) return null;

  const [oh, om] = o.split(":").map((x) => Number(x));
  const [ch, cm] = c.split(":").map((x) => Number(x));
  if ([oh, om, ch, cm].some((n) => Number.isNaN(n))) return null;

  const start = oh * 60 + om;
  const end = ch * 60 + cm;
  const open =
    end <= start ? now >= start || now < end : now >= start && now < end;

  return { open, openTime: o, closeTime: c };
}

export function getOpenStatus(
  at: Date,
  hours: HoursRow[] | null | undefined,
): OpenStatusResult {
  if (!hours?.length) return { state: "unknown" };
  const day = getDbDayOfWeek(at, TZ);
  const row = hours.find((h) => h.day_of_week === day);
  if (!row) {
    return hours.length > 0 ? { state: "closed" } : { state: "unknown" };
  }
  if (row.is_closed) return { state: "closed" };

  const timeStr = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(at);
  const [hn, mn] = timeStr.split(":").map((x) => Number(x));
  if (Number.isNaN(hn) || Number.isNaN(mn)) return { state: "unknown" };
  const now = hn * 60 + mn;

  const intervals = [
    intervalContainsNow(now, row.open_time, row.close_time),
    intervalContainsNow(now, row.second_open_time, row.second_close_time),
  ].filter((interval): interval is NonNullable<typeof interval> =>
    Boolean(interval),
  );

  if (intervals.length === 0) return { state: "closed" };

  const activeInterval = intervals.find((interval) => interval.open);
  if (activeInterval) {
    return {
      state: "open",
      open: activeInterval.openTime,
      close: activeInterval.closeTime,
    };
  }

  return { state: "closed" };
}

export { TZ as restaurantTimeZone };
