import type { Plugin } from './Plugin';
import type { InstalledPlugin } from './InstalledPlugin';

export interface PluginInstallationConfig {

  plugin: Plugin;

  settings: InstalledPlugin;

}