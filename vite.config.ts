import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin'
import tailwindcss from '@tailwindcss/vite'
import netlifyPlugin from '@netlify/vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tanstackStart(),
    tailwindcss(),
    netlifyPlugin(),
    tsconfigPaths(),
  ],
})
