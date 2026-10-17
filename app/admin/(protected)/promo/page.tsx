import { updatePromoModal } from "@/app/admin/actions";
import Image from "@/components/AppImage";
import {
  AdminPageHeader,
  AdminPanel,
  Field,
  inputClass,
} from "@/components/admin/AdminUi";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { getRestaurant } from "@/lib/admin/data";

export const metadata = { title: "Promo modal" };
export const dynamic = "force-dynamic";

export default async function AdminPromoPage() {
  const restaurant = await getRestaurant();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Marketing"
        title="Promo modal"
        description="Upload a poster that pops up once for homepage visitors. After they close it, it stays hidden for 2 hours."
      />

      <form action={updatePromoModal} className="space-y-6">
        <AdminPanel
          title="Visibility"
          description="Enable only when you have a current poster ready to show."
        >
          <label className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 text-sm text-zinc-700">
            <input
              className="mt-1"
              name="promo_modal_enabled"
              type="checkbox"
              defaultChecked={restaurant.promo_modal_enabled}
            />
            <span>
              <span className="block font-semibold text-zinc-900">
                Show promo modal on homepage
              </span>
              <span className="mt-1 block text-zinc-500">
                Visitors see a centered fade-in poster. Closing it hides it for
                2 hours on that device.
              </span>
            </span>
          </label>
        </AdminPanel>

        <AdminPanel
          title="Poster"
          description="Use a clear vertical or square image. Large photos work best."
        >
          <div className="space-y-4">
            {restaurant.promoModalImageUrl ? (
              <div className="relative mx-auto aspect-3/4 max-w-xs overflow-hidden rounded-2xl bg-zinc-200">
                <Image
                  src={restaurant.promoModalImageUrl}
                  alt="Current promo poster"
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
                No poster uploaded yet.
              </p>
            )}
            <Field label="Upload poster">
              <input
                className={inputClass}
                name="promo_image"
                type="file"
                accept="image/*"
              />
            </Field>
            {restaurant.promo_modal_image_path ? (
              <label className="flex items-center gap-2 text-sm text-zinc-600">
                <input name="remove_promo_image" type="checkbox" />
                Remove current poster
              </label>
            ) : null}
          </div>
        </AdminPanel>

        <AdminPanel
          title="Optional link"
          description="If set, tapping the poster opens this URL in a new tab."
        >
          <Field label="Link URL">
            <input
              className={inputClass}
              name="promo_modal_link_url"
              type="url"
              placeholder="https://…"
              defaultValue={restaurant.promo_modal_link_url ?? ""}
            />
          </Field>
        </AdminPanel>

        <div className="flex justify-end">
          <SubmitButton>Save promo</SubmitButton>
        </div>
      </form>
    </div>
  );
}
