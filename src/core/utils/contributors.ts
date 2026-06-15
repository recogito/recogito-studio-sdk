import type { PresentUser, User } from '@annotorious/react';
import type { SupabaseAnnotation } from '../SupbaseAnnotation';

/** Determines the creator of the annotation by the target, or the first body **/
export const getContributors = (annotation: SupabaseAnnotation): User[] => {
  const contributors: User[] = [
    annotation.target.creator!,
    ...annotation.bodies.map((b) => b.creator!),
  ].filter(Boolean); // Remove undefined

  // De-duplicate
  return contributors.reduce<User[]>(
    (unique, user) =>
      unique.some((u) => u.id === user.id) ? unique : [...unique, user],
    []
  );
};

/** Determines the list of unique contributors in the given annotation list */
export const enumerateContributors = (
  present: PresentUser[],
  annotations: SupabaseAnnotation[],
  visibleLayers?: string[]
): User[] => {
  const layerIds = visibleLayers ? new Set(visibleLayers) : undefined;

  const users = annotations.reduce<User[]>((enumerated, a) => {
    // If there is a layer filter, ignore annotations outside of visible layers
    if (layerIds && a.layer_id && !layerIds.has(a.layer_id)) return enumerated;

    const contributors: User[] = [
      a.target.creator!,
      ...a.bodies.map((b) => b.creator!),
    ].filter(Boolean); // Remove undefined

    return [...enumerated, ...contributors].reduce<User[]>(
      (unique, user) => ( // De-duplicate
        unique.some((u) => u.id === user.id) ? unique : [...unique, user]
      ),
      []
    );
  }, []);

  return users.map((u) => {
    const presentUser = present.find((p) => p.id === u.id);
    return presentUser ? presentUser : u;
  });
};
