import { defineConfig } from "vite";
import cesium from 'vite-plugin-cesium';

// const cesiumSource = "node_modules/cesium/Build/Cesium";
// This is the base url for static files that CesiumJS needs to load.
// Set to an empty string to place the files at the site's root path
const cesiumBaseUrl = "cesiumStatic";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: [
      '@zip.js/zip.js',
      'mersenne-twister'
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  resolve: {
    alias: {
      '@zip.js/zip.js/lib/zip-no-worker.js': '@zip.js/zip.js',
      'mersenne-twister': 'mersenne-twister/src/mersenne-twister.js'
    }
  },
  build: {
    target: "esnext", // Modern browsers can handle the latest ES features
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  define: {
    // Define relative base path in cesium for loading assets
    // https://vitejs.dev/config/shared-options.html#define
    CESIUM_BASE_URL: JSON.stringify(`/${cesiumBaseUrl}`),
  },
  plugins: [
    cesium()
    // Copy Cesium Assets, Widgets, and Workers to a static directory.
    // If you need to add your own static files to your project, use the `public` directory
    // and other options listed here: https://vitejs.dev/guide/assets.html#the-public-directory
    // viteStaticCopy({
    //   targets: [
    //     { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
    //     { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
    //     { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
    //     { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
    //   ],
    // }),
  ],
});
