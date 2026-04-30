import { updateRestaurantSettings } from "@/app/admin/actions";
import Image from "next/image";
import {
  AdminPageHeader,
  AdminPanel,
  Field,
  inputClass,
  textareaClass,
} from "@/components/admin/AdminUi";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { getRestaurant } from "@/lib/admin/data";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const restaurant = await getRestaurant();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Business"
        title="Restaurant settings"
        description="Edit the core content used across the homepage, contact area, footer, and legal pages."
      />

      <form action={updateRestaurantSettings} className="space-y-6">
        <AdminPanel title="Identity">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Restaurant name">
              <input
                className={inputClass}
                name="name"
                required
                defaultValue={restaurant.name}
              />
            </Field>
            <Field label="Tagline">
              <input
                className={inputClass}
                name="tagline"
                defaultValue={restaurant.tagline ?? ""}
                placeholder="Modern Italian kitchen"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Story">
                <textarea
                  className={`${textareaClass} min-h-36`}
                  name="story"
                  defaultValue={restaurant.story ?? ""}
                  placeholder="Tell visitors what makes this restaurant special."
                />
              </Field>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel
          title="About section images"
          description="Upload the two images used in the public About us section."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Main about image">
              <div className="space-y-3">
                {restaurant.aboutImageUrl ? (
                  <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-zinc-200">
                    <Image
                      src={restaurant.aboutImageUrl}
                      alt="Current main about image"
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 40vw, 100vw"
                    />
                  </div>
                ) : null}
                <input
                  className={inputClass}
                  name="about_image"
                  type="file"
                  accept="image/*"
                />
              </div>
            </Field>
            <Field label="Small detail image">
              <div className="space-y-3">
                {restaurant.aboutDetailImageUrl ? (
                  <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-zinc-200">
                    <Image
                      src={restaurant.aboutDetailImageUrl}
                      alt="Current small about image"
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 40vw, 100vw"
                    />
                  </div>
                ) : null}
                <input
                  className={inputClass}
                  name="about_detail_image"
                  type="file"
                  accept="image/*"
                />
              </div>
            </Field>
          </div>
        </AdminPanel>

        <AdminPanel
          title="Homepage sections"
          description="Choose which optional content blocks should appear on the public homepage."
        >
          <label className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 text-sm text-zinc-700">
            <input
              className="mt-1"
              name="show_notices"
              type="checkbox"
              defaultChecked={restaurant.show_notices}
            />
            <span>
              <span className="block font-semibold text-zinc-900">
                Show notices section
              </span>
              <span className="mt-1 block text-zinc-500">
                Turn this off when you do not have current announcements.
              </span>
            </span>
          </label>
        </AdminPanel>

        <AdminPanel title="Contact and location">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Phone">
              <input
                className={inputClass}
                name="phone"
                defaultValue={restaurant.phone ?? ""}
                placeholder="+49 ..."
              />
            </Field>
            <Field label="Email">
              <input
                className={inputClass}
                name="email"
                type="email"
                defaultValue={restaurant.email ?? ""}
              />
            </Field>
            <Field label="Address line">
              <input
                className={inputClass}
                name="address_line"
                defaultValue={restaurant.address_line ?? ""}
              />
            </Field>
            <Field label="City">
              <input
                className={inputClass}
                name="city"
                defaultValue={restaurant.city ?? ""}
              />
            </Field>
            <Field label="Postal code">
              <input
                className={inputClass}
                name="postal_code"
                defaultValue={restaurant.postal_code ?? ""}
              />
            </Field>
            <Field label="Country">
              <input
                className={inputClass}
                name="country"
                defaultValue={restaurant.country ?? "Germany"}
              />
            </Field>
            <div className="md:col-span-2">
              <Field
                label="Google Maps URL"
                hint="Use a normal maps URL for directions, or a google.com/maps/embed URL to show an embedded map."
              >
                <input
                  className={inputClass}
                  name="maps_url"
                  defaultValue={restaurant.maps_url ?? ""}
                />
              </Field>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel title="Social links">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Instagram">
              <input
                className={inputClass}
                name="social_instagram"
                type="url"
                defaultValue={restaurant.social_instagram ?? ""}
                placeholder="https://instagram.com/..."
              />
            </Field>
            <Field label="Facebook">
              <input
                className={inputClass}
                name="social_facebook"
                type="url"
                defaultValue={restaurant.social_facebook ?? ""}
                placeholder="https://facebook.com/..."
              />
            </Field>
          </div>
        </AdminPanel>

        <AdminPanel
          title="Legal copy"
          description="These fields power the public Imprint and Privacy pages."
        >
          <div className="grid gap-4">
            <Field label="Imprint content">
              <textarea
                className={`${textareaClass} min-h-40`}
                name="impressum_content"
                defaultValue={restaurant.impressum_content ?? ""}
              />
            </Field>
            <Field label="Privacy content">
              <textarea
                className={`${textareaClass} min-h-40`}
                name="datenschutz_content"
                defaultValue={restaurant.datenschutz_content ?? ""}
              />
            </Field>
          </div>
        </AdminPanel>

        <div className="sticky bottom-4 z-10 flex justify-end">
          <SubmitButton className="shadow-lg">Save settings</SubmitButton>
        </div>
      </form>
    </div>
  );
}
