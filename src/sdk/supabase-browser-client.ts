import type { SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Not ideal but prevents the browser client from being generated on the server
export const createSupabaseBrowserClient = (
  config: {
    supabaseServerUrl: string;
    supabaseAPIKey: string;
  }
): SupabaseClient | undefined =>
  typeof window === 'undefined' 
    ? undefined 
    : createBrowserClient(config.supabaseServerUrl, config.supabaseAPIKey);
