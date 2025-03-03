export interface InstalledPlugin {

  id: string;

  created_at: string;

  created_by?: string;

  updated_at?: string;

  updated_by?: string;

  project_id: string;

  plugin_name: string;

  plugin_settings?: any;
  
}