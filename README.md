# Recogito Studio SDK

A software development kit for developing plugins to [Recogito Studio](https://recogitostudio.org/), an open source platform for collaborative annotation of TEI, IIIF and PDF documents.

## Introduction

The __Recogito Studio SDK__ is designed to facilitate plugin development for the __Recogito Studio Client application__ without the need to set up your own full-stack installation or forking the platform. It provides essential tools and abstractions to help you build useful extensions for the Recogito Studio ecosystem.

### Astro Integrations

The Recogito Studio client is an [Astro application](https://astro.build/). Recogito Studio plugins are implemented as [Astro Integrations](https://docs.astro.build/en/guides/integrations-guide/), which means they can leverage all the standard capabilities that Astro Integrations provide, plus some additional features introduced by Recogito Studio's own UI extension framework. (More on that below.)

### UI Extension Framework

Recogito Studio's built-in UI extension framework is based on [React’s lazy loading](https://react.dev/reference/react/lazy) and [Suspense](https://react.dev/reference/react/Suspense) mechanisms, and allows plugins to dynamically inject their own React components into defined __extension points__ that Recogito Studio defines.

To inject UI extensions, plugin developers must register their extensions following a specific process. This involves a small amount of boilerplate code, which the SDK helps simplify. (We’ll cover the registration process in detail in the "Plugin Anatomy" section.)

### What Can Plugins Do?

With the Recogito Studio SDK, plugins can, for example:

- Extend the annotation editor with new UI elements.
- Replace existing UI elements in the editor, such as swapping the default tag widget with a custom version that integrates an external vocabulary service.
- Enhance backend capabilities, e.g. introduce new API routes that exporting annotations in different data formats.

__Important:__ Plugins are restricted to the client part of Recogito Studio. Specifically, this means __plugins can not change or add to the backend component ("Recogito Server")__. For example, it is not possible for plugins to change or add to the Supabase schema, or add additional DB or edge functions.

<details>
<summary>Getting Started</summary>

## Getting Started

The following steps walk you through the development of a __Hello World__ plugin that adds a simple message to the annotation editor.

> You can find the full result of this tutorial in this repository: [recogito/plugin-hello-world](https://github.com/recogito/plugin-hello-world).

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

Install the following dev dependencies:

```sh
npm install --save-dev @types/node @types/react @types/react-dom typescript
npm install --save-dev astro react react-dom
```

Then, install the Recogito Studio SDK as runtime dependencies:

```sh
npm install @recogito/studio-sdk
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

Make sure the following lines are in your `package.json`:

```jsonc
{
  // ...
  "type": "module",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsc"
  }
}

```

### Step 3: Create the Plugin Entry Point

Inside the `src` directory, create a file called `index.ts`. This file is your main plugin entry point that will get registered by Recogito Studio. It __must provide a default export__, which __must be an Astro Integration.__

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

Your plugin package must expose this default as the root module. Include the following in your `package.json`: 

```jsonc
{
  // ...
  "exports": {
    // Main module entry point – the default Astro Integration export
    ".": "./dist/index.js",
  },
}
```

### Step 4: Install the Test Application Template

At this point, you have a technically valid Recogito Plugin. It doesn't actually do anything yet. But it will correctly register itself with Recogito Studio when you start it.

Therefore, this is a good time to set up the __test application__ included with the SDK. The test application provides a convenient development environment you can use to:

- test if your plugin gets correctly registered as an Astro Integration.
- preview the UI extensions they provide (none yet – but we'll get to that).

To set up the test application template, run:

```sh
npx copy-template
```

This will copy the test application to a `.dev` folder in your project. We recommend adding the following line to your project's `package.json`, so you can conveniently start the test application using `npm run dev`:

```jsonc
{
  // ...
  "scripts": {
    "dev": "npm start --prefix .dev/",
    //...
  },

```

### Step 5: Configure the Test Application

Set up the test application to use your plugin. Open `.dev/package.json` and add your plugin as a file dependency.

```jsonc
  "dependencies": {
    "@astrojs/node": "^9.0.2",
    "@astrojs/react": "^4.2.0",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    // Add this
    "hello-world-plugin": "file:../package.json"
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

- Run `npm install`.
- Run `npm run build` to build your plugin.
- Run `npm run dev` to start the test application.

### Step 6: Create a UI Extension

Next we'll add a __React component__ that displays a "Hello World" message in the annotation editor. Create a new file `HelloWorldMessage.tsx` inside the `src` directory:

```tsx
export const HelloWorldMessage = () => {
  
  return (
    <div>Hello World</div>
  );

}
```

We'll configure our plugin so that it exports this React component for the `annotation:*:annotation-editor` extension point. This extension point is a slot at the bottom of the annotation editor.

Edit your `index.ts` file to register the component as a UI extension:

```ts
import type { AstroIntegration } from 'astro';
import { Extension, registerExtensions } from '@recogito/studio-sdk';

export const HelloWorldEditorMessageExtension: Extension = {

  name: 'hello-world-message',

  module_name: 'recogito-hello-world-plugin',

  component_name: 'HelloWorldMessage',

  extension_point: 'annotation:*:annotation-editor'

}

const plugin = (): AstroIntegration  => ({
  name: 'hello-world-plugin',
  hooks: {
    'astro:config:setup': ({ config, logger }) => {
      // This registers the UI extension in Recogito Studio
      registerExtensions(HelloWorldEditorMessageExtension, config, logger);
    }
  }
});

export default plugin;
```

Finally: your plugin's `package.json` must expose each UI extension as a sub-module. Add this to your `package.json`:

```jsonc
{
  // ...
  "exports": {
    // Main module entry point – the default Astro Integration export
    ".": "./dist/index.js",
    // Module export for the HelloWorldMessage UI extension
    "./HelloWorldMessage": "./dist/extensions/HelloWorldMessage.js"
  },
}
```

### Step 7: Test Your Extension

At this point, you have a–basic, but fully functional–Recogito Studio plugin. Before deploying to Recogito, let's test it in the SDK test application.

- Build your plugin package.

```bash
npm run build
```

- Add your plugin package to the test application as a dependency. (We can do this without publishing the package, by usinga  local file link.) Add the following to your `.dev/package.json`:

```jsonc
{
  //...
  "dependencies": {
    //...
    "@recogito/plugin-hello-world": "file:../"
  }
}
```

- Configure the test app to use the Astro Integration exposed by your package. Add the following to your `.dev/astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

// This imports the plugin to the Astro config
import HelloWorldPlugin from '@recogito/plugin-hello-world';

export default defineConfig({
  integrations: [
    react(),
    // Add the plugin here
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

Almost done! Now run `npm install`, `npm run dev` and point your browser to <http://localhost:4321/>. You should see the plugin registered in the test page, and a preview of the 'Hello World' React component.

![Recogito Studio plugin test page](screenshot.png)
</details>

<details>
<summary>Installing Plugins</summary>

## Installing Plugins

To install a plugin into your Recogito Studio instance you need to __publish__ them. You can either do this by:

- Publishing the plugin as a [package on the npm registry](https://docs.npmjs.com/cli/v8/commands/npm-publish).
- Making your project repository public on Github, enabling people to [install the package directly from there](https://www.geeksforgeeks.org/how-to-install-an-npm-package-directly-from-github/).

### Installation

A Recogito Studio plugin is just an Astro Integration, therefore you can follow [Astro's standard installation procedure](https://docs.astro.build/en/guides/integrations-guide/). __Note:__ at the moment we only support [manual installation](https://docs.astro.build/en/guides/integrations-guide/).

1. In your Recogito Studio Client folder, install the npm package: `npm install <plugin-package-to-install>`
2. Add the plugin the `astro.config.mjs` file:

```diff
import { defineConfig } from 'astro/config';
+ import PluginToInstall from 'plugin-package';

export default defineConfig({
+  integrations: [
+    PluginToInstall()
+  ]
});
```
Note that plugins may support additional config options at this step. Refer to the plugin's documentation for details.
</details>





