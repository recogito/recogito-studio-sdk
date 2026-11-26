import type { Annotation, Annotator, PresentUser, User } from '@annotorious/annotorious';
import type { Context } from './Context';
import type { Document } from './Document';
import type { Extension } from './Extension';
import type { Layer } from './Layer';
import type { Plugin } from './Plugin';
import type { SupabaseAnnotation } from './SupbaseAnnotation';

export interface ExtensionComponentProps<T extends unknown = any> {

  extension: Extension;

  plugin: Plugin;

  settings?: T;

}

/*************************************************/
/*  Plugin administration screen                 */
/*************************************************/

export interface AdminExtensionProps<T extends unknown = any> extends ExtensionComponentProps<T> {

  onChangeUserSettings(settings: T): void;

}

/*************************************************/
/*  Extension points on the project home screen  */
/*************************************************/

export interface DocumentCardActionsExtensionProps<T extends unknown = any> extends ExtensionComponentProps<T> {

  document: Document;

  projectId: string;

  context: Context;

  closeDialog(): void;

}

/*************************************************/
/*  Image and text annotation view               */
/*************************************************/

export interface AnnotatorExtensionProps<A extends Annotation, T extends unknown = any> extends ExtensionComponentProps<T> {

  anno: Annotator<A>;

}

export interface AnnotationEditorExtensionProps<T extends unknown = any> extends ExtensionComponentProps<T> {

  annotation: SupabaseAnnotation;

  isReadOnly: boolean;

  isSelected: boolean;

  layers?: Layer[];

  me: User | PresentUser;

  onUpdateAnnotation(updated: SupabaseAnnotation): void

}

export interface AnnotationToolbarExtensionProps<T extends unknown = any> extends ExtensionComponentProps<T> {

  document: Document;

}