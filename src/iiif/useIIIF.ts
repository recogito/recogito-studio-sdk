import { useEffect, useState } from 'react';
import {
  Canvas,
  IIIF,
  type Manifest,
  type Metadata,
} from '@allmaps/iiif-parser';
import { sanitizeManifest } from './sanitizeManifest';
import type { IIIFImage } from './getImageURL';

export type ManifestType = 'PRESENTATION' | 'IMAGE';

/**
 * Core IIIF resolution hook, shared by the Recogito client and plugins.
 *
 * Given a resolved IIIF URL, it distinguishes a IIIF Image API resource
 * (an `info.json`) from a Presentation manifest, parses the latter via
 * `@allmaps/iiif-parser`, and exposes the canvases, the current image, page
 * navigation, and the parsed `Manifest` (so callers can layer on features
 * such as embedded-annotation parsing).
 */
export const useIIIF = (url?: string) => {
  const [manifest, setManifest] = useState<Manifest | undefined>();

  const [canvases, setCanvases] = useState<Canvas[]>([]);

  const [manifestError, setManifestError] = useState<string | undefined>();

  const [metadata, setMetadata] = useState<Metadata | undefined>();

  const [manifestType, setManifestType] = useState<ManifestType | undefined>();

  const [currentImage, setCurrentImage] = useState<IIIFImage | undefined>();

  useEffect(() => {
    if (!url) return;

    if (url.endsWith('info.json') || url.includes('info.json?')) {
      // IIIF Image API resource - no manifest to fetch
      setCurrentImage(url);
      setManifestType('IMAGE');
      return;
    }

    let cancelled = false;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;

        const parsed = IIIF.parse(sanitizeManifest(data));
        if (parsed.type === 'manifest') {
          setManifest(parsed);
          setCanvases(parsed.canvases);
          setCurrentImage(parsed.canvases[0]);
          setManifestType('PRESENTATION');
          setMetadata(parsed.metadata);
        } else {
          setManifestError(`Failed to parse IIIF manifest: ${url}`);
        }
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Failed to load IIIF manifest', error);
        setManifestError(`Failed to parse IIIF manifest: ${url}`);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  const isPresentationManifest = manifestType === 'PRESENTATION';

  const isImageManifest = manifestType === 'IMAGE';

  const next = () => {
    if (!currentImage || canvases.length === 0) return;

    const idx = canvases.findIndex(
      (c) => c.uri === (currentImage as Canvas).uri,
    );
    const nextIdx = Math.min(idx + 1, canvases.length - 1);

    setCurrentImage(canvases[nextIdx]);
  };

  const previous = () => {
    if (!currentImage || canvases.length === 0) return;

    const idx = canvases.findIndex(
      (c) => c.uri === (currentImage as Canvas).uri,
    );
    const nextIdx = Math.max(0, idx - 1);

    setCurrentImage(canvases[nextIdx]);
  };

  return {
    manifest,
    canvases,
    currentImage,
    isPresentationManifest,
    isImageManifest,
    manifestError,
    metadata,
    next,
    previous,
    setCurrentImage,
  };
};
