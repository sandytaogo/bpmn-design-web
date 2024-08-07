import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import * as path from 'path'

// https://vitejs.dev/config/
//npm install rollup-plugin-visualizer -D
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? './' : '/bpm',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      types: path.resolve(__dirname, 'types/')
    }
  },
  server: {
    host:'127.0.0.1',
    port: 8085
  },
  plugins: [
    vue(),
    visualizer(),
    vueJsx({}),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/bpmn-icons')],
      // 指定symbolId格式
      symbolId: '[name]',
      customDomId: '__svg__icons__dom__'
    })
  ]
})
