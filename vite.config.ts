import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    ssr: true,
    target: 'node16',
    lib: {
      entry: {
        'index': resolve(__dirname, 'src/index.ts'),
        'components/index': resolve(__dirname, 'src/components/index.ts'),
      },
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        preserveModules: true
      },
    }
  }
});