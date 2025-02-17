import type { AuthError, PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import type { MyProfile } from '../../core';

const SELECT_PROFILE = `
  id,
  created_at,
  nickname,
  first_name,   
  last_name,
  avatar_url,
  group_users!group_users_user_id_fkey(
    group_type,
    type_id
  )`;

const SELECT_ORG_GROUPS = `
  id,
  name,
  description,
  is_admin`;

export const getMyProfile = (
  supabase: SupabaseClient
) => (): PromiseLike<{ error: AuthError | PostgrestError | null, data: MyProfile }> =>
  supabase.auth.getSession().then(({ error, data }) => {
    if (error || !data?.session?.user) {
      return { error, data: undefined as unknown as MyProfile };
    } else {
      const { user } = data.session;

      return supabase
        .from('profiles')
        .select(SELECT_PROFILE)
        .eq('id', user.id)
        .eq('group_users.group_type', 'organization')
        .single()
        .then(({ error, data }) => {
          if (error || !data) return { error, data: undefined as unknown as MyProfile };

          // Keep profile fields + add email
          const { group_users, ...profile } = { ...data, email: user.email };

          return supabase 
            .from('organization_groups')
            .select(SELECT_ORG_GROUPS)
            .in('id', data.group_users.map(r => r.type_id))
            .then(({ error , data }) => {
              if (error || !data) return { error, data: undefined as unknown as MyProfile };

              const myProfile = {
                ...profile,
                isOrgAdmin: data.some((r) => r.is_admin === true),
              } as MyProfile;

              return { error, data: myProfile };
            });
        })
    }
  });