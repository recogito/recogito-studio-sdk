export interface DocumentLayer {

  id: string;

  is_active_layer?: boolean;

  document_id: string;

  project_id: string;

  name?: string;

  description?: string;

  context_id: string;

}

export interface EmbeddedLayer {

  id: string;

  name?: string;

  is_active?: boolean;
  
}

export type Layer = DocumentLayer | EmbeddedLayer;