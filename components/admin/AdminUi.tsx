export function AdminPageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 border-b border-zinc-200/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800 ring-1 ring-emerald-500/20">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-zinc-500 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {children ? <div className="shrink-0 sm:pb-0.5">{children}</div> : null}
    </div>
  );
}

export function AdminPanel({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm shadow-zinc-900/5 ring-1 ring-zinc-950/5 sm:p-6">
      {title || description ? (
        <div className="mb-6">
          {title ? (
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-1.5 text-sm text-zinc-500">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block text-sm font-medium text-zinc-800">
      <span>{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint ? <span className="mt-1.5 block text-xs text-zinc-500">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20";

export const textareaClass =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20";

export const selectClass =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-emerald-500/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300/90 bg-zinc-50/80 p-8 text-center">
      <p className="font-medium text-zinc-900">{title}</p>
      <p className="mt-1.5 text-sm text-zinc-500">{description}</p>
    </div>
  );
}
