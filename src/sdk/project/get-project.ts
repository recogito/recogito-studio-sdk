import type { SupabaseClient } from '@supabase/supabase-js';
import { type Project } from '../../core';

export const getProject = (
  supabase: SupabaseClient
) => (
  projectId: string
) => supabase
  .from('projects')
  .select(`
    id,
    name
  `)
  .eq('id', projectId)
  .single()
  .then(({ error, data }) =>{ 
  if (error || !data) return { error, data: undefined };
  return { error, data: data as Project };
});
