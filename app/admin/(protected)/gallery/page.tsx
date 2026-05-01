import Image from "next/image";
import {
  createGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
} from "@/app/admin/actions";
import {
  AdminPageHeader,
  AdminPanel,
  EmptyState,
  Field,
  inputClass,
} from "@/components/admin/AdminUi";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { getGalleryImages } from "@/lib/admin/data";

export const metadata = { title: "Gallery" };
export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await getGalleryImages();
  const heroImages = images.filter((image) => image.storage_path.startsWith("hero/"));
  const staticImages = images.filter((image) => image.storage_path.startsWith("static/"));
  const sliderImages = images.filter(
    (image) =>
      !image.storage_path.startsWith("static/") &&
      !image.storage_path.startsWith("hero/"),
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Media"
        title="Gallery"
        description="Clear upload structure: Hero images, 4 static boxes, and gallery slider images."
      />

      <AdminPanel
        title="1) Hero slider images"
        description="Top homepage background behind the logo. Use only your best wide photos."
      >
        <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-stone-500 uppercase">
          Upload
        </p>
        <form action={createGalleryImage} className="grid gap-4 md:grid-cols-[1fr_1fr_120px_auto] md:items-end">
          <input type="hidden" name="gallery_area" value="hero" />
          <Field label="Hero images">
            <input
              className={inputClass}
              name="image"
              type="file"
              accept="image/*"
              multiple
              required
            />
          </Field>
          <Field label="Caption">
            <input className={inputClass} name="caption" placeholder="Optional caption for all selected images" />
          </Field>
          <Field label="Order">
            <input className={inputClass} name="sort_order" type="number" defaultValue={heroImages.length + 1} />
          </Field>
          <SubmitButton>Upload</SubmitButton>
        </form>
        <div className="mt-7 border-t border-stone-200/80 pt-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold tracking-[0.14em] text-stone-500 uppercase">
              Current images
            </p>
            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
              {heroImages.length}
            </span>
          </div>
        {heroImages.length === 0 ? (
          <EmptyState
            title="No hero images yet"
            description="Upload high-quality wide photos for the top homepage slider."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {heroImages.map((image) => (
              <GalleryImageForm key={image.id} image={image} />
            ))}
          </div>
        )}
        </div>
      </AdminPanel>

      <AdminPanel
        title="2) Static gallery boxes (4)"
        description="These are the four smaller fixed boxes next to the big gallery slider."
      >
        <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-stone-500 uppercase">
          One image per box
        </p>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((slot) => {
            const image = staticImages.find((item) => item.sort_order === slot);
            return (
              <form
                key={slot}
                action={createGalleryImage}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50"
              >
                <input type="hidden" name="gallery_area" value="static" />
                <input type="hidden" name="static_slot" value={slot} />
                <div className="relative aspect-4/3 bg-stone-200">
                  {image?.imageUrl ? (
                    <Image
                      src={image.imageUrl}
                      alt={image.caption ?? `Static gallery image ${slot}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1280px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-sm text-stone-500">
                      Static box {slot}
                    </div>
                  )}
                </div>
                <div className="space-y-4 p-4">
                  <Field label={`Box ${slot} image`}>
                    <input className={inputClass} name="image" type="file" accept="image/*" required />
                  </Field>
                  <Field label="Caption">
                    <input
                      className={inputClass}
                      name="caption"
                      defaultValue={image?.caption ?? ""}
                      placeholder="Pizza, pasta, ambience..."
                    />
                  </Field>
                  <SubmitButton>{image ? "Replace image" : "Upload image"}</SubmitButton>
                </div>
              </form>
            );
          })}
        </div>
      </AdminPanel>

      <AdminPanel
        title="3) Gallery slider images"
        description="Main rotating gallery images in the homepage gallery section."
      >
        <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-stone-500 uppercase">
          Upload
        </p>
        <form action={createGalleryImage} className="grid gap-4 md:grid-cols-[1fr_1fr_120px_auto] md:items-end">
          <input type="hidden" name="gallery_area" value="slider" />
          <Field label="Slider images">
            <input
              className={inputClass}
              name="image"
              type="file"
              accept="image/*"
              multiple
              required
            />
          </Field>
          <Field label="Caption">
            <input className={inputClass} name="caption" placeholder="Optional caption for all selected images" />
          </Field>
          <Field label="Order">
            <input className={inputClass} name="sort_order" type="number" defaultValue={sliderImages.length + 1} />
          </Field>
          <SubmitButton>Upload</SubmitButton>
        </form>
        <div className="mt-7 border-t border-stone-200/80 pt-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold tracking-[0.14em] text-stone-500 uppercase">
              Current images
            </p>
            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
              {sliderImages.length}
            </span>
          </div>
        {sliderImages.length === 0 ? (
          <EmptyState
            title="No slider images yet"
            description="Upload the photos that should rotate in the large gallery slider."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {sliderImages.map((image) => (
              <GalleryImageForm key={image.id} image={image} />
            ))}
          </div>
        )}
        </div>
      </AdminPanel>
    </div>
  );
}

type AdminGalleryImage = Awaited<ReturnType<typeof getGalleryImages>>[number];

function GalleryImageForm({ image }: { image: AdminGalleryImage }) {
  return (
    <form
      action={updateGalleryImage}
      className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/80"
    >
      <input type="hidden" name="id" value={image.id} />
      <input
        type="hidden"
        name="current_storage_path"
        value={image.storage_path}
      />
      <input type="hidden" name="storage_path" value={image.storage_path} />
      <div className="relative aspect-4/3 bg-stone-200">
        {image.imageUrl ? (
          <Image
            src={image.imageUrl}
            alt={image.caption ?? "Gallery image"}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 50vw, 33vw"
          />
        ) : null}
      </div>
      <div className="space-y-4 p-4">
        <p className="text-xs text-stone-500">
          {image.storage_path.startsWith("hero/")
            ? "Hero"
            : image.storage_path.startsWith("static/")
              ? "Static box"
              : "Slider"}
        </p>
        <Field label="Caption">
          <input
            className={inputClass}
            name="caption"
            defaultValue={image.caption ?? ""}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Order">
            <input
              className={inputClass}
              name="sort_order"
              type="number"
              defaultValue={image.sort_order}
            />
          </Field>
          <Field label="Replace image">
            <input className={inputClass} name="image" type="file" accept="image/*" />
          </Field>
        </div>
        <div className="flex gap-2">
          <SubmitButton variant="secondary">Save</SubmitButton>
          <button
            formAction={deleteGalleryImage}
            className="rounded-xl bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </form>
  );
}
