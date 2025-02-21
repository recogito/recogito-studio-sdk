import type { Extension } from './Extension';

export interface ExtensionComponentProps {

  extension: Extension;

}

export interface AdminExtensionComponentProps extends ExtensionComponentProps {

  onChangeUserSettings(settings: any): void;

}
