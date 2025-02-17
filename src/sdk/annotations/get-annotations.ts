import type { SupabaseClient } from '@supabase/supabase-js';
import type { User } from '@annotorious/annotorious';
import type { SupabaseAnnotation, SupabaseAnnotationBody, SupabaseAnnotationTarget } from '../../core';
import { Visibility } from '../../core';

type UserRecord = {
  id: string, 
  nickname?: string, 
  first_name?: string, 
  last_name?: string, 
  avatar_url?: string
}

type TargetRecord = {
  annotation_id: string, 
  created_at?: string, 
  created_by?: UserRecord, 
  updated_at?: string, 
  updated_by?: UserRecord, 
  value: string
}

type BodyRecord = {
  id: string, 
  annotation_id: string, 
  created_by?: UserRecord, 
  created_at?: string, 
  updated_by?: UserRecord, 
  updated_at?: string, 
  version?: number,
  format?: string, 
  purpose?: string, 
  value: string 
}

const crosswalkUser = (arg: UserRecord): User => ({
  id: arg.id,
  name: arg.nickname 
    ? arg.nickname 
    : arg.first_name || arg.last_name 
      ? [arg.first_name, arg.last_name].join(' ') : 'Anonymous',
  avatar: arg.avatar_url
});

const crosswalkTarget = (arg: TargetRecord): SupabaseAnnotationTarget => ({
  annotation: arg.annotation_id,
  selector: JSON.parse(arg.value),
  created: arg.created_at ? new Date(arg.created_at) : undefined,
  creator: arg.created_by ? crosswalkUser(arg.created_by) : undefined,
  updated: arg.updated_at ? new Date(arg.updated_at) : undefined,
  updatedBy: arg.updated_by ? crosswalkUser(arg.updated_by) : undefined
});

const crosswalkBody = (arg: BodyRecord): SupabaseAnnotationBody => ({
  id: arg.id,
  annotation: arg.annotation_id,
  created: arg.created_at ? new Date(arg.created_at) : undefined,
  creator: arg.created_by ? crosswalkUser(arg.created_by) : undefined,
  updated: arg.updated_at ? new Date(arg.updated_at) : undefined,
  updatedBy: arg.updated_by ? crosswalkUser(arg.updated_by) : undefined,
  format: arg.format,
  purpose: arg.purpose, 
  value: arg.value,
  version: arg.version
});

const crosswalkAnnotation = (data: any) => {
  const { created_at, updated_at, is_private, targets, bodies, ...annotation } = data;
  return {
    ...annotation,
    created_at: created_at ? new Date(created_at) : undefined,
    updated_at: created_at ? new Date(created_at) : undefined,
    visibility: is_private ? Visibility.PRIVATE : undefined,
    target: crosswalkTarget(targets[0]),
    bodies: bodies.map(crosswalkBody)
  } as SupabaseAnnotation;
}

const SELECT_STATEMENT = `
  id,
  created_at,
  layer_id,
  is_private,
  targets ( 
    annotation_id,
    created_at,
    created_by:profiles!targets_created_by_fkey(
      id,
      nickname,
      first_name,
      last_name,
      avatar_url
    ),
    updated_at,
    updated_by:profiles!targets_updated_by_fkey(
      id,
      nickname,
      first_name,
      last_name,
      avatar_url
    ),
    version,
    value
  ),
  bodies ( 
    id,
    annotation_id,
    created_at,
    created_by:profiles!bodies_created_by_fkey(
      id,
      nickname,
      first_name,
      last_name,
      avatar_url
    ),
    updated_at,
    updated_by:profiles!bodies_updated_by_fkey(
      id,
      nickname,
      first_name,
      last_name,
      avatar_url
    ),
    version,
    format,
    purpose,
    value
  )`;

export const getAnnotations = (
  supabase: SupabaseClient
) => (
  layerIds: string | string[]
) => {

  const query =supabase
    .from('annotations')
    .select(SELECT_STATEMENT)
    .not('targets', 'is', null);

  const p = Array.isArray(layerIds)
    ? query.in('layer_id', layerIds)
    : query.eq('layer_id', layerIds);

  return p.then(({ data, error }) => {
    if (error) return { data, error };

    return { error, data:data.map(crosswalkAnnotation) };
  });
}