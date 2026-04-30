import {
  createReview,
  deleteReview,
  updateReview,
} from "@/app/admin/actions";
import {
  AdminPageHeader,
  AdminPanel,
  EmptyState,
  Field,
  inputClass,
  textareaClass,
} from "@/components/admin/AdminUi";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { getReviews } from "@/lib/admin/data";

export const metadata = { title: "Reviews" };
export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Guest feedback"
        title="Reviews"
        description="Add, edit, sort, and hide client reviews shown on the homepage."
      />

      <AdminPanel title="Add review">
        <form action={createReview} className="grid gap-4 lg:grid-cols-4">
          <div className="lg:col-span-4">
            <Field label="Review text">
              <textarea
                className={textareaClass}
                name="quote"
                rows={4}
                required
                placeholder="The pizza was excellent and service was warm..."
              />
            </Field>
          </div>
          <Field label="Guest name">
            <input className={inputClass} name="name" required placeholder="Michael S." />
          </Field>
          <Field label="Detail">
            <input className={inputClass} name="detail" placeholder="Dinner guest" />
          </Field>
          <Field label="Order">
            <input className={inputClass} name="sort_order" type="number" defaultValue={reviews.length + 1} />
          </Field>
          <div className="flex items-end gap-4">
            <label className="mb-2 flex items-center gap-2 text-sm text-stone-700">
              <input name="is_active" type="checkbox" defaultChecked />
              Active
            </label>
            <SubmitButton>Add</SubmitButton>
          </div>
        </form>
      </AdminPanel>

      <AdminPanel title="Current reviews">
        {reviews.length === 0 ? (
          <EmptyState
            title="No reviews yet"
            description="Add your first guest review to show social proof on the homepage."
          />
        ) : (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <form
                key={review.id}
                action={updateReview}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
              >
                <input type="hidden" name="id" value={review.id} />
                <div className="grid gap-4 lg:grid-cols-4">
                  <div className="lg:col-span-4">
                    <Field label="Review text">
                      <textarea
                        className={textareaClass}
                        name="quote"
                        rows={4}
                        required
                        defaultValue={review.quote}
                      />
                    </Field>
                  </div>
                  <Field label="Guest name">
                    <input className={inputClass} name="name" required defaultValue={review.name} />
                  </Field>
                  <Field label="Detail">
                    <input className={inputClass} name="detail" defaultValue={review.detail ?? ""} />
                  </Field>
                  <Field label="Order">
                    <input
                      className={inputClass}
                      name="sort_order"
                      type="number"
                      defaultValue={review.sort_order}
                    />
                  </Field>
                  <div className="flex items-end gap-2">
                    <label className="mb-2 flex items-center gap-2 text-sm text-stone-700">
                      <input name="is_active" type="checkbox" defaultChecked={review.is_active} />
                      Active
                    </label>
                    <SubmitButton variant="secondary">Save</SubmitButton>
                    <button
                      formAction={deleteReview}
                      className="rounded-xl bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
                    >
                      Delete
                    </button>
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
