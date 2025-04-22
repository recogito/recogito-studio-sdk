import type { Extension } from './Extension';

export interface Plugin<T extends unknown = any> {

  name: string;

  module_name: string;

  description: string;

  author: string;

  homepage: string;

  extensions?: Extension[];

  thumbnail?: string;

  options?: T;

}