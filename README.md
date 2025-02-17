# Recogito Studio SDK

A software development kit for developing plugins to [Recogito Studio](https://recogitostudio.org/), an open source platform for collaborative annotation of TEI, IIIF and PDF documents.

## 1. Introduction

The __Recogito Studio SDK__ is designed to facilitate plugin development for the __Recogito Studio Client application__ without the need to set up your own full-stack installation or forking the platform. It provides essential tools and abstractions to help you build useful extensions for the Recogito Studio ecosystem.

### Astro Integrations

The Recogito Studio client is built as a hybrid [Astro application](https://astro.build/) with both pre-rendered pages and SSR (Server-Side Rendering) page and API routes. Recogito Studio plugins are implemented as [Astro Integrations](https://docs.astro.build/en/guides/integrations-guide/), which means they can leverage all standard Astro Integration capabilities—plus some additional conventions introduced by Recogito Studio's own UI extension framework. (More details on plugin anatomy will be covered later.)

### UI Extension Framework

Recogito Studio's built-in UI extension framework is based on [React’s lazy loading](https://react.dev/reference/react/lazy) and [Suspense](https://react.dev/reference/react/Suspense) mechanisms, and allows plugins to dynamically add user interface elements to defined __extension points__ in the platform.

To integrate with the UI extension framework, plugin developers must register their extensions following a specific process. This involves a small amount of boilerplate code, which the SDK helps simplify. (We’ll cover the registration process in detail in the "Plugin Anatomy" section.)

### What Can Plugins Do?

With the Recogito Studio SDK, plugins can, for example:

- Extend the annotation editor with new UI elements.
- Replace existing UI elements in the editor, such as swapping the default tag widget with a custom version that integrates an external vocabulary service.
- Enhance backend capabilities, e.g. introduce new API routes that exporting annotations in different data formats.

## 2. Getting Started

This section walks you through setting up a basic __Hello World__ plugin for Recogito Studio using TypeScript. This plugin will add a simple message to the annotation editor component.

### Prerequisites

Before starting, make sure you have the following installed:

- NodeJS (version 20 recommended)
- npm or yarn
- TypeScript (installed globally or as a project dependency)

### Step 1: Initialize a New TypeScript Project

Create a new directory for your plugin and initialize a TypeScript project:

```sh
mkdir recogito-hello-world-plugin
cd recogito-hello-world-plugin
npm init -y
```

Then, install TypeScript and the Recogito Studio SDK as runtime dependencies:

```sh
npm install typescript recogito-studio-sdk
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

Inside the `src` directory, create an `index.ts` file:

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

This sets up the foundation for your plugin. Next we’ll create a __React component__ that will extend the `annotation:*:annotation-editor` extension point to display our "Hello World" message directly in the annotation
editor popup.

### Step 4: Create the UI Extension Component

Create a new file `HelloWorldExtension.tsx` inside the `src` directory:

```tsx
export const HelloWorldExtension = () => {
  return <div>Hello World</div>;
};
```

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