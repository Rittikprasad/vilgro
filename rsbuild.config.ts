import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'Blended Finance Tool',
    favicon: './src/assets/villgro-favicon.png',
  },
});
