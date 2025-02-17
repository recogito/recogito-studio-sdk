#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');

// Path to the template-app folder in your SDK package
const templateAppPath = path.join(__dirname, '../dev-template');

// Destination path in the user's project
const destinationPath = path.join(process.cwd(), '.dev');

// Copy the template-app folder
fs.copySync(templateAppPath, destinationPath);

console.log('Template app copied to ./dev');