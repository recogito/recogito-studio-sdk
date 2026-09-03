import { useEffect, useState, type ReactNode } from 'react';
import { useAuthImageSrc } from './useAuthImageSrc';

export interface IIIFThumbnailProps {
  url?: string;

  authToken?: string;

  alt?: string;

  className?: string;

  fallback?: ReactNode;
}

export const IIIFThumbnail = (props: IIIFThumbnailProps) => {
  const { src, loading, error } = useAuthImageSrc(props.url, props.authToken);

  const [imgError, setImgError] = useState(false);

  useEffect(() => setImgError(false), [src]);

  if (!props.url || loading || error || imgError || !src) {
    return <>{props.fallback ?? null}</>;
  }

  return (
    <img
      src={src}
      alt={props.alt ?? ''}
      className={props.className}
      loading="lazy"
      onError={() => setImgError(true)}
    />
  );
};
