import Image from "next/image";
import {
  createNotice,
  deleteNotice,
  updateNotice,
} from "@/app/admin/actions";
import {
  AdminPageHeader,
  AdminPanel,
  EmptyState,
  Field,
  inputClass,
} from "@/components/admin/AdminUi";
import { NoticeRichTextEditor } from "@/components/admin/NoticeRichTextEditor";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { getNotices } from "@/lib/admin/data";

export const metadata = { title: "Notices" };
export const dynamic = "force-dynamic";

export default async function AdminNoticesPage() {
  const notices = await getNotices();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Updates"
        title="Notices"
        description="Show important messages on the public site, such as holiday closures or changed opening hours."
      />

      <AdminPanel title="Add notice">
        <form action={createNotice} className="grid gap-4 lg:grid-cols-4">
          <Field label="Title">
            <input className={inputClass} name="title" required placeholder="Holiday opening hours" />
          </Field>
          <Field label="Start date">
            <input className={inputClass} name="starts_on" type="date" />
          </Field>
          <Field label="End date">
            <input className={inputClass} name="ends_on" type="date" />
          </Field>
          <Field label="Image">
            <input className={inputClass} name="image" type="file" accept="image/*" />
          </Field>
          <div className="flex items-end gap-4">
            <label className="mb-2 flex items-center gap-2 text-sm text-stone-700">
              <input name="is_active" type="checkbox" defaultChecked />
              Active
            </label>
            <SubmitButton>Add</SubmitButton>
          </div>
          <div className="lg:col-span-4">
            <Field label="Message">
              <NoticeRichTextEditor name="body" />
            </Field>
          </div>
        </form>
      </AdminPanel>

      <AdminPanel title="Current notices">
        {notices.length === 0 ? (
          <EmptyState
            title="No notices yet"
            description="Use notices for temporary changes customers need to see quickly."
          />
        ) : (
          <div className="grid gap-4">
            {notices.map((notice) => (
              <form
                key={notice.id}
                action={updateNotice}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
              >
                <input type="hidden" name="id" value={notice.id} />
                <input type="hidden" name="current_image_path" value={notice.image_path ?? ""} />
                <input type="hidden" name="image_path" value={notice.image_path ?? ""} />
                <div className="grid gap-4 lg:grid-cols-4">
                  {notice.imageUrl ? (
                    <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-stone-200 lg:col-span-4">
                      <Image
                        src={notice.imageUrl}
                        alt={notice.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 900px"
                      />
                    </div>
                  ) : null}
                  <Field label="Title">
                    <input
                      className={inputClass}
                      name="title"
                      required
                      defaultValue={notice.title}
                    />
                  </Field>
                  <Field label="Start date">
                    <input
                      className={inputClass}
                      name="starts_on"
                      type="date"
                      defaultValue={notice.starts_on ?? ""}
                    />
                  </Field>
                  <Field label="End date">
                    <input
                      className={inputClass}
                      name="ends_on"
                      type="date"
                      defaultValue={notice.ends_on ?? ""}
                    />
                  </Field>
                  <Field label="Replace image">
                    <input className={inputClass} name="image" type="file" accept="image/*" />
                  </Field>
                  <div className="flex items-end gap-2">
                    <label className="mb-2 flex items-center gap-2 text-sm text-stone-700">
                      <input
                        name="is_active"
                        type="checkbox"
                        defaultChecked={notice.is_active}
                      />
                      Active
                    </label>
                    <SubmitButton variant="secondary">Save</SubmitButton>
                    <button
                      formAction={deleteNotice}
                      className="rounded-xl bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="lg:col-span-4">
                    <Field label="Message">
                      <NoticeRichTextEditor name="body" defaultValue={notice.body} />
                    </Field>
                  </div>
                </div>
              </form>
            ))}
          </div>
        )}
      </AdminPanel>
    </div>
  );
}
