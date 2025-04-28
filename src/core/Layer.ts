import type { DocumentContext } from './Document';

export interface DocumentLayer {

  id: string;

  is_active?: boolean;

  document: Document;

  project_id: string;

  name?: string;

  context?: DocumentContext;

}

export interface EmbeddedLayer {

  id: string;

  name?: string;

  is_active?: boolean;
  
}

export type Layer = DocumentLayer | EmbeddedLayer;