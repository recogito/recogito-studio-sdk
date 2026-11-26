// Base extension type - name and extension_point
// 
// Note: distributes over unions: Ext<'a' | 'b'> = Ext<'a'> | Ext<'b'> - this
// is needed for Extract/ExtensionFor below.
export type Ext<P extends string> = P extends string
  ? { name: string; extension_point: P }
  : never;

// Base "component extension": provides a React component
export type ComponentExt<
  P extends string, 
  Options extends JsonObject = {}
> = Ext<P> & { 
  // See `ExtensionComponent.ts` for component APIs
  component_name: string;
} & Options;

// Base "configuration extension": just provide custom config information
export type ConfigurationExt<
  P extends string, 
  Options extends JsonObject = {}
> = Ext<P> & {
  component_name?: never;
} & Options;

// Extension options can carry only JSON-serializable values
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | JsonObject;
type JsonObject = { [key: string]: JsonValue | undefined };

// Complete list of supported Component- and Configuration-Extensions
export type ComponentExtension =
  | AdminExtension
  | ProjectDocumentActionsExtension
  | AnnotationViewExtension;

export type ConfigurationExtension = 
  | ProjectDocumentDefaultViewExtension;

// Helper types for external use
export type Extension = ComponentExtension | ConfigurationExtension;
export type ExtensionPoint = Extension['extension_point'];
export type ExtensionFor<P extends ExtensionPoint> = Extract<Extension, { extension_point: P }>;

/*************************************************/
/*  Plugin administration screen - every         */
/*  plugin that needs to offer configuration     */
/*  options to the user implements this          */
/*  extension point.                             */
/*************************************************/

export type AdminExtension = ComponentExt<'admin'>;


/*************************************************/
/*  Extension points on the project home screen  */
/*************************************************/

// Add menu items to the document '...' context menu
export type ProjectDocumentActionsExtension = ComponentExt<'project:document-actions'>; 

// Override the URL that opens when the user clicks the project card
export type ProjectDocumentDefaultViewExtension = ConfigurationExt<'project:document-default-view', {
  foo: string,
  bar: string
}>

/*************************************************/
/*  Image and text annotation view               */
/*************************************************/
type AnnotationViewType = 'image' | 'text' | '*';
type AnnotationViewPoint = 'annotation-editor' | 'annotator' | 'toolbar' | 'taglist';

export type AnnotationViewExtension = 
  ComponentExt<`annotation:${AnnotationViewType}:${AnnotationViewPoint}`>;
