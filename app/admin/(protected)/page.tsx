import Link from "next/link";
import { AdminPageHeader, AdminPanel } from "@/components/admin/AdminUi";
import { IconChevronRight, IconExternal } from "@/components/admin/icons";
import { getDashboardData } from "@/lib/admin/data";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const { restaurant, user, stats } = await getDashboardData();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        eyebrow="Overview"
        title={restaurant.name}
        description={`You are signed in as ${user.email}. Edits go live on the public site right after you save.`}
      >
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
        >
          <span>View public site</span>
          <IconExternal className="h-4 w-4 text-zinc-500" />
        </Link>
      </AdminPageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Menu PDFs"
          value={2}
          sub="Dine-in and delivery"
          tone="emerald"
        />
        <StatCard
          label="Active notices"
          value={stats.activeNotices}
          sub="Shown on the homepage"
          tone="amber"
        />
        <StatCard
          label="Gallery"
          value={stats.galleryImages}
          sub="Homepage gallery"
          tone="sky"
        />
        <StatCard
          label="Reviews"
          value={stats.reviews}
          sub="Shown on homepage"
          tone="violet"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Shortcuts
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <QuickLink
              href="/admin/menu"
              title="Menu PDFs"
              description="Replace dine-in and delivery menus"
            />
            <QuickLink
              href="/admin/hours"
              title="Hours"
              description={
                stats.missingHours
                  ? `${stats.missingHours} days not set yet`
                  : "Week complete"
              }
            />
            <QuickLink
              href="/admin/notices"
              title="Notices"
              description="Closures and temporary changes"
            />
            <QuickLink
              href="/admin/reviews"
              title="Reviews"
              description="Add and manage client feedback"
            />
            <QuickLink
              href="/admin/settings"
              title="Reservation & delivery"
              description="Phone, email, address, map, socials"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Checklist
          </h2>
          <AdminPanel
            title="Launch quality"
            description="Tick these off for a client-ready public site."
          >
            <ul className="space-y-3 text-sm text-zinc-600">
              <CheckItem done>
                Upload your dine-in and delivery menu PDFs
              </CheckItem>
              <CheckItem done={stats.missingHours === 0}>
                Fill in every day’s hours
              </CheckItem>
              <CheckItem done={Boolean(restaurant.phone && restaurant.address_line)}>
                Add phone and address in settings
              </CheckItem>
            </ul>
          </AdminPanel>
        </div>
      </div>

      <AdminPanel
        title="How publishing works"
        description="The site reads from your Supabase project. You stay in control; no code deploys needed for content."
      >
        <p className="text-sm leading-6 text-zinc-600">
          Saved changes appear on the public restaurant website after a short refresh.
          Use the gallery, notices, opening hours, and PDF menus to keep the
          public site current before you share a link.
        </p>
      </AdminPanel>
    </div>
  );
}

const toneBorder: Record<"emerald" | "violet" | "amber" | "sky", string> = {
  emerald: "border-l-4 border-l-emerald-500",
  violet: "border-l-4 border-l-violet-500",
  amber: "border-l-4 border-l-amber-500",
  sky: "border-l-4 border-l-sky-500",
};

function StatCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: number;
  sub: string;
  tone: keyof typeof toneBorder;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm ring-1 ring-zinc-950/5 ${toneBorder[tone]}`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-zinc-900">
        {value}
      </p>
      <p className="mt-1 text-sm text-zinc-500">{sub}</p>
    </div>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm ring-1 ring-zinc-950/5 transition hover:-translate-y-0.5 hover:border-zinc-300/90 hover:shadow-md"
    >
      <div>
        <p className="font-semibold text-zinc-900">{title}</p>
        <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
      </div>
      <IconChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" />
    </Link>
  );
}

function CheckItem({
  done,
  children,
}: {
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={
          done
            ? "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800"
            : "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-400"
        }
        aria-hidden
      >
        {done ? "OK" : ""}
      </span>
      <span className={done ? "text-zinc-700" : "text-zinc-500"}>{children}</span>
    </li>
  );
}
