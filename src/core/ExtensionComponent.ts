import type { Extension } from './Extension';
import type { Plugin } from './Plugin';

export interface ExtensionComponentProps<T extends unknown = any> {

  extension: Extension;

  plugin: Plugin;

  settings?: T;

}

export interface AdminExtensionComponentProps<T extends unknown = any> extends ExtensionComponentProps<T> {

  onChangeUserSettings(settings: any): void;

}
