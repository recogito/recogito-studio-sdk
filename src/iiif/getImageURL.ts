import type { Canvas } from '@allmaps/iiif-parser';

export type IIIFImage = string | Canvas;

// IIIF mandates that URIs are without 'info.json', but doesn't
// say anything about with our without trailing slash AFAIK.
// Needless to say: people will still sometimes append the '/info.json'
// in the real world... this helper should cover all flavours.
export const getImageURL = (image: IIIFImage) => {
  if (!image) return;

  if (typeof image === 'string') return image;

  const uri = image?.image.uri;

  if (!uri) {
    console.error('Missing image URI on canvas', image);
    return;
  }

  return uri.endsWith('info.json')
    ? uri
    : `${uri.endsWith('/') ? uri : `${uri}/`}info.json`;
};
