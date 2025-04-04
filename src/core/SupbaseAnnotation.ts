import type { Annotation, AnnotationTarget, AnnotationBody } from '@annotorious/annotorious';

export interface SupabaseAnnotation extends Annotation {

  id: string; // Not sure why, but the ID is being picked up from the base class!?

  target: SupabaseAnnotationTarget;

  bodies: SupabaseAnnotationBody[];

  layer_id?: string;

  visibility?: Visibility;

}

export interface SupabaseAnnotationTarget extends AnnotationTarget {

  version?: number;

}

export interface SupabaseAnnotationBody extends AnnotationBody {

  format?: string;

  version?: number;

}

export type Visibility = string;

export const Visibility = (value: string) => value;

Visibility.PRIVATE = 'PRIVATE';