import { useEffect, useState } from 'react';
import {
  Cozy,
  type CozyCanvas,
  type CozyImageResource,
  type CozyManifest,
  type CozyParseResult,
} from 'cozy-iiif';

export interface UseIIIFOptions {
  authToken?: string;
}

/**
 * Core IIIF resolution hook, shared by the Recogito client and plugins.
 *
 * Given a resolved URL, uses cozy-iiif to identify and parse the resource
 * (Presentation manifest, single IIIF Image API resource, or a plain image)
 * and exposes the parsed cozy-iiif model, plus canvas navigation.
 */
export const useIIIF = (url?: string, options: UseIIIFOptions = {}) => {
  const { authToken } = options;

  const [result, setResult] = useState<CozyParseResult | undefined>();

  const [manifest, setManifest] = useState<CozyManifest | undefined>();

  const [image, setImage] = useState<CozyImageResource | undefined>();

  const [canvases, setCanvases] = useState<CozyCanvas[]>([]);

  const [currentCanvas, setCurrentCanvas] = useState<CozyCanvas | undefined>();

  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    // Reset on every URL/token change
    setResult(undefined);
    setManifest(undefined);
    setImage(undefined);
    setCanvases([]);
    setCurrentCanvas(undefined);
    setError(undefined);

    if (!url) return;

    let cancelled = false;

    const resolve = async (): Promise<CozyParseResult> => {
      if (authToken) {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!res.ok)
          throw new Error(`Image request failed: ${res.status}`);
        return Cozy.parse(await res.json(), url);
      }

      return Cozy.parseURL(url);
    };

    resolve()
      .then((parsed) => {
        if (cancelled) return;

        setResult(parsed);

        if (parsed.type === 'manifest') {
          setManifest(parsed.resource);
          setCanvases(parsed.resource.canvases);
          setCurrentCanvas(parsed.resource.canvases[0]);
        } else if (parsed.type === 'iiif-image') {
          setImage(parsed.resource);
        } else if (parsed.type === 'plain-image') {
          // No cozy resource model for plain images; URL is on `result`
        } else if (parsed.type === 'error') {
          setError(parsed.message);
        } else {
          setError(`Unsupported IIIF resource: ${parsed.type}`);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to load IIIF resource', err);
        setError(`Failed to load IIIF resource: ${url}`);
      });

    return () => {
      cancelled = true;
    };
  }, [url, authToken]);

  const isPresentationManifest = Boolean(manifest);

  const isImageManifest = Boolean(image);

  const currentImage: CozyImageResource | undefined =
    currentCanvas?.images[0] ?? image;

  const next = () => {
    if (!currentCanvas || canvases.length === 0) return;

    const idx = canvases.findIndex((c) => c.id === currentCanvas.id);
    const nextIdx = Math.min(idx + 1, canvases.length - 1);

    setCurrentCanvas(canvases[nextIdx]);
  };

  const previous = () => {
    if (!currentCanvas || canvases.length === 0) return;

    const idx = canvases.findIndex((c) => c.id === currentCanvas.id);
    const prevIdx = Math.max(0, idx - 1);

    setCurrentCanvas(canvases[prevIdx]);
  };

  return {
    result,
    manifest,
    image,
    canvases,
    currentCanvas,
    currentImage,
    isPresentationManifest,
    isImageManifest,
    error,
    next,
    previous,
    setCurrentCanvas,
  };
};
