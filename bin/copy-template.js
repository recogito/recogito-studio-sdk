#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Path to the template-app folder in your SDK package
  const templateAppPath = path.join(__dirname, '../dev-template');

  // Destination path in the user's project
  const destinationPath = path.join(process.cwd(), '.dev');

  // Copy the template-app folder
  fs.copySync(templateAppPath, destinationPath);

  console.log('Template app copied to ./dev');

  console.log('Installing dependencies...');
  execSync('npm install', { cwd: destinationPath, stdio: 'inherit' });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}