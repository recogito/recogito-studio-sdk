import type { SupabaseClient } from '@supabase/supabase-js';
import type { VocabularyTerm } from '../../core';

export const getProjectTagVocabulary =
  (supabase: SupabaseClient) => (projectId: string) =>
    supabase
      .from('tag_definitions')
      .select(
        `
        id,
        name,
        target_type,
        scope,
        scope_id,
        metadata
      `
      )
      .match({ scope: 'project', scope_id: projectId })
      .then(({ error, data }) => {
        if (error || !data) {
          return { error, data: [] as VocabularyTerm[] };
        }

        return {
          error,
          data: data.map(
            (def) =>
              ({
                label: def.name,
                color: def.metadata?.color,
                id: def.metadata?.id,
              } as VocabularyTerm)
          ),
        };
      });
