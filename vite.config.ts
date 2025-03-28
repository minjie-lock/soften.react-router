import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from 'path';


export default defineConfig({
  plugins: [
    react(),
    dts({
      copyDtsFiles: true,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      tsconfigPath: './tsconfig.types.json'
    })
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ask-router',
      fileName: 'ask-router',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
})
