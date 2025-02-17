export interface UserProfile {

  id: string;

  nickname?: string;

  first_name?: string;

  last_name?: string;

  avatar_url?: string;

}

export interface MyProfile extends UserProfile {

  created_at: string;

  email: string;

  isOrgAdmin: boolean;

}