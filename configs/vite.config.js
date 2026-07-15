import Inspect from 'vite-plugin-inspect';
import { sync } from 'glob';
import { resolve } from 'path';
import fse from 'fs-extra';

export default {
  plugins: [Inspect()],

  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        ...Object.fromEntries(
          sync('./build/**/*.html'.replace(/\\/g, '/')).map((file) => [
            file.replace(/^\.\/build\//, '').replace(/\.html$/, ''),
            resolve(__dirname, file),
          ])
        ),
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    cssMinify: false, // Temporary for debugging
  },

  async closeBundle() {
    const buildDir = resolve(__dirname, 'build');
    const distDir = resolve(__dirname, 'dist');

    const htmlFiles = sync(`${buildDir}/**/*.html`);

    for (const file of htmlFiles) {
      const relative = file.replace(buildDir, '');
      const destination = resolve(distDir, relative.substring(1));
      await fse.copy(file, destination, { overwrite: true });
    }

    console.log('✅ HTML files copied to dist root.');
  },
};