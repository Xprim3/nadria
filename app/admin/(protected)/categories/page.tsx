import {
  createCategory,
  deleteCategory,
  updateCategory,
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
import { getCategories } from "@/lib/admin/data";

export const metadata = { title: "Categories" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Menu"
        title="Categories"
        description="Organize dishes into groups such as pizza, pasta, starters, drinks, and desserts."
      />

      <AdminPanel title="Add category">
        <form action={createCategory} className="grid gap-4 md:grid-cols-[1fr_1fr_120px_auto] md:items-end">
          <Field label="Name">
            <input className={inputClass} name="name" required placeholder="Pizza" />
          </Field>
          <Field label="Description">
            <input
              className={inputClass}
              name="description"
              placeholder="Stone-baked classics"
            />
          </Field>
          <Field label="Order">
            <input
              className={inputClass}
              name="sort_order"
              type="number"
              defaultValue={categories.length + 1}
            />
          </Field>
          <SubmitButton>Add</SubmitButton>
        </form>
      </AdminPanel>

      <AdminPanel title="Current categories">
        {categories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Create categories first, then add menu items."
          />
        ) : (
          <div className="grid gap-4">
            {categories.map((category) => (
              <form
                key={category.id}
                action={updateCategory}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
              >
                <input type="hidden" name="id" value={category.id} />
                <div className="grid gap-4 md:grid-cols-[1fr_1fr_110px_auto] md:items-start">
                  <Field label="Name">
                    <input
                      className={inputClass}
                      name="name"
                      required
                      defaultValue={category.name}
                    />
                  </Field>
                  <Field label="Description">
                    <textarea
                      className={`${textareaClass} min-h-10`}
                      name="description"
                      defaultValue={category.description ?? ""}
                      rows={1}
                    />
                  </Field>
                  <Field label="Order">
                    <input
                      className={inputClass}
                      name="sort_order"
                      type="number"
                      defaultValue={category.sort_order}
                    />
                  </Field>
                  <div className="flex gap-2 md:pt-6">
                    <SubmitButton variant="secondary">Save</SubmitButton>
                    <button
                      formAction={deleteCategory}
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
