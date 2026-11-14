import { deletePromoPoster, updatePromoPoster } from "@/app/admin/actions";
import { AddPromoPosterForm } from "./AddPromoPosterForm";
import Image from "@/components/AppImage";
import {
  AdminPageHeader,
  AdminPanel,
  EmptyState,
  Field,
  inputClass,
} from "@/components/admin/AdminUi";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { getPromoPosters } from "@/lib/admin/data";

export const metadata = { title: "Promo modal" };
export const dynamic = "force-dynamic";

export default async function AdminPromoPage() {
  const posters = await getPromoPosters();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Marketing"
        title="Promo modal"
        description="Upload posters for the homepage popup. Several can be active at once. Visitors see every active poster, newest first, and can swipe when there are two or more. Closing the popup hides it for 2 hours, until the set of active posters changes."
      />

      <AdminPanel
        title="Add posters"
        description="Saving adds one poster per image, with the same link and active setting. It does not replace or deactivate the others."
      >
        <AddPromoPosterForm />
      </AdminPanel>

      <AdminPanel
        title="Saved posters"
        description="Newest first. Each poster has its own active switch."
      >
        {posters.length === 0 ? (
          <EmptyState
            title="No posters yet"
            description="Add a poster to show it in the homepage popup."
          />
        ) : (
          <div className="grid gap-4">
            {posters.map((poster) => (
              <form
                key={poster.id}
                action={updatePromoPoster}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
              >
                <input type="hidden" name="id" value={poster.id} />
                <div className="grid gap-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
                  <div className="flex h-36 items-center justify-center overflow-hidden rounded-xl bg-zinc-200">
                    {poster.imageUrl ? (
                      <Image
                        src={poster.imageUrl}
                        alt="Promo poster"
                        width={144}
                        height={144}
                        className="h-auto max-h-36 w-auto max-w-full object-contain"
                      />
                    ) : (
                      <p className="px-2 text-center text-xs text-zinc-500">
                        Image unavailable
                      </p>
                    )}
                  </div>
                  <div className="space-y-4">
                    <Field label="Link URL">
                      <input
                        className={inputClass}
                        name="link_url"
                        type="url"
                        placeholder="https://…"
                        defaultValue={poster.link_url ?? ""}
                      />
                    </Field>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-zinc-700">
                        <input
                          name="is_active"
                          type="checkbox"
                          defaultChecked={poster.is_active}
                        />
                        Active
                      </label>
                      <SubmitButton variant="secondary">Save</SubmitButton>
                      <button
                        formAction={deletePromoPoster}
                        className="rounded-xl bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
                      >
                        Delete
                      </button>
                    </div>
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
