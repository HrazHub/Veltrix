import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const prodCsp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https: velitrix-media:",
  "media-src 'self' https: velitrix-media:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-src 'none'"
].join('; ');

const devCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https: velitrix-media:",
  "media-src 'self' https: velitrix-media:",
  "font-src 'self' data:",
  "connect-src 'self' ws://localhost:5173 http://localhost:5173 https://api.rawg.io",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-src 'none'"
].join('; ');

function cspPlugin(): Plugin {
  return {
    name: 'veltrix-csp',
    transformIndexHtml(html, ctx) {
      const csp = ctx.server ? devCsp : prodCsp;
      return html.replace(
        '<!--CSP-->',
        `<meta http-equiv="Content-Security-Policy" content="${csp}" />`
      );
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), cspPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1600
  },
  server: {
    port: 5173,
    strictPort: true
  }
});
