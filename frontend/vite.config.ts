import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.join(process.cwd(), '..', 'backend'), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),

        // fix loading all icon chunks in dev mode
        // https://github.com/tabler/tabler-icons/issues/1233
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
      }
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.BASE_URL,
          changeOrigin: true,
          // rewrite: path => path.replace(/^\/api/, '/api')
        }
      }
    }
  };
});
