import type { Extension } from './Extension';
import type { Plugin } from './Plugin';

export interface ExtensionComponentProps<T extends unknown = any> {

  extension: Extension;

  plugin: Plugin;

  settings?: T;

}

export interface AdminExtensionComponentProps extends ExtensionComponentProps {

  onChangeUserSettings(settings: any): void;

}
