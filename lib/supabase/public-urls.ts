const BUCKETS = {
  menu: "menu",
  gallery: "gallery",
} as const;

const MENU_PDFS = {
  dineIn: {
    path: "pdfs/dine-in-menu.pdf",
    fallback: "/menus/dine-in-menu.pdf",
  },
  delivery: {
    path: "pdfs/delivery-menu.pdf",
    fallback: "/menus/delivery-menu.pdf",
  },
} as const;

function baseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function objectPublicUrl(bucket: string, path: string) {
  const base = baseUrl();
  if (!base || !path) return null;
  const clean = path.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/${bucket}/${clean}`;
}

export function getMenuImageUrl(path: string | null | undefined) {
  if (!path) return null;
  return objectPublicUrl(BUCKETS.menu, path);
}

export function getMenuPdfUrl(kind: keyof typeof MENU_PDFS) {
  return objectPublicUrl(BUCKETS.menu, MENU_PDFS[kind].path) ?? MENU_PDFS[kind].fallback;
}

export function getMenuPdfPath(kind: keyof typeof MENU_PDFS) {
  return MENU_PDFS[kind].path;
}

export function getGalleryImageUrl(path: string | null | undefined) {
  if (!path) return null;
  return objectPublicUrl(BUCKETS.gallery, path);
}
