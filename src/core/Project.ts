// Whether the right panel starts open when a document is opened, and on which tab
export type DocumentViewRight = 'closed' | 'annotations' | 'notes';

export interface Project {

  id: string;

  document_view_right?: DocumentViewRight | null;

  is_locked?: boolean;

  name: string;
  
}
