import type { SupabaseClient } from '@supabase/supabase-js';
import { parsePolicies, type MyProfile } from '../../core';

const getProjectPolicies = (
  supabase: SupabaseClient
) => (
  projectId: string
) => supabase
  .rpc('get_project_policies', { _project_id: projectId })
  .then(({ error, data}) => {
    if (error || !data) return { error, data: undefined };
    return { error, data: parsePolicies(data) }
  });

export const hasSelectPermissions = (
  supabase: SupabaseClient
) => (
  profile: MyProfile,
  projectId: string
) =>
  getProjectPolicies(supabase)(projectId).then(({ error, data }) => {
    if (error || !data) return false;
    return data.get('project_documents').has('SELECT') || profile.isOrgAdmin;
  });