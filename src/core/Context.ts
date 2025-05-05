export interface Context {

  id: string;

  name: string;

  description?: string;

  project_id: string;

  is_project_default?: boolean;

  created_at: string;

  assign_all_members: boolean;

  sort: number;

  members: {

    id: string;

    user_id: string;

    user: {

      nickname: string;

      first_name: string;

      last_name: string;

      avatar_url: string;
    };

  }[];

  context_documents: {

    document: {

      id: string;

      name: string;

      content_type: string;

      meta_data: any;

      is_private: boolean;
      
    };

  }[];
}