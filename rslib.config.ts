import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      index: [
        './src/**/*',
      ],
    },
    tsconfigPath: './tsconfig.json'
  },
  lib: [
    {
      bundle: false,
      dts: true,
      format: 'esm',
    },
    {
      bundle: false,
      dts: true,
      format: 'cjs',
    }
  ],
  output: {
    target: 'web',
  },
  plugins: [
    pluginReact()
  ],
});
