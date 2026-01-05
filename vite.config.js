import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    uni(),
    viteStaticCopy({
      targets: [
        {
          src: '../cloudfunctions',
          dest: 'cloudfunctions'
        }
      ]
    })
  ]
})
