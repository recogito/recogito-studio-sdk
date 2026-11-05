import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import type { SupabaseAnnotationBody } from '../../core';
import { BODY_SELECT_STATEMENT, crosswalkBody } from './get-annotations';
import type { BodyRecord } from './get-annotations';

type BodyFields = {
  annotationId: string,
  layerId: string,
  purpose: string,
  value: string
}

type NewBody = BodyFields & {
  id?: string,
  expectedVersion?: undefined
}

type ExistingBody = BodyFields & {
  id: string,
  expectedVersion: number
}

export type UpsertBodyArgs = NewBody | ExistingBody;

export type UpsertBodyError = {
  code: 'VERSION_CONFLICT' | 'ALREADY_EXISTS' | 'NOT_FOUND' | 'NOT_ALLOWED',
  message: string,
  currentVersion?: number
}

export type UpsertBodyResult =
  | { data: SupabaseAnnotationBody, error: null }
  | { data: null, error: UpsertBodyError | PostgrestError };

const PG_UNIQUE_VIOLATION = '23505';
const PG_INSUFFICIENT_PRIVILEGE = '42501';

const fail = (error: UpsertBodyError | PostgrestError): UpsertBodyResult =>
  ({ data: null, error });

// Match on the constraint name in the message. Postgres omits the "Key (id)=(...)"
// details on tables with row-level security, so `details` is null for API users.
const isDuplicateId = (error: PostgrestError) =>
  error.code === PG_UNIQUE_VIOLATION && error.message.includes('"bodies_pkey"');

const failFromPostgrest = (error: PostgrestError, bodyId?: string): UpsertBodyResult => {
  if (bodyId && isDuplicateId(error))
    return fail({ code: 'ALREADY_EXISTS', message: `Body ${bodyId} already exists` });

  if (error.code === PG_INSUFFICIENT_PRIVILEGE)
    return fail({ code: 'NOT_ALLOWED', message: error.message });

  return fail(error);
}

const insertBody = (supabase: SupabaseClient, args: NewBody): PromiseLike<UpsertBodyResult> => supabase
  .from('bodies')
  .insert({
    // Leaving the ID out lets the database generate it
    ...(args.id ? { id: args.id } : {}),
    annotation_id: args.annotationId,
    layer_id: args.layerId,
    purpose: args.purpose,
    value: args.value
  })
  .select(BODY_SELECT_STATEMENT)
  .then(({ data, error }) => {
    if (error) return failFromPostgrest(error, args.id);

    // The insert went through, but the select policy hides the new row
    if (data.length === 0)
      return fail({ code: 'NOT_ALLOWED', message: 'Body was created but cannot be read back' });

    return { data: crosswalkBody(data[0] as unknown as BodyRecord), error: null };
  });

/**
 * Read the row back to determine whether it's a stale version vs. a missing body or RLS refusal.
 */
const explainNoUpdate = async (supabase: SupabaseClient, args: ExistingBody): Promise<UpsertBodyResult> => {
  const { data, error } = await supabase
    .from('bodies')
    .select('annotation_id, version')
    .eq('id', args.id)
    .maybeSingle();

  if (error) return fail(error);

  if (!data || data.annotation_id !== args.annotationId)
    return fail({ code: 'NOT_FOUND', message: `Body ${args.id} not found on annotation ${args.annotationId}` });

  if (data.version !== args.expectedVersion)
    return fail({
      code: 'VERSION_CONFLICT',
      message: `Body ${args.id} is at version ${data.version}, expected ${args.expectedVersion}`,
      currentVersion: data.version
    });

  return fail({ code: 'NOT_ALLOWED', message: `Not allowed to update body ${args.id}` });
}

const updateBody = (supabase: SupabaseClient, args: ExistingBody): PromiseLike<UpsertBodyResult> => supabase
  .from('bodies')
  .update({ purpose: args.purpose, value: args.value })
  .eq('id', args.id)
  .eq('annotation_id', args.annotationId)
  .eq('version', args.expectedVersion)
  .select(BODY_SELECT_STATEMENT)
  .then(({ data, error }) => {
    if (error) return failFromPostgrest(error, args.id);

    if (data.length === 0) return explainNoUpdate(supabase, args);

    return { data: crosswalkBody(data[0] as unknown as BodyRecord), error: null };
  });

/**
 * Creates or updates a body on an annotation.
 */
export const upsertBody = (
  supabase: SupabaseClient
) => (
  args: UpsertBodyArgs
): PromiseLike<UpsertBodyResult> => args.expectedVersion === undefined
  ? insertBody(supabase, args)
  : updateBody(supabase, args);
