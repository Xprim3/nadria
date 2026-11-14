export type PublicPromoPoster = {
  id: string;
  storagePath: string;
  imageUrl: string;
  linkUrl: string | null;
};

/**
 * Identity of the posters currently on screen.
 * A single poster keeps the storage path so an existing 2-hour dismiss
 * still applies. Two or more use their ids, so activating another poster
 * no longer matches that dismiss.
 */
export function promoDismissSignature(
  posters: { id: string; storagePath: string }[],
) {
  if (posters.length === 1) return posters[0].storagePath;
  return posters
    .map((poster) => poster.id)
    .sort()
    .join("|");
}
