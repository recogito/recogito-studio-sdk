import type { AuthError, PostgrestError, SupabaseClient, User } from '@supabase/supabase-js';
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

/** 
 * Supabase recommends against using auth.getSession() to grab the user. It will raise the 
 * following warning:
 * 
 *   "Using the user object as returned from supabase.auth.getSession() or from some 
 *   supabase.auth.onAuthStateChange() events could be insecure! This value comes directly 
 *   from the storage medium (usually cookies on the server) and may not be authentic. 
 *   Use supabase.auth.getUser() instead which authenticates the data by contacting the 
 *   Supabase Auth server."
 * 
 * Therfore, we use this helper function.
 */
const getUser = (supabase: SupabaseClient): Promise<User> =>
  supabase.auth.getSession().then(({ error, data }) => {
    if (error || !data?.session) {
      throw error || 'Unauthorized';
    } else {
      return supabase.auth.getUser().then(({ error, data }) => {
        if (error) {
          throw error;
        } else if (!data.user) {
          throw 'Unauthorized';
        } else if (data.user.role !== 'authenticated') {
          throw 'Unauthorized';
        } else {
          return data.user;
        }
      });
    }
  });

export const getMyProfile = (
  supabase: SupabaseClient
) => (): PromiseLike<{ error: AuthError | PostgrestError | null, data: MyProfile }> =>
  getUser(supabase).then(user =>
    supabase
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
      }));