"use server";

import { revalidatePath } from "next/cache";
import { getAdminClient, getRestaurant } from "@/lib/admin/data";
import { getMenuPdfPath } from "@/lib/supabase/public-urls";

const ADMIN_PATHS = [
  "/",
  "/admin",
  "/admin/menu",
  "/admin/categories",
  "/admin/hours",
  "/admin/notices",
  "/admin/reviews",
  "/admin/gallery",
  "/admin/settings",
];

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value.length > 0 ? value : null;
}

function intValue(formData: FormData, key: string, fallback = 0) {
  const raw = text(formData, key);
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function priceToCents(value: string) {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.round(parsed * 100);
}

function nullableDate(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? value : null;
}

function nullableTime(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? value : null;
}

function selected(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function revalidateAdmin() {
  for (const path of ADMIN_PATHS) revalidatePath(path);
}

function menuPdfKind(formData: FormData) {
  const kind = text(formData, "menu_kind");
  if (kind !== "dineIn" && kind !== "delivery") {
    throw new Error("Unknown menu PDF type.");
  }
  return kind;
}

function imagePath(bucket: "menu" | "gallery", file: File, folder?: string) {
  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const ext = rawExt.replace(/[^a-z0-9]/g, "") || "jpg";
  return `${folder ?? bucket}/${crypto.randomUUID()}.${ext}`;
}

async function uploadImage(
  bucket: "menu" | "gallery",
  file: FormDataEntryValue | null,
  folder?: string,
) {
  if (!(file instanceof File) || file.size === 0) return null;
  const { supabase } = await getAdminClient();
  const path = imagePath(bucket, file, folder);
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return path;
}

function galleryArea(formData: FormData) {
  const area = text(formData, "gallery_area");
  if (area === "hero") return "hero";
  return area === "static" ? "static" : "slider";
}

function galleryFolderFromPath(path: string | null) {
  if (path?.startsWith("hero/")) return "hero";
  return path?.startsWith("static/") ? "static" : "slider";
}

export async function updateMenuPdf(formData: FormData) {
  const kind = menuPdfKind(formData);
  const file = formData.get("pdf");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("PDF file is required.");
  }

  const { supabase } = await getAdminClient();
  const { error } = await supabase.storage
    .from("menu")
    .upload(getMenuPdfPath(kind), file, {
      cacheControl: "3600",
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function createCategory(formData: FormData) {
  const { supabase } = await getAdminClient();
  const restaurant = await getRestaurant();
  const name = text(formData, "name");
  if (!name) throw new Error("Category name is required.");

  const { error } = await supabase.from("menu_category").insert({
    restaurant_id: restaurant.id,
    name,
    description: nullableText(formData, "description"),
    sort_order: intValue(formData, "sort_order"),
  });
  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function updateCategory(formData: FormData) {
  const { supabase } = await getAdminClient();
  const id = text(formData, "id");
  const name = text(formData, "name");
  if (!id || !name) throw new Error("Category id and name are required.");

  const { error } = await supabase
    .from("menu_category")
    .update({
      name,
      description: nullableText(formData, "description"),
      sort_order: intValue(formData, "sort_order"),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function deleteCategory(formData: FormData) {
  const { supabase } = await getAdminClient();
  const id = text(formData, "id");
  if (!id) throw new Error("Category id is required.");

  const { error } = await supabase.from("menu_category").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function createMenuItem(formData: FormData) {
  const { supabase } = await getAdminClient();
  const categoryId = text(formData, "category_id");
  const name = text(formData, "name");
  if (!categoryId || !name) throw new Error("Category and item name are required.");

  const image_path = await uploadImage("menu", formData.get("image"));
  const { error } = await supabase.from("menu_item").insert({
    category_id: categoryId,
    name,
    description: nullableText(formData, "description"),
    price_cents: priceToCents(text(formData, "price")),
    image_path,
    is_available: selected(formData, "is_available"),
    is_featured: selected(formData, "is_featured"),
    sort_order: intValue(formData, "sort_order"),
  });
  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function updateMenuItem(formData: FormData) {
  const { supabase } = await getAdminClient();
  const id = text(formData, "id");
  const categoryId = text(formData, "category_id");
  const name = text(formData, "name");
  if (!id || !categoryId || !name) {
    throw new Error("Item id, category, and name are required.");
  }

  const currentImagePath = nullableText(formData, "current_image_path");
  const uploadedImagePath = await uploadImage("menu", formData.get("image"));
  const { error } = await supabase
    .from("menu_item")
    .update({
      category_id: categoryId,
      name,
      description: nullableText(formData, "description"),
      price_cents: priceToCents(text(formData, "price")),
      image_path: uploadedImagePath ?? currentImagePath,
      is_available: selected(formData, "is_available"),
      is_featured: selected(formData, "is_featured"),
      sort_order: intValue(formData, "sort_order"),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function deleteMenuItem(formData: FormData) {
  const { supabase } = await getAdminClient();
  const id = text(formData, "id");
  const imagePathValue = nullableText(formData, "image_path");
  if (!id) throw new Error("Item id is required.");

  const { error } = await supabase.from("menu_item").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (imagePathValue) {
    await supabase.storage.from("menu").remove([imagePathValue]);
  }
  revalidateAdmin();
}

export async function updateOpeningHour(formData: FormData) {
  const { supabase } = await getAdminClient();
  const restaurant = await getRestaurant();
  const isClosed = selected(formData, "is_closed");
  const dayOfWeek = intValue(formData, "day_of_week");
  const openTime = isClosed ? null : nullableTime(formData, "open_time");
  const closeTime = isClosed ? null : nullableTime(formData, "close_time");
  const secondOpenTime = isClosed ? null : nullableTime(formData, "second_open_time");
  const secondCloseTime = isClosed ? null : nullableTime(formData, "second_close_time");
  const { error } = await supabase.from("opening_hours").upsert(
    {
      restaurant_id: restaurant.id,
      day_of_week: dayOfWeek,
      is_closed: isClosed,
      open_time: openTime,
      close_time: closeTime,
      second_open_time: secondOpenTime,
      second_close_time: secondCloseTime,
    },
    { onConflict: "restaurant_id,day_of_week" },
  );
  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function copyOpeningHoursToWeek(formData: FormData) {
  const { supabase } = await getAdminClient();
  const restaurant = await getRestaurant();
  const sourceDay = intValue(formData, "source_day", 1);

  const { data: source, error: sourceError } = await supabase
    .from("opening_hours")
    .select("is_closed, open_time, close_time, second_open_time, second_close_time")
    .eq("restaurant_id", restaurant.id)
    .eq("day_of_week", sourceDay)
    .maybeSingle();

  if (sourceError) throw new Error(sourceError.message);
  if (!source) throw new Error("Please save the source day first.");

  const rows = [1, 2, 3, 4, 5, 6].map((day) => ({
    restaurant_id: restaurant.id,
    day_of_week: day,
    is_closed: source.is_closed,
    open_time: source.is_closed ? null : source.open_time,
    close_time: source.is_closed ? null : source.close_time,
    second_open_time: source.is_closed ? null : source.second_open_time,
    second_close_time: source.is_closed ? null : source.second_close_time,
  }));

  const { error } = await supabase.from("opening_hours").upsert(rows, {
    onConflict: "restaurant_id,day_of_week",
  });
  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function createNotice(formData: FormData) {
  const { supabase } = await getAdminClient();
  const restaurant = await getRestaurant();
  const title = text(formData, "title");
  if (!title) throw new Error("Notice title is required.");
  const image_path = await uploadImage("gallery", formData.get("image"), "notices");

  const { error } = await supabase.from("notice").insert({
    restaurant_id: restaurant.id,
    title,
    body: nullableText(formData, "body"),
    starts_on: nullableDate(formData, "starts_on"),
    ends_on: nullableDate(formData, "ends_on"),
    is_active: selected(formData, "is_active"),
    image_path,
  });
  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function updateNotice(formData: FormData) {
  const { supabase } = await getAdminClient();
  const id = text(formData, "id");
  const title = text(formData, "title");
  const currentImagePath = nullableText(formData, "current_image_path");
  if (!id || !title) throw new Error("Notice id and title are required.");
  const uploadedImagePath = await uploadImage("gallery", formData.get("image"), "notices");

  const { error } = await supabase
    .from("notice")
    .update({
      title,
      body: nullableText(formData, "body"),
      starts_on: nullableDate(formData, "starts_on"),
      ends_on: nullableDate(formData, "ends_on"),
      is_active: selected(formData, "is_active"),
      image_path: uploadedImagePath ?? currentImagePath,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  if (uploadedImagePath && currentImagePath) {
    await supabase.storage.from("gallery").remove([currentImagePath]);
  }
  revalidateAdmin();
}

export async function deleteNotice(formData: FormData) {
  const { supabase } = await getAdminClient();
  const id = text(formData, "id");
  const imagePathValue = nullableText(formData, "image_path");
  if (!id) throw new Error("Notice id is required.");

  const { error } = await supabase.from("notice").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (imagePathValue) {
    await supabase.storage.from("gallery").remove([imagePathValue]);
  }
  revalidateAdmin();
}

export async function createReview(formData: FormData) {
  const { supabase } = await getAdminClient();
  const restaurant = await getRestaurant();
  const quote = text(formData, "quote");
  const name = text(formData, "name");
  if (!quote || !name) throw new Error("Review text and guest name are required.");

  const { error } = await supabase.from("review").insert({
    restaurant_id: restaurant.id,
    quote,
    name,
    detail: nullableText(formData, "detail"),
    is_active: selected(formData, "is_active"),
    sort_order: intValue(formData, "sort_order"),
  });

  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function updateReview(formData: FormData) {
  const { supabase } = await getAdminClient();
  const id = text(formData, "id");
  const quote = text(formData, "quote");
  const name = text(formData, "name");
  if (!id || !quote || !name) {
    throw new Error("Review id, text, and guest name are required.");
  }

  const { error } = await supabase
    .from("review")
    .update({
      quote,
      name,
      detail: nullableText(formData, "detail"),
      is_active: selected(formData, "is_active"),
      sort_order: intValue(formData, "sort_order"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function deleteReview(formData: FormData) {
  const { supabase } = await getAdminClient();
  const id = text(formData, "id");
  if (!id) throw new Error("Review id is required.");

  const { error } = await supabase.from("review").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function createGalleryImage(formData: FormData) {
  const { supabase } = await getAdminClient();
  const restaurant = await getRestaurant();
  const area = galleryArea(formData);
  const images = formData
    .getAll("image")
    .filter((file): file is File => file instanceof File && file.size > 0);
  if (images.length === 0) throw new Error("Image is required.");

  const caption = nullableText(formData, "caption");
  const sortOrder = intValue(formData, "sort_order");

  if (area === "static") {
    const slot = Math.min(4, Math.max(1, intValue(formData, "static_slot", 1)));
    const storage_path = await uploadImage("gallery", images[0], "static");
    if (!storage_path) throw new Error("Image is required.");

    const { data: existing, error: existingError } = await supabase
      .from("gallery_image")
      .select("id, storage_path")
      .eq("restaurant_id", restaurant.id)
      .eq("sort_order", slot)
      .like("storage_path", "static/%");
    if (existingError) throw new Error(existingError.message);

    const existingIds = (existing ?? []).map((image) => image.id);
    const existingPaths = (existing ?? []).map((image) => image.storage_path);
    if (existingIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("gallery_image")
        .delete()
        .in("id", existingIds);
      if (deleteError) throw new Error(deleteError.message);
    }
    if (existingPaths.length > 0) {
      await supabase.storage.from("gallery").remove(existingPaths);
    }

    const { error } = await supabase.from("gallery_image").insert({
      restaurant_id: restaurant.id,
      storage_path,
      caption,
      sort_order: slot,
    });
    if (error) throw new Error(error.message);
    revalidateAdmin();
    return;
  }

  const rows = await Promise.all(
    images.map(async (image, index) => {
      const storage_path = await uploadImage("gallery", image, area);
      if (!storage_path) throw new Error("Image is required.");

      return {
        restaurant_id: restaurant.id,
        storage_path,
        caption,
        sort_order: sortOrder + index,
      };
    }),
  );

  const { error } = await supabase.from("gallery_image").insert(rows);
  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function updateGalleryImage(formData: FormData) {
  const { supabase } = await getAdminClient();
  const id = text(formData, "id");
  const currentPath = nullableText(formData, "current_storage_path");
  if (!id) throw new Error("Image id is required.");

  const uploadedPath = await uploadImage(
    "gallery",
    formData.get("image"),
    galleryFolderFromPath(currentPath),
  );
  const { error } = await supabase
    .from("gallery_image")
    .update({
      storage_path: uploadedPath ?? currentPath,
      caption: nullableText(formData, "caption"),
      sort_order: intValue(formData, "sort_order"),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAdmin();
}

export async function deleteGalleryImage(formData: FormData) {
  const { supabase } = await getAdminClient();
  const id = text(formData, "id");
  const storagePath = nullableText(formData, "storage_path");
  if (!id) throw new Error("Image id is required.");

  const { error } = await supabase.from("gallery_image").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (storagePath) {
    await supabase.storage.from("gallery").remove([storagePath]);
  }
  revalidateAdmin();
}

export async function updateRestaurantSettings(formData: FormData) {
  const { supabase } = await getAdminClient();
  const restaurant = await getRestaurant();
  const name = text(formData, "name");
  if (!name) throw new Error("Restaurant name is required.");
  const uploadedAboutImagePath = await uploadImage(
    "gallery",
    formData.get("about_image"),
    "about",
  );
  const uploadedAboutDetailImagePath = await uploadImage(
    "gallery",
    formData.get("about_detail_image"),
    "about",
  );

  const { error } = await supabase
    .from("restaurant")
    .update({
      name,
      tagline: nullableText(formData, "tagline"),
      story: nullableText(formData, "story"),
      phone: nullableText(formData, "phone"),
      email: nullableText(formData, "email"),
      address_line: nullableText(formData, "address_line"),
      city: nullableText(formData, "city"),
      postal_code: nullableText(formData, "postal_code"),
      country: nullableText(formData, "country") ?? "Germany",
      maps_url: nullableText(formData, "maps_url"),
      social_instagram: nullableText(formData, "social_instagram"),
      social_facebook: nullableText(formData, "social_facebook"),
      impressum_content: nullableText(formData, "impressum_content"),
      datenschutz_content: nullableText(formData, "datenschutz_content"),
      show_notices: selected(formData, "show_notices"),
      about_image_path: uploadedAboutImagePath ?? restaurant.about_image_path,
      about_detail_image_path:
        uploadedAboutDetailImagePath ?? restaurant.about_detail_image_path,
    })
    .eq("id", restaurant.id);
  if (error) throw new Error(error.message);
  if (uploadedAboutImagePath && restaurant.about_image_path) {
    await supabase.storage.from("gallery").remove([restaurant.about_image_path]);
  }
  if (uploadedAboutDetailImagePath && restaurant.about_detail_image_path) {
    await supabase.storage
      .from("gallery")
      .remove([restaurant.about_detail_image_path]);
  }
  revalidateAdmin();
}
