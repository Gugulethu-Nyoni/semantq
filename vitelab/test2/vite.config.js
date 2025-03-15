import Inspect from 'vite-plugin-inspect';
import { sync } from 'glob';
import { resolve } from 'path';

export default {
  plugins: [Inspect()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        sync('./src/**/*.html'.replace(/\\/g, '/')).map((file) => [
          // Generate a key that preserves the file structure
          file.replace(/^\.\/src\//, '').replace(/\.html$/, ''),
          // Resolve the absolute path to the file
          resolve(__dirname, file),
        ])
      ),
    },
  },
};