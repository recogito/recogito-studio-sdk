import type { SupabaseClient } from '@supabase/supabase-js';
import type { DocumentLayer } from '../../core';

const SELECT_STATEMENT = `
  id, 
  document_id,
  document:documents (
    *
  ),
  project_id, 
  name,
  description,
  contexts:layer_contexts!inner (
    ...contexts!inner (
      id,
      name,  
      project_id
    )
  )`;

const flattenLayerResponse = (data?: any[] | null) => {
  const flattened = data?.map(({ contexts, ...layer }) => ({
    ...layer,
    context: contexts[0],
  }));

  return flattened as unknown as DocumentLayer[];
}

export const getLayersInProject = (
  supabase: SupabaseClient
) => (
  projectId: string
) =>
  supabase
    .from('layers')
    .select(SELECT_STATEMENT)
    .eq('project_id', projectId)
    .then(({ data, error }) => ({ error, data: flattenLayerResponse(data) }));

export const getLayersInContext = (
  supabase: SupabaseClient
) => (
  contextId: string
) =>
  supabase
    .from('layers')
    .select(SELECT_STATEMENT)
    .eq('contexts.context_id', contextId)
    .then(({ data, error }) => ({ error, data: flattenLayerResponse(data) }));

export const getDocumentLayersInProject = (
  supabase: SupabaseClient
) => (
  documentId: string,
  projectId: string
) =>
  supabase
    .from('layers')
    .select(SELECT_STATEMENT)
    .eq('project_id', projectId)
    .eq('document_id', documentId)
    .then(({ data, error }) => ({ error, data: flattenLayerResponse(data) }));

export const getDocumentLayersInContext = (
  supabase: SupabaseClient
) => (
  documentId: string,
  contextId: string
) =>
  supabase
    .from('layers')
    .select(SELECT_STATEMENT)
    .eq('document_id', documentId)
    .eq('contexts.context_id', contextId)
    .then(({ data, error }) => ({ error, data: flattenLayerResponse(data) }));