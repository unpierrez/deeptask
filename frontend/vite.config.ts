import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue({ template: { transformAssetUrls } }), quasar()],
  css: {
    preprocessorOptions: {
      scss: { loadPaths: ['node_modules'] },
      sass: { loadPaths: ['node_modules'] },
    },
  },
});
