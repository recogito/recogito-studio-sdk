import { useEffect, useState } from 'react';

export interface AuthImageState {
  src?: string;

  loading: boolean;

  error: boolean;
}

/**
 * Resolves an `<img>` src for a possibly auth-protected image.
 *
 * Public images (no `authToken`) return the URL directly.
 *
 * Auth-protected images are fetched as a blob with an `Authorization` header
 * and exposed as an object URL that is revoked on cleanup.
 */
export const useAuthImageSrc = (
  url?: string,
  authToken?: string,
): AuthImageState => {
  const [blobURL, setBlobURL] = useState<string | undefined>();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    setBlobURL(undefined);

    if (!url || !authToken) {
      setLoading(false);
      return;
    }

    setLoading(true);

    let objectURL: string | undefined;
    let cancelled = false;

    fetch(url, { headers: { Authorization: `Bearer ${authToken}` } })
      .then((res) => {
        if (!res.ok) throw new Error(`Image request failed: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        objectURL = URL.createObjectURL(blob);
        setBlobURL(objectURL);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      if (objectURL) URL.revokeObjectURL(objectURL);
    };
  }, [url, authToken]);

  return {
    src: authToken ? blobURL : url,
    loading,
    error,
  };
};
