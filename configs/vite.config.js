import Inspect from 'vite-plugin-inspect';
import { sync } from 'glob';
import { resolve } from 'path';
import fse from 'fs-extra';
import postcss from 'postcss';

export default {
  plugins: [Inspect()],
  css: {
    postcss, // Tailwind CSS uses PostCSS
  },
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
  },
  async closeBundle() {
    const buildDir = resolve(__dirname, 'build');
    const distDir = resolve(__dirname, 'dist');

    await fse.copy(buildDir, distDir, {
      overwrite: true,
      recursive: true,
      filter: (src) => !src.endsWith(buildDir),
    });

    console.log('Build files copied to dist root.');
  },
};
