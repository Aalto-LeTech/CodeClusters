import reactRefresh from '@vitejs/plugin-react-refresh'
import { config } from 'dotenv'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

config()

export default defineConfig({
  optimizeDeps: {
    entries: ['index.html'],
  },
  server: {
    port: parseInt(process.env.PORT || 3000),
    strictPort: true,
    hmr: {
      timeout: 500,
    },
  },
  define: {
    'process.env': process.env,
  },
  plugins: [reactRefresh(), tsconfigPaths()],
})
