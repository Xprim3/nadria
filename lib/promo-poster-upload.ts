export const MAX_PROMO_POSTERS = 10;
export const MAX_PROMO_POSTER_BYTES = 10 * 1024 * 1024;

const PROMO_STORAGE_PATH_PATTERN = /^promo\/[0-9a-f-]{36}\.[a-z0-9]+$/;

export const PROMO_POSTER_ERRORS = {
  required: "Poster image is required.",
  notImage: "Poster must be an image.",
  tooLarge: "Poster must be 10 MB or smaller.",
  tooMany: "You can add up to 10 posters at once.",
  invalidPath: "Invalid poster path.",
} as const;

export function isPromoStoragePath(path: string) {
  return PROMO_STORAGE_PATH_PATTERN.test(path);
}

export function promoPosterStoragePath(fileName: string) {
  const rawExt = fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const ext = rawExt.replace(/[^a-z0-9]/g, "") || "jpg";
  return `promo/${crypto.randomUUID()}.${ext}`;
}

export function promoUploadProgressLabel(current: number, total: number) {
  return `Uploading… ${current}/${total}`;
}

export function promoPosterSelectionErrors(files: readonly File[]) {
  if (files.length === 0) return [PROMO_POSTER_ERRORS.required];
  if (files.length > MAX_PROMO_POSTERS) return [PROMO_POSTER_ERRORS.tooMany];

  return files.flatMap((file) => {
    const name = file.name || "Poster";
    if (file.size === 0) return [`${name}: ${PROMO_POSTER_ERRORS.required}`];

    const errors: string[] = [];
    if (!file.type.startsWith("image/")) {
      errors.push(`${name}: ${PROMO_POSTER_ERRORS.notImage}`);
    }
    if (file.size > MAX_PROMO_POSTER_BYTES) {
      errors.push(`${name}: ${PROMO_POSTER_ERRORS.tooLarge}`);
    }
    return errors;
  });
}

export function parsePromoStoragePaths(
  storagePaths: unknown,
): { ok: true; paths: string[] } | { ok: false; error: string } {
  if (!Array.isArray(storagePaths) || storagePaths.length === 0) {
    return { ok: false, error: PROMO_POSTER_ERRORS.required };
  }
  if (storagePaths.length > MAX_PROMO_POSTERS) {
    return { ok: false, error: PROMO_POSTER_ERRORS.tooMany };
  }

  const paths: string[] = [];
  for (const path of storagePaths) {
    if (typeof path !== "string" || !isPromoStoragePath(path)) {
      return { ok: false, error: PROMO_POSTER_ERRORS.invalidPath };
    }
    paths.push(path);
  }

  return { ok: true, paths };
}
