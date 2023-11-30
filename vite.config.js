import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'
//import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  // build: {
  //   copyPublicDir: false,
  //   lib: {
  //     entry: resolve(__dirname, 'src/lib/main.js'),
  //     formats: ['es']
  //   }
  // }
})
