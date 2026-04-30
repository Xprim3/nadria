import { updateMenuPdf } from "@/app/admin/actions";
import {
  AdminPageHeader,
  AdminPanel,
  Field,
  inputClass,
} from "@/components/admin/AdminUi";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { getMenuPdfUrl } from "@/lib/supabase/public-urls";

export const metadata = { title: "Menu PDFs" };
export const dynamic = "force-dynamic";

export default function AdminMenuPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Menu"
        title="Menu PDFs"
        description="Upload the PDF files visitors open from the public menu section. No dish categories or item editing needed."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <MenuPdfPanel
          kind="dineIn"
          title="Dine-in menu"
          description="This PDF is opened by the Restaurant menu card on the homepage."
          href={getMenuPdfUrl("dineIn")}
        />
        <MenuPdfPanel
          kind="delivery"
          title="Delivery menu"
          description="This PDF is opened by the Takeaway & delivery menu card on the homepage."
          href={getMenuPdfUrl("delivery")}
        />
      </div>
    </div>
  );
}

function MenuPdfPanel({
  kind,
  title,
  description,
  href,
}: {
  kind: "dineIn" | "delivery";
  title: string;
  description: string;
  href: string;
}) {
  return (
    <AdminPanel title={title} description={description}>
      <form action={updateMenuPdf} className="space-y-4">
        <input type="hidden" name="menu_kind" value={kind} />
        <Field label="PDF file" hint="Upload a PDF. Re-uploading replaces the current file.">
          <input className={inputClass} name="pdf" type="file" accept="application/pdf,.pdf" required />
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton>Upload PDF</SubmitButton>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center rounded-xl border border-stone-200 bg-white px-4 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
          >
            Open current PDF
          </a>
        </div>
      </form>
    </AdminPanel>
  );
}
