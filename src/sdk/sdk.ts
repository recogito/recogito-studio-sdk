import { createSupabaseServerClient } from './supabase-server-client';
import { createSupabaseBrowserClient } from './supabase-browser-client';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getAnnotations } from './annotations';
import { getDocument } from './documents';
import { getMyProfile } from './profile';
import { hasSelectPermissions } from './project';
import { 
  getDocumentLayersInContext, 
  getDocumentLayersInProject, 
  getLayersInContext, 
  getLayersInProject 
} from './layers';
const createSDK = (supabase: SupabaseClient) => ({
  annotations: {
    get: getAnnotations(supabase)
  },

  documents: {
    get: getDocument(supabase)
  },

  layers: {
    getLayersInContext: getLayersInContext(supabase),
    getLayersInProject: getLayersInProject(supabase),
    getDocumentLayersInContext: getDocumentLayersInContext(supabase),
    getDocumentLayersInProject: getDocumentLayersInProject(supabase)
  },

  profile: {
    getMyProfile: getMyProfile(supabase)
  },

  project: {
    hasSelectPermissions: hasSelectPermissions(supabase)
  },

  supabase,

  storage: supabase.storage
});

const parseEnv = (env: ImportMetaEnv) => {
  const {
    SUPABASE_SERVERCLIENT_URL,
    PUBLIC_SUPABASE,
    PUBLIC_SUPABASE_API_KEY
  } = env;
  return {
    supabaseServerUrl: SUPABASE_SERVERCLIENT_URL || PUBLIC_SUPABASE,
    supabaseAPIKey: PUBLIC_SUPABASE_API_KEY
  };
};

export const createServerSDK = (
  request: Request,
  cookies: any,
  env: ImportMetaEnv
) => {
  const supabase = createSupabaseServerClient(request, cookies, parseEnv(env));
  return supabase.then((supabase) => createSDK(supabase));
};

export const createBrowserSDK = (env: ImportMetaEnv) => {
  const supabase = createSupabaseBrowserClient(parseEnv(env));
  if (!supabase) return;
  return createSDK(supabase);
};
