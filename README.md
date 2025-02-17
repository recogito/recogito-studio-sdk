# Recogito Studio SDK

A software development kit for developing plugins to [Recogito Studio](https://recogitostudio.org/), an open source platform for collaborative annotation of TEI, IIIF and PDF documents.

## 1. Introduction

The __Recogito Studio SDK__ is designed to facilitate plugin development for the __Recogito Studio Client application__ without the need to set up your own full-stack installation or forking the platform. It provides essential tools and abstractions to help you build useful extensions for the Recogito Studio ecosystem.

### Astro Integrations

The Recogito Studio client is an [Astro application](https://astro.build/). Recogito Studio plugins are implemented as [Astro Integrations](https://docs.astro.build/en/guides/integrations-guide/), which means they can leverage all the standard capabilities that Astro Integrations provide, plus some additional features introduced by Recogito Studio's own UI extension framework. (More on that below.)

### UI Extension Framework

Recogito Studio's built-in UI extension framework is based on [React’s lazy loading](https://react.dev/reference/react/lazy) and [Suspense](https://react.dev/reference/react/Suspense) mechanisms, and allows plugins to dynamically inject their own React components into defined __extension points__ that Recogito Studio defines.

To inject UI extensions, plugin developers must register their extensions following a specific process. This involves a small amount of boilerplate code, which the SDK helps simplify. (We’ll cover the registration process in detail in the "Plugin Anatomy" section.)

### What Plugins Can Do

With the Recogito Studio SDK, plugins can, for example:

- Extend the annotation editor with new UI elements.
- Replace existing UI elements in the editor, such as swapping the default tag widget with a custom version that integrates an external vocabulary service.
- Enhance backend capabilities, e.g. introduce new API routes that exporting annotations in different data formats.

### What Plugins CANNOT Do

Plugins are restricted to the client part of Recogito Studio. Specifically, this means __plugins can not change or add to the backend component ("Recogito Server")__. For example, it is not possible for plugins to change or add to the Supabase schema, or add additional DB or edge functions.

## 2. Getting Started

This section walks you through the development of a __Hello World__ plugin that adds a simple message to the annotation editor.

[TODO - screenshot]

### Prerequisites

Before starting, make sure you have the following installed:

- NodeJS (version 20 recommended)
- npm

### Step 1: Initialize a New Plugin Project

Create a new directory for your plugin and initialize an npm project:

```sh
mkdir hello-world-plugin
cd hello-world-plugin
npm init -y
```

Then, install TypeScript and the Recogito Studio SDK as runtime dependencies:

> __TODO/Warning:__ `@recogito/studio-sdk` is not yet published on the npm registry. Once 
that's done, the process will change, and will simply be a single `npm install typescript @recogito/studio-sdk`.

```sh
npm install typescript
npm link @recogito/studio-sdk
```

> __TODO/Warning:__ make sure you have cloned and built the SDK package locally, and  
> have run `npm link` inside the SDK folder!

#### Astro Test Application

In order to provide a convenient development environment, the SDK includes a basic Astro test application. You can use this application to preview your plugin, without having to run a full local copy of Recogito Studio. 

Set up the test application template:

```sh
npx copy-template
```

This will create a `.dev` folder in your project and copy the test application into it. We recommend adding the following to your package JSON scripts, so you can conveniently start the test application from your project using `npm run dev`:

```jsonc
{
  // ...
  "scripts": {
    "dev": "npm start --prefix .dev/",
    //...
  },

```

### Step 2: Configure TypeScript

Create a tsconfig.json file in your project root:

```json
{
  "compilerOptions": {
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "baseUrl": ".",
    "declaration": true,
    "declarationMap": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "dist",
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "ESNext",
  },
  "include": ["src", "test"],
  "exclude": ["node_modules", "dist"],
}
```

### Step 3: Create the Plugin Entry Point

Inside the `src` directory, create an `index.ts` file. This file __must have a default export__, and this default export __must export an Astro Integration.__

```ts
import type { AstroIntegration } from 'astro';

const plugin = (): AstroIntegration  => ({
  name: 'hello-world-plugin',
  hooks: {
    'astro:config:setup': ({ config, logger }) => {
      // We will later register our extension here!
    }
  }
});

export default plugin;
```

### Step 4: Configure the Test Application to Use Your Plugin 

We now need to install you plugin in the test application, so you can conveniently preview it in an actual Astro environment.

Open the `.dev/package.json` file and add your plugin as a file dependency.

```jsonc
  "dependencies": {
    "@astrojs/node": "^9.0.2",
    "@astrojs/react": "^4.2.0",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    // Add this
    "hello-world-plugin": "file:../"
  }
```

Edit the Astro configuration in `.dev/astro.config-mjs`.

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

// Add this
import HelloWorldPlugin from 'hello-world-plugin';

export default defineConfig({
  integrations: [
    react(),
    // Add this
    HelloWorldPlugin()
  ],
  devToolbar: {
    enabled: false
  },
  adapter: node({
    mode: 'standalone'
  })
});
```

Congratulations. This sets up the foundation for your plugin!

### Step 5: Create the UI Extension Component

Next we’ll add a __React component__ to add a "Hello World" message to the annotation editor. Create a new file `HelloWorldExtension.tsx` inside the `src` directory:

```tsx
export const HelloWorldExtension = () => {
  return <div>Hello World</div>;
};
```

`annotation:*:annotation-editor` extension point to display our "Hello World" message directly in the annotation
editor popup.

Next, define an `Extension` object to register this our extension component:

```ts
// index.ts
import type { AstroIntegration } from 'astro';
import { Extension, registerExtensions } from '@recogito/studio-sdk';

export const ReconciliationAutosuggestExtension: Extension = {

  name: 'hello-world-extension',

  module_name: 'recogito-hello-world-plugin',

  component_name: 'HelloWorldExtension',

  extension_point: 'annotation:*:annotation-editor'

}

const plugin = (): AstroIntegration  => ({
  name: 'hello-world-plugin',
  hooks: {
    'astro:config:setup': ({ config, logger }) => {
      registerExtensions(HelloWorldEditorMessageExtension, config, logger);
    }
  }
});

export default plugin;
```
