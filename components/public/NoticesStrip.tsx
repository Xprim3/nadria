import Image from "next/image";
import type { NoticeRow } from "@/lib/data/public-site";

const richTextPattern =
  /(\[big\][\s\S]+?\[\/big\]|\[small\][\s\S]+?\[\/small\]|\*\*[\s\S]+?\*\*|\*[^*]+?\*)/g;

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${value}T00:00:00`));
}

function noticeDateLine(notice: NoticeRow) {
  const start = formatDate(notice.starts_on);
  const end = formatDate(notice.ends_on);

  if (start && end) return `${start} - ${end}`;
  if (start) return `Ab ${start}`;
  if (end) return `Bis ${end}`;
  return "Aktuell";
}

function renderNoticeText(value: string) {
  return value.split(richTextPattern).map((part, index) => {
    if (!part) return null;

    if (part.startsWith("[big]") && part.endsWith("[/big]")) {
      return (
        <span key={index} className="font-serif text-lg font-medium text-stone-900">
          {part.slice(5, -6)}
        </span>
      );
    }

    if (part.startsWith("[small]") && part.endsWith("[/small]")) {
      return (
        <span key={index} className="text-xs text-stone-500">
          {part.slice(7, -8)}
        </span>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

function NoticeBody({ value, featured = false }: { value: string; featured?: boolean }) {
  if (/<\/?[a-z][\s\S]*>/i.test(value)) {
    return (
      <div
        className={
          "mt-3 leading-relaxed [&_a]:font-semibold [&_a]:text-red-900 [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:border-amber-700 [&_blockquote]:pl-3 [&_h3]:font-serif [&_h3]:font-medium [&_h3]:text-stone-950 [&_li]:ml-4 [&_ol]:list-decimal [&_p]:my-2 [&_strong]:font-semibold [&_ul]:list-disc " +
          (featured
            ? "text-base text-stone-700 sm:text-lg [&_h3]:text-2xl"
            : "text-sm text-stone-600 [&_h3]:text-xl")
        }
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  }

  return (
    <p
      className={
        "mt-3 whitespace-pre-wrap leading-relaxed " +
        (featured ? "text-base text-stone-700 sm:text-lg" : "text-sm text-stone-600")
      }
    >
      {renderNoticeText(value)}
    </p>
  );
}

export function NoticesStrip({ notices }: { notices: NoticeRow[] }) {
  const visibleNotices =
    notices.length > 0
      ? notices.slice(0, 3)
      : [
          {
            id: "preview-notice",
            title: "Weekend special",
            body: "Frische Meeresfrüchte, hausgemachte Pasta und saisonale Desserts gibt es an diesem Wochenende.",
            starts_on: null,
            ends_on: null,
            is_active: true,
            image_path: null,
            imageUrl: null,
          } satisfies NoticeRow,
        ];
  const featuredNotice = visibleNotices[0];
  const secondaryNotices = visibleNotices.slice(1);

  return (
    <section className="relative isolate overflow-hidden border-b border-stone-900/20 bg-stone-950 py-10 text-white sm:py-12">
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_18%,rgba(245,158,11,0.18),transparent_30%),radial-gradient(circle_at_84%_74%,rgba(127,29,29,0.28),transparent_36%),linear-gradient(135deg,#1c1917_0%,#450a0a_52%,#0c0a09_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[42px_42px] opacity-40"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-4xl border border-amber-100/20 bg-black/24 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.28)] ring-1 ring-white/10 backdrop-blur-md">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-200/18 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-red-700/20 blur-3xl"
            aria-hidden
          />

          <div className="relative grid overflow-hidden rounded-[1.65rem] border border-amber-100/20 bg-stone-950/82 lg:grid-cols-[0.8fr_1.2fr]">
            <div
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-amber-200/70 to-transparent"
              aria-hidden
            />
            <div className="relative min-h-64 overflow-hidden p-6 sm:p-8 lg:min-h-full">
              <Image
                src={
                  featuredNotice.imageUrl ??
                  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80"
                }
                alt=""
                fill
                className="object-cover opacity-78"
                sizes="(min-width: 1024px) 32vw, 100vw"
              />
              <div className="absolute inset-0 bg-linear-to-br from-stone-950/45 via-stone-950/28 to-red-950/36" />
              <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-stone-950/92 via-stone-950/66 to-transparent" />
              <div className="relative flex h-full min-h-52 flex-col justify-end">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-200">
                  Restaurant-Hinweis
                </p>
                <p className="mt-4 max-w-xs font-serif text-3xl font-medium leading-tight text-white sm:text-4xl">
                  Ein kurzer Hinweis von unserem Team.
                </p>
              </div>
            </div>

            <div className="relative p-6 sm:p-8 lg:p-10">
              <article>
                <p className="inline-flex rounded-full border border-amber-100/25 bg-amber-100/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-amber-100">
                  {noticeDateLine(featuredNotice)}
                </p>
                <h3 className="mt-4 font-serif text-[clamp(2rem,3vw+0.75rem,3.7rem)] font-medium leading-[0.98] tracking-tight text-white">
                  {renderNoticeText(featuredNotice.title)}
                </h3>
                {featuredNotice.body ? (
                  <div className="max-w-2xl **:text-stone-100">
                    <NoticeBody value={featuredNotice.body} featured />
                  </div>
                ) : (
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-200 sm:text-lg">
                    Bitte frage unser Team nach weiteren Details.
                  </p>
                )}
              </article>

              {secondaryNotices.length > 0 ? (
                <div className="relative mt-6 grid gap-3 border-t border-white/10 pt-5 md:grid-cols-2">
                  {secondaryNotices.map((notice) => (
                    <article
                      key={notice.id}
                      className="rounded-3xl border border-white/10 bg-white/6 p-4"
                    >
                    {notice.imageUrl ? (
                      <div className="relative mb-4 aspect-5/3 overflow-hidden rounded-2xl bg-stone-900">
                        <Image
                          src={notice.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 22vw, 100vw"
                        />
                      </div>
                    ) : null}
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-amber-200">
                        {noticeDateLine(notice)}
                      </p>
                      <h4 className="mt-2 font-serif text-xl font-medium leading-tight text-white">
                        {renderNoticeText(notice.title)}
                      </h4>
                      {notice.body ? (
                        <div className="**:text-stone-200">
                          <NoticeBody value={notice.body} />
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
