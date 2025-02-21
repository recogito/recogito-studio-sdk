import type { Extension } from './Extension';
import type { Plugin } from './Plugin';
import type { VocabularyTerm } from './VocabularyTerm';

export interface ExtensionComponentProps<T extends unknown = any> {

  extension: Extension;

  plugin: Plugin;

  settings?: T;

}

export interface AdminExtensionExtensionProps<T extends unknown = any> extends ExtensionComponentProps<T> {

  onChangeUserSettings(settings: any): void;

}

export interface TagAutosuggestExtensionProps<T extends unknown = any> extends ExtensionComponentProps<T> {

  autoFocus?: boolean;

  autoSize?: boolean;

  value?: VocabularyTerm;

  onChange(term: VocabularyTerm): void;

  onSubmit(term: VocabularyTerm): void;

}
