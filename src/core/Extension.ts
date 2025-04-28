export interface Extension {

  name: string;

  extension_point: ExtensionPoint;

  component_name: string;

}

type AnnotationViewType = 'image' | 'text' | '*';
type AnnotationViewExtensionPoint = 
  | `annotation:${AnnotationViewType}:annotation-editor`
  | `annotation:${AnnotationViewType}:annotator`
  | `annotation:${AnnotationViewType}:toolbar`

type ProjectExtensionPoint = 'project:document-actions';

export type ExtensionPoint = 
  | 'admin' 
  | AnnotationViewExtensionPoint 
  | ProjectExtensionPoint;
