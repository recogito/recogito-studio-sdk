import type { PresentUser, User } from '@annotorious/annotorious';
import type { Extension } from './Extension';
import type { Plugin } from './Plugin';
import type { SupabaseAnnotation } from './SupbaseAnnotation';
import type { VocabularyTerm } from './VocabularyTerm';
import type { Document } from './Document';

export interface ExtensionComponentProps<T extends unknown = any> {

  extension: Extension;

  plugin: Plugin;

  settings?: T;

}

export interface AdminExtensionProps<T extends unknown = any> extends ExtensionComponentProps<T> {

  onChangeUserSettings(settings: T): void;

}

export interface DocumentCardActionsExtensionProps<T extends unknown = any> extends ExtensionComponentProps<T> {

  documentId: string;

  projectId: string;

  contextId: string;

}

export interface AnnotationEditorExtensionProps<T extends unknown = any> extends ExtensionComponentProps<T> {

  annotation: SupabaseAnnotation;

  isEditable: boolean;

  isSelected: boolean;

  me: User | PresentUser;

  onUpdateAnnotation(updated: SupabaseAnnotation): void

}

export interface AnnotationToolbarExtensionProps<T extends unknown = any> extends ExtensionComponentProps<T> {

  document: Document;

}

export interface TagAutosuggestExtensionProps<T extends unknown = any> extends ExtensionComponentProps<T> {

  autoFocus?: boolean;

  autoSize?: boolean;

  value?: VocabularyTerm;

  onChange(term: VocabularyTerm): void;

  onSubmit(term: VocabularyTerm): void;

}
