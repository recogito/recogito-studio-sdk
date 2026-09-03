import { getImageURL, type IIIFImage } from './getImageURL';

export interface ThumbnailOptions {
  size?: number;
}

// Derive a IIIF Image API request for a thumbnail from an image service URL
const deriveThumbnailURL = (
  infoURL: string | undefined,
  size: number,
  width?: number,
  height?: number,
): string | undefined => {
  if (!infoURL) return undefined;
  const base = infoURL.replace(/\/?info\.json$/, '').replace(/\/$/, '');
  const dimension = width && height && width > height ? `,${size}` : `${size},`;
  return `${base}/full/${dimension}/0/default.jpg`;
};

/**
 * Resolves a thumbnail URL for a IIIF canvas or image resource, preferring the
 * manifest-declared `thumbnail` when present; otherwise derives a level 1
 * Image API request.
 */
export const getThumbnailURL = (
  image: IIIFImage | undefined,
  options: ThumbnailOptions = {},
): string | undefined => {
  if (!image) return undefined;

  const size = options.size ?? 240;

  if (typeof image === 'string') return deriveThumbnailURL(image, size);

  return (
    image.thumbnail?.[0]?.id ||
    deriveThumbnailURL(getImageURL(image), size, image.width, image.height)
  );
};
