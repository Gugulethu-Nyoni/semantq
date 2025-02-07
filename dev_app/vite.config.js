import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import path from 'path';

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      inject: true,
    }),
  ],
  resolve: {
    alias: {
      $components: path.resolve(__dirname, 'src/components'),
      $lib: path.resolve(__dirname, 'src/lib'),  // Add more if needed
    }
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100,
      ignored: ['**/*.js', 'dist', 'node_modules'],
    },
  },
});
