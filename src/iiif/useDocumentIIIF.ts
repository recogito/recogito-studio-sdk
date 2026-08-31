import { useEffect, useState } from 'react';
import { useIIIF } from './useIIIF';

export interface DocumentIIIFSource {
  id: string;
  content_type?: string;
  meta_data?: { url?: string };
}

export interface DocumentIIIFConfig {
  /**
   * Base URL of Recogito's built-in IIIF (Cantaloupe) server. Locally-uploaded
   * images are served from `${cantaloupePath}/${document.id}/info.json`.
   */
  cantaloupePath?: string;

  /**
   * Returns the current access token, used to authenticate tile requests for
   * uploaded images.
   */
  getAccessToken?: () => Promise<string | undefined>;
}

/**
 * Resolves a document's IIIF source.
 *
 * Remote IIIF documents use their `meta_data.url` directly. Locally-uploaded
 * images (`content_type` `image/*`) are served via the built-in IIIF server and
 * need an auth token, which is fetched before the URL is exposed.
 */
export const useDocumentIIIF = (
  document: DocumentIIIFSource,
  config: DocumentIIIFConfig = {}
) => {
  const { cantaloupePath, getAccessToken } = config;

  const [resolvedUrl, setResolvedUrl] = useState<string | undefined>();

  const [authToken, setAuthToken] = useState<string | undefined>();

  useEffect(() => {
    const isUploadedFile = document.content_type?.startsWith('image/');

    if (isUploadedFile) {
      // Locally uploaded image - served via the built-in IIIF server, and
      // (for private documents) behind auth, so fetch the token first
      const url = `${cantaloupePath}/${document.id}/info.json`;

      if (getAccessToken) {
        getAccessToken().then((token) => {
          setAuthToken(token);
          setResolvedUrl(url);
        });
      } else {
        setResolvedUrl(url);
      }
    } else {
      const url = document.meta_data?.url;
      if (!url)
        console.error('Could not resolve IIIF URL for document', document);
      setResolvedUrl(url);
    }
  }, [document, cantaloupePath]);

  const iiif = useIIIF(resolvedUrl);

  return { ...iiif, authToken };
};
