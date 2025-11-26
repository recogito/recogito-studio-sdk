import type { SupabaseClient } from '@supabase/supabase-js';
import { type Context } from '../../core';

export const getContext = (
  supabase: SupabaseClient
) => (
  projectId: string
) => supabase
  .from('contexts')
  .select(`
    id,
    name,
    project_id
  `)
  .eq('id', projectId)
  .single()
  .then(({ error, data }) =>{ 
  if (error || !data) return { error, data: undefined };
  return { error, data: data as Context };
});
