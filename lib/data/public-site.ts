import { weekdayLabel } from "@/lib/format";
import {
  getOpenStatus,
  type OpenStatusResult,
} from "@/lib/open-status";
import { createClient } from "@/lib/supabase/server";
import { getGalleryImageUrl, getMenuImageUrl } from "@/lib/supabase/public-urls";

export type RestaurantRow = {
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
  latitude: number | null;
  longitude: number | null;
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

export type MenuCategoryRow = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type MenuItemRow = {
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

export type HoursRow = {
  day_of_week: number;
  is_closed: boolean;
  open_time: string | null;
  close_time: string | null;
  second_open_time: string | null;
  second_close_time: string | null;
};

export type NoticeRow = {
  id: string;
  title: string;
  body: string | null;
  starts_on: string | null;
  ends_on: string | null;
  is_active: boolean;
  image_path: string | null;
  imageUrl: string | null;
};

export type GalleryImageRow = {
  id: string;
  storage_path: string;
  caption: string | null;
  sort_order: number;
};

export type ReviewRow = {
  id: string;
  quote: string;
  name: string;
  detail: string | null;
  is_active: boolean;
  sort_order: number;
};

export type MenuCategoryView = MenuCategoryRow & {
  items: (MenuItemRow & { imageUrl: string | null })[];
};

export type PublicSitePayload = {
  restaurant: RestaurantRow;
  openStatus: OpenStatusResult;
  notices: NoticeRow[];
  heroNotice: NoticeRow | null;
  hours: HoursRow[];
  hoursByDay: { day: number; label: string; line: string }[];
  menuCategories: MenuCategoryView[];
  featuredItems: (MenuItemRow & {
    imageUrl: string | null;
    categoryName: string;
  })[];
  gallery: (GalleryImageRow & { imageUrl: string | null })[];
  reviews: ReviewRow[];
  directionsUrl: string | null;
  telHref: string | null;
  mailtoHref: string | null;
};

function buildDirectionsUrl(
  r: Pick<
    RestaurantRow,
    "maps_url" | "address_line" | "postal_code" | "city" | "country"
  >,
) {
  const explicitMapUrl = r.maps_url?.trim();
  if (explicitMapUrl) return explicitMapUrl;

  const usefulParts = [r.address_line, r.postal_code, r.city]
    .map((part) => part?.trim())
    .filter(Boolean) as string[];
  // Avoid low-quality directions like "query=Deutschland" only.
  if (usefulParts.length === 0) return null;

  const parts = [...usefulParts, r.country?.trim()].filter(Boolean) as string[];
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.join(", "))}`;
}

function telHref(phone: string | null) {
  if (!phone) return null;
  return `tel:${phone.replace(/[\s()-]/g, "")}`;
}

function mailtoHref(email: string | null) {
  if (!email) return null;
  return `mailto:${email}`;
}

function formatHoursLine(h: HoursRow) {
  if (h.is_closed) return "Geschlossen";
  const o = h.open_time?.slice(0, 5);
  const c = h.close_time?.slice(0, 5);
  const o2 = h.second_open_time?.slice(0, 5);
  const c2 = h.second_close_time?.slice(0, 5);
  const intervals = [
    o && c ? `${o} – ${c}` : null,
    o2 && c2 ? `${o2} – ${c2}` : null,
  ].filter(Boolean);
  if (intervals.length > 0) return intervals.join(" and ");
  // No open windows: treat as closed (matches admin "Closed" or empty times)
  return "Geschlossen";
}

function filterNotices(
  rows: NoticeRow[] | null,
): NoticeRow[] {
  if (!rows) return [];
  return rows.filter((n) => n.is_active);
}

export async function loadPublicSiteData(): Promise<PublicSitePayload | null> {
  try {
    const supabase = await createClient();
    const { data: restaurantFull, error: restaurantFullError } = await supabase
      .from("restaurant")
      .select(
        "id, name, tagline, story, phone, email, address_line, city, postal_code, country, latitude, longitude, maps_url, social_instagram, social_facebook, impressum_content, datenschutz_content, show_notices, about_image_path, about_detail_image_path",
      )
      .limit(1)
      .maybeSingle();
    const { data: restaurantBase, error: restaurantBaseError } = restaurantFull
      ? { data: null, error: null as null | { message: string } }
      : await supabase
          .from("restaurant")
          .select(
            "id, name, tagline, story, phone, email, address_line, city, postal_code, country, latitude, longitude, maps_url, social_instagram, social_facebook, impressum_content, datenschutz_content",
          )
          .limit(1)
          .maybeSingle();

    const restaurant = restaurantFull ?? restaurantBase;
    const restaurantError = restaurantFullError ?? restaurantBaseError;
    if (restaurantError || !restaurant) return null;

    const rid = restaurant.id as string;
    const [noticesQ, hoursQ, galleryQ, catsQ, reviewsQ] = await Promise.all([
      (async () => {
        const full = await supabase
          .from("notice")
          .select("id, title, body, starts_on, ends_on, is_active, image_path")
          .eq("restaurant_id", rid)
          .order("created_at", { ascending: false });
        if (!full.error) return full;
        const base = await supabase
          .from("notice")
          .select("id, title, body, starts_on, ends_on, is_active")
          .eq("restaurant_id", rid)
          .order("created_at", { ascending: false });
        return {
          ...base,
          data: (base.data ?? []).map((n) => ({ ...n, image_path: null })),
        };
      })(),
      (async () => {
        const full = await supabase
          .from("opening_hours")
          .select("day_of_week, is_closed, open_time, close_time, second_open_time, second_close_time")
          .eq("restaurant_id", rid)
          .order("day_of_week", { ascending: true });
        if (!full.error) return full;
        const base = await supabase
          .from("opening_hours")
          .select("day_of_week, is_closed, open_time, close_time")
          .eq("restaurant_id", rid)
          .order("day_of_week", { ascending: true });
        return {
          ...base,
          data: (base.data ?? []).map((h) => ({
            ...h,
            second_open_time: null,
            second_close_time: null,
          })),
        };
      })(),
      supabase
        .from("gallery_image")
        .select("id, storage_path, caption, sort_order")
        .eq("restaurant_id", rid)
        .order("sort_order", { ascending: true }),
      supabase
        .from("menu_category")
        .select("id, name, description, sort_order")
        .eq("restaurant_id", rid)
        .order("sort_order", { ascending: true }),
      (async () => {
        const full = await supabase
          .from("review")
          .select("id, quote, name, detail, is_active, sort_order")
          .eq("restaurant_id", rid)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });
        if (full.error) return { data: [], error: null };
        return full;
      })(),
    ]);

    const hours = (hoursQ.data ?? []) as HoursRow[];
    const now = new Date();
    const openStatus = getOpenStatus(now, hours);

    const noticeRows = ((noticesQ.data ?? []) as Omit<NoticeRow, "imageUrl">[]).map(
      (notice) => ({
        ...notice,
        imageUrl: getGalleryImageUrl(notice.image_path),
      }),
    );
    const notices = filterNotices(noticeRows);
    const heroNotice =
      noticeRows.find((notice) => notice.is_active) ?? null;

    const hoursByDay = [0, 1, 2, 3, 4, 5, 6].map((day) => {
      const row = hours.find((h) => h.day_of_week === day);
      const line = row
        ? formatHoursLine(row)
        : hours.length > 0
          ? "Geschlossen"
          : "—";
      return {
        day,
        label: weekdayLabel(day, "long"),
        line,
      };
    });

    const categories = (catsQ.data ?? []) as MenuCategoryRow[];
    const categoryIds = categories.map((c) => c.id);
    let itemRows: MenuItemRow[] = [];
    if (categoryIds.length > 0) {
      const { data: items } = await supabase
        .from("menu_item")
        .select(
          "id, category_id, name, description, price_cents, image_path, is_available, is_featured, sort_order",
        )
        .in("category_id", categoryIds)
        .order("sort_order", { ascending: true });
      itemRows = (items ?? []) as MenuItemRow[];
    }

    const byCat = new Map<string, MenuItemRow[]>();
    for (const it of itemRows) {
      const list = byCat.get(it.category_id) ?? [];
      list.push(it);
      byCat.set(it.category_id, list);
    }

    const menuCategories: MenuCategoryView[] = categories.map((c) => ({
      ...c,
      items: (byCat.get(c.id) ?? []).map((i) => ({
        ...i,
        imageUrl: getMenuImageUrl(i.image_path),
      })),
    }));

    const catName = new Map(categories.map((c) => [c.id, c.name] as const));
    const featuredItems = itemRows
      .filter((i) => i.is_featured)
      .sort((a, b) => a.sort_order - b.sort_order)
      .slice(0, 6)
      .map((i) => ({
        ...i,
        imageUrl: getMenuImageUrl(i.image_path),
        categoryName: catName.get(i.category_id) ?? "",
      }));

    const gallery = ((galleryQ.data ?? []) as GalleryImageRow[]).map((g) => ({
      ...g,
      imageUrl: getGalleryImageUrl(g.storage_path),
    }));
    const reviews = ((reviewsQ.data ?? []) as ReviewRow[]).filter(
      (review) => review.is_active,
    );

    const restaurantRow = {
      ...(restaurant as Omit<RestaurantRow, "aboutImageUrl" | "aboutDetailImageUrl">),
      show_notices:
        "show_notices" in (restaurant as Record<string, unknown>)
          ? Boolean((restaurant as Record<string, unknown>).show_notices)
          : true,
      about_image_path:
        "about_image_path" in (restaurant as Record<string, unknown>)
          ? ((restaurant as Record<string, unknown>).about_image_path as string | null)
          : null,
      about_detail_image_path:
        "about_detail_image_path" in (restaurant as Record<string, unknown>)
          ? ((restaurant as Record<string, unknown>).about_detail_image_path as string | null)
          : null,
    };

    return {
      restaurant: {
        ...restaurantRow,
        aboutImageUrl: getGalleryImageUrl(restaurantRow.about_image_path),
        aboutDetailImageUrl: getGalleryImageUrl(restaurantRow.about_detail_image_path),
      },
      openStatus,
      notices,
      heroNotice,
      hours,
      hoursByDay,
      menuCategories,
      featuredItems,
      gallery,
      reviews,
      directionsUrl: buildDirectionsUrl(restaurantRow),
      telHref: telHref(restaurantRow.phone),
      mailtoHref: mailtoHref(restaurantRow.email),
    };
  } catch {
    return null;
  }
}

export async function loadRestaurantLegal() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("restaurant")
      .select("name, impressum_content, datenschutz_content")
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return data as {
      name: string;
      impressum_content: string | null;
      datenschutz_content: string | null;
    };
  } catch {
    return null;
  }
}
