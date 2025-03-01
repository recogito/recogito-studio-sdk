import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import type { Plugin } from './core';

const GENERATED_DIR = 'src/plugins/generated';

export const registerPlugin = (plugin: Plugin, config: any, logger: any) => {
  logger.info(`Registering plugin: ${plugin.name}`);
  
  const extensions = plugin.extensions || [];
  extensions.forEach(e => 
    logger.info(`  ${e.module_name}:${e.name}`));
  
  const registryDir = path.join(url.fileURLToPath(config.root), GENERATED_DIR);
  const registryFile = path.join(registryDir, 'registered.json');
  
  // Create registry dir if it doesn't exist
  fs.mkdirSync(registryDir, { recursive: true });

  let registry: Plugin[] = [];
  try {
    registry = JSON.parse(fs.readFileSync(registryFile, 'utf-8'));
  } catch (e) {
    // File doesn't exist yet - start empty
  }

  const other = registry.filter(other => !(other.name === plugin.name));
  other.push(plugin);

  // Write re-exports for dynamic import of extensions
  extensions.forEach(e => {
    const src = 
      `/** auto-generated by @recogito/studio-sdk **/\n` +
      `import { ${e.component_name} } from '${e.module_name}/${e.component_name}';\n` + 
      `export default ${e.component_name}\n`;

    fs.writeFileSync(`${GENERATED_DIR}/${e.component_name}.ts`, src, { encoding: 'utf8' })
  });

  // Write registry
  fs.writeFileSync(registryFile, JSON.stringify(other, null, 2));
}