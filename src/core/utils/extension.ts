import type { ExtensionPoint } from '../Extension';

/**
 * Tests if a specific pattern matches an existing Recogito
 * extensions point name.
 */
export const matchesExtensionPoint = (pattern: string, extensionPoint: ExtensionPoint) => {
  const patternSegments = pattern.split(/[\.,:]+/);

  const epSegments = extensionPoint.split(/[\.,:]+/);

  if (patternSegments.length > epSegments.length)
    return false; // the pattern is more specific than the extension point

  for (let i = 0; i < patternSegments.length; i++) {
    if (epSegments[i] !== '*' 
      && patternSegments[i] !== '*' 
      && patternSegments[i] !== epSegments[i]) { 
        // Segment doesn't match
        return false; 
    }
  }

  return true; // All segments match
}

/**
 * Fills a template string that conforms to the shape of 
 * the `project:document-default-view` extension's `route_template` 
 * field.
 * 
 * Example: '/{lang}/annotate-metaphor/{contextId}/{documentId}/'
 */
export const fillTemplateString = (template: string, values: Record<string, string>) => {
  // Extract all keys from the template string ('lang', 'contextId', etc.)
  const templateKeysMatch = template.match(/\{([^}]+)\}/g) || [];
  const templateKeys = templateKeysMatch.map(match => match.slice(1, -1));
  
  const valueKeys = Object.keys(values);
  const valueKeysSet = new Set(valueKeys);

  // Warn if the template string contains a key that the extension point doesn't provide
  templateKeys.forEach(key => {
    if (!valueKeysSet.has(key))
      console.warn(`[fillTemplateString] '${key}' in template string is not provided by extension point.`);
  });

  return Object.entries(values).reduce((str, [key, value]) => (
    str.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  ), template);
}

/**
 * Matches a string against a list of content types, conforming to the 
 * shape of the `project:document-default-view` extension's `allowed` field.
 */
export const matchesContentTypes = (contentType: string, patterns: string[]): boolean => 
  patterns.some(pattern => {
    if (pattern.endsWith('/*')) {
      const prefix = pattern.slice(0, -1);
      return contentType.startsWith(prefix);
    }

    return pattern === contentType;
  });

