import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import solidSvgPlugin from 'vite-plugin-solid-svg'

export default defineConfig({
  plugins: [solidPlugin(), solidSvgPlugin()],
  build: {
    target: 'esnext'
  }
})
