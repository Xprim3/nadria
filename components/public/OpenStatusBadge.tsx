import type { OpenStatusResult } from "@/lib/open-status";

function label(state: OpenStatusResult) {
  if (state.state === "open")
    return `Heute geöffnet · ${state.open} – ${state.close}`;
  if (state.state === "closed") return "Derzeit geschlossen";
  return "Öffnungszeiten unten ansehen";
}

const tone: Record<OpenStatusResult["state"], string> = {
  open: "bg-emerald-100 text-emerald-900 ring-emerald-200/80",
  closed: "bg-stone-200 text-stone-800 ring-stone-300/60",
  unknown: "bg-amber-100 text-amber-950 ring-amber-200/80",
};

const toneOnDark: Record<OpenStatusResult["state"], string> = {
  open: "bg-white/10 text-white ring-white/20",
  closed: "bg-stone-900/40 text-stone-200 ring-white/15",
  unknown: "bg-amber-400/15 text-amber-50 ring-amber-200/30",
};

export function OpenStatusBadge({
  status,
  onDark = false,
}: {
  status: OpenStatusResult;
  onDark?: boolean;
}) {
  const t = onDark ? toneOnDark[status.state] : tone[status.state];
  return (
    <p
      className={`inline-flex max-w-lg items-center rounded-full px-4 py-2 text-sm font-medium ring-1 ${t}`}
    >
      {label(status)}
    </p>
  );
}
