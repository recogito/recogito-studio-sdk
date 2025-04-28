export interface Document {

  id: string;

  created_at?: string;

  created_by?: string;

  updated_at?: string;

  updated_by?: string;

  name: string;

  bucket_id?: string;

  content_type?: ContentType;

  is_private?: boolean;

  collection_id?: string;

  meta_data?: {

    protocol: Protocol;

    url: string;

    meta?: { label: string, value: string }[];

  };

  collection_metadata?: {

    revision_number: number;

    document_id: string;
    
  };
}

export const ContentTypes = [
  'application/pdf',
  'text/plain',
  'text/xml',
] as const;

export type ContentType = (typeof ContentTypes)[number] | string;

export const Protocols = ['IIIF_IMAGE', 'IIIF_PRESENTATION'] as const;

export type Protocol = (typeof Protocols)[number];

export interface DocumentContext {

  id: string;

  name?: string;

  description?: string;

  project_id: string;

  is_project_default?: boolean;

  project_is_locked?: boolean;

}