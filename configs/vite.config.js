import Inspect from 'vite-plugin-inspect';
import { sync } from 'glob';
import { resolve } from 'path';
import fse from 'fs-extra';

export default {
  plugins: [Inspect()],
  build: {
    rollupOptions: {
      input: {
        // Specify index.html as the entry point to be bundled
        index: resolve(__dirname, 'index.html'),
        // Add all HTML files from the build directory
        ...Object.fromEntries(
          sync('./build/**/*.html'.replace(/\\/g, '/')).map((file) => [
            // Remove the `build/` prefix from the file path
            file.replace(/^\.\/build\//, '').replace(/\.html$/, ''),
            resolve(__dirname, file),
          ])
        ),
      },
    },
    outDir: 'dist', // Set the output directory to the root of dist
    emptyOutDir: true, // Clear the dist directory before building
    assetsDir: 'assets', // Place assets in a dedicated 'assets' directory inside dist
  },
  async closeBundle() {
  const buildDir = resolve(__dirname, 'build');
  const distDir = resolve(__dirname, 'dist');

  // Copy all files from build to dist root, excluding the build directory itself
  await fse.copy(buildDir, distDir, {
    overwrite: true,
    recursive: true,
    filter: (src) => !src.endsWith(buildDir), // Exclude the build directory itself
  });

  console.log('Build files copied to dist root.');
},
};
