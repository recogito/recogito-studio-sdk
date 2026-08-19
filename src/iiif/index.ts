export * from './getImageURL';
export * from './getResourceLabel';
export * from './sanitizeManifest';
export * from './useIIIF';

// Re-export allmaps types, so consumers share a single type identity
export type {
  Canvas,
  LanguageString,
  Manifest,
  Metadata,
} from '@allmaps/iiif-parser';
