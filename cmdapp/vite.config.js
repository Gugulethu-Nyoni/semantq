import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      inject: true,
    }),
  ],
  server: {
    watch: {
      usePolling: true,
      interval: 100,
      ignored: ['**/*.js', 'dist', 'node_modules'],
    },
  },
});
