import type { Annotation, AnnotationBody } from '@annotorious/react';
import type { SupabaseAnnotation } from '../SupbaseAnnotation';
import type { VocabularyTerm } from '../VocabularyTerm';

export const parseTagBody = (
  body: AnnotationBody
): VocabularyTerm | undefined => {
  if (!body.value) return undefined;

  // For backwards-compatibility: support object and string tags
  if (body.value.startsWith('{')) {
    try {
      return JSON.parse(body.value) as VocabularyTerm;
    } catch {
      return { label: body.value };
    }
  }

  return { label: body.value };
};

export const getTags = (annotation: Annotation): VocabularyTerm[] =>
  (annotation.bodies || [])
    .filter((b) => b.purpose === 'tagging')
    .map(parseTagBody)
    .filter((t): t is VocabularyTerm => Boolean(t));

/** Determines the list of unique tags in the given annotation list **/
export const enumerateTags = (
  annotations: SupabaseAnnotation[],
  visibleLayers?: string[]
): VocabularyTerm[] => {
  const layerIds = visibleLayers ? new Set(visibleLayers) : undefined;

  return annotations
    .reduce<AnnotationBody[]>((enumerated, annotation) => {
      // If there is a layer filter, ignore annotations outside of visible layers
      if (layerIds && annotation.layer_id && !layerIds.has(annotation.layer_id))
        return enumerated;

      const tags = annotation.bodies.filter((b) => b.purpose === 'tagging');
      return [...enumerated, ...tags];
    }, [])
    .sort((a, b) => (a.created! > b.created! ? 1 : -1))
    .reduce<VocabularyTerm[]>((firstOccurrences, body) => {
      const tag = parseTagBody(body);
      if (!tag) return firstOccurrences;

      const key = tag.id || tag.label;
      const exists = firstOccurrences.some((t) => (t.id || t.label) === key);
      return exists ? firstOccurrences : [...firstOccurrences, tag];
    }, []);
};
