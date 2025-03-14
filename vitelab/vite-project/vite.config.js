import { defineConfig } from 'vite'
import { dirname, resolve } from 'node:path' // Import `dirname` here
import { fileURLToPath } from 'node:url'
import { glob } from 'glob' // Install the `glob` package

// Convert the current file URL to a file path
const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    outDir: 'dist', // Explicitly specify the output directory
    rollupOptions: {
      input: Object.fromEntries(
        glob.sync('src/**/*.html').map((file) => [
          // Use the relative path as the entry name
          file.slice('src/'.length, -'.html'.length),
          resolve(__dirname, file),
        ])
      ),
    },
  },
})