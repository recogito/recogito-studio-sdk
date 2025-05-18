import { SupabaseClient } from "@supabase/supabase-js";
import type { Document } from "../../core";

export const getDocument = (
  supabase: SupabaseClient
) => (
  documentId: string
) =>
  supabase
    .from('documents')
    .select(
      `
      id,
      created_at,
      created_by,
      updated_at,
      updated_by,
      name,
      bucket_id,
      content_type,
      meta_data,
      collection_id,
      collection_metadata,
      is_private
    `
    )
    .eq('id', documentId)
    .single()
    .then(({ error, data }) => ({ error, data: data as Document }));
