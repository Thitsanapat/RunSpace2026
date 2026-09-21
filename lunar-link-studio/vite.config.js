import {defineConfig} from 'vite';
export default defineConfig({
  // Relative asset URLs work at localhost and /RunSpace2026/ on GitHub Pages.
  base:'./',
  server:{host:'127.0.0.1',port:5173,strictPort:true},
  preview:{host:'127.0.0.1',port:4173,strictPort:true},
  build:{rollupOptions:{output:{manualChunks:{three:['three','three/addons/controls/OrbitControls.js']}}}}
});
