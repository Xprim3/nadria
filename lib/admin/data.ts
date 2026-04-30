import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getGalleryImageUrl, getMenuImageUrl } from "@/lib/supabase/public-urls";

export type Restaurant = {
  id: string;
  name: string;
  tagline: string | null;
  story: string | null;
  phone: string | null;
  email: string | null;
  address_line: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  maps_url: string | null;
  social_instagram: string | null;
  social_facebook: string | null;
  impressum_content: string | null;
  datenschutz_content: string | null;
  show_notices: boolean;
  about_image_path: string | null;
  about_detail_image_path: string | null;
  aboutImageUrl: string | null;
  aboutDetailImageUrl: string | null;
};

export type Category = {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_path: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
};

export type MenuItemWithCategory = MenuItem & {
  categoryName: string;
  imageUrl: string | null;
};

export type OpeningHour = {
  id: string;
  restaurant_id: string;
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  second_open_time: string | null;
  second_close_time: string | null;
  is_closed: boolean;
};

export type Notice = {
  id: string;
  restaurant_id: string;
  title: string;
  body: string | null;
  starts_on: string | null;
  ends_on: string | null;
  is_active: boolean;
  image_path: string | null;
  imageUrl: string | null;
};

export type GalleryImage = {
  id: string;
  restaurant_id: string;
  storage_path: string;
  caption: string | null;
  sort_order: number;
  imageUrl: string | null;
};

export type Review = {
  id: string;
  restaurant_id: string;
  quote: string;
  name: string;
  detail: string | null;
  is_active: boolean;
  sort_order: number;
};

export async function getAdminClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return { supabase, user };
}

export async function getRestaurant() {
  const { supabase } = await getAdminClient();
  const { data, error } = await supabase
    .from("restaurant")
    .select(
      "id, name, tagline, story, phone, email, address_line, city, postal_code, country, maps_url, social_instagram, social_facebook, impressum_content, datenschutz_content, show_notices, about_image_path, about_detail_image_path",
    )
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (data) {
    const restaurant = data as Omit<Restaurant, "aboutImageUrl" | "aboutDetailImageUrl">;
    return {
      ...restaurant,
      aboutImageUrl: getGalleryImageUrl(restaurant.about_image_path),
      aboutDetailImageUrl: getGalleryImageUrl(restaurant.about_detail_image_path),
    };
  }

  const { data: created, error: createError } = await supabase
    .from("restaurant")
    .insert({ name: "Restaurant", country: "Germany" })
    .select(
      "id, name, tagline, story, phone, email, address_line, city, postal_code, country, maps_url, social_instagram, social_facebook, impressum_content, datenschutz_content, show_notices, about_image_path, about_detail_image_path",
    )
    .single();

  if (createError) throw new Error(createError.message);
  const restaurant = created as Omit<Restaurant, "aboutImageUrl" | "aboutDetailImageUrl">;
  return {
    ...restaurant,
    aboutImageUrl: getGalleryImageUrl(restaurant.about_image_path),
    aboutDetailImageUrl: getGalleryImageUrl(restaurant.about_detail_image_path),
  };
}

export async function getCategories() {
  const restaurant = await getRestaurant();
  const { supabase } = await getAdminClient();
  const { data, error } = await supabase
    .from("menu_category")
    .select("id, restaurant_id, name, description, sort_order")
    .eq("restaurant_id", restaurant.id)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

export async function getMenuItems() {
  const categories = await getCategories();
  const categoryIds = categories.map((category) => category.id);
  if (categoryIds.length === 0) return { categories, items: [] };

  const { supabase } = await getAdminClient();
  const { data, error } = await supabase
    .from("menu_item")
    .select(
      "id, category_id, name, description, price_cents, image_path, is_available, is_featured, sort_order",
    )
    .in("category_id", categoryIds)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  const categoryName = new Map(categories.map((c) => [c.id, c.name]));
  const items = ((data ?? []) as MenuItem[]).map((item) => ({
    ...item,
    categoryName: categoryName.get(item.category_id) ?? "Uncategorized",
    imageUrl: getMenuImageUrl(item.image_path),
  }));

  return { categories, items };
}

export async function getOpeningHours() {
  const restaurant = await getRestaurant();
  const { supabase } = await getAdminClient();
  const { data, error } = await supabase
    .from("opening_hours")
    .select("id, restaurant_id, day_of_week, open_time, close_time, second_open_time, second_close_time, is_closed")
    .eq("restaurant_id", restaurant.id)
    .order("day_of_week", { ascending: true });

  if (error) throw new Error(error.message);
  return { restaurant, hours: (data ?? []) as OpeningHour[] };
}

export async function getNotices() {
  const restaurant = await getRestaurant();
  const { supabase } = await getAdminClient();
  const { data, error } = await supabase
    .from("notice")
    .select("id, restaurant_id, title, body, starts_on, ends_on, is_active, image_path")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as Omit<Notice, "imageUrl">[]).map((notice) => ({
    ...notice,
    imageUrl: getGalleryImageUrl(notice.image_path),
  }));
}

export async function getGalleryImages() {
  const restaurant = await getRestaurant();
  const { supabase } = await getAdminClient();
  const { data, error } = await supabase
    .from("gallery_image")
    .select("id, restaurant_id, storage_path, caption, sort_order")
    .eq("restaurant_id", restaurant.id)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as Omit<GalleryImage, "imageUrl">[]).map((image) => ({
    ...image,
    imageUrl: getGalleryImageUrl(image.storage_path),
  }));
}

export async function getReviews() {
  const restaurant = await getRestaurant();
  const { supabase } = await getAdminClient();
  const { data, error } = await supabase
    .from("review")
    .select("id, restaurant_id, quote, name, detail, is_active, sort_order")
    .eq("restaurant_id", restaurant.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Review[];
}

export async function getDashboardData() {
  const { supabase, user } = await getAdminClient();
  const restaurant = await getRestaurant();

  const [notices, gallery, hours, reviews] = await Promise.all([
    getNotices(),
    getGalleryImages(),
    getOpeningHours(),
    getReviews(),
  ]);

  const activeNotices = notices.filter((notice) => notice.is_active).length;
  const missingHours = Math.max(0, 7 - hours.hours.length);

  return {
    restaurant,
    user,
    stats: {
      activeNotices,
      galleryImages: gallery.length,
      missingHours,
      reviews: reviews.length,
    },
    supabaseReady: Boolean(supabase),
  };
}
