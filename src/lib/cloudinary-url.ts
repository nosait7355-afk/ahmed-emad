/**
 * Cloudinary delivery-URL helpers for list thumbnails.
 *
 * Uploaded exercise media is stored as full-size originals. Lists show up to
 * dozens of cards at once, so they ask Cloudinary for a small, auto-format,
 * auto-quality copy instead. URLs from any other host are returned unchanged.
 */

const CLOUDINARY_RE = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/)(image|video)\/upload\/(.+)$/;

/** Small, compressed copy of a Cloudinary image (GIFs stay animated). */
export function cloudinaryThumb(url: string, width = 480): string {
  const m = url.match(CLOUDINARY_RE);
  if (!m || m[2] !== "image") return url;
  return `${m[1]}image/upload/w_${width},c_limit,f_auto,q_auto/${m[3]}`;
}

/** Still JPG of a Cloudinary video's first frame, or null when the URL isn't a Cloudinary video. */
export function cloudinaryVideoPoster(url: string, width = 480): string | null {
  const m = url.match(CLOUDINARY_RE);
  if (!m || m[2] !== "video") return null;
  const path = m[3].replace(/\.[a-z0-9]+$/i, "") + ".jpg";
  return `${m[1]}video/upload/so_0,w_${width},c_limit,q_auto/${path}`;
}
