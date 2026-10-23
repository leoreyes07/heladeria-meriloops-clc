import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// CSP plugin: injects Content-Security-Policy and Referrer-Policy meta tags during production build
const cspPlugin = {
  name: 'csp-plugin',
  apply: 'build',
  transformIndexHtml(html) {
    return html.replace('</head>', `
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; frame-ancestors 'none';">
<meta name="referrer" content="no-referrer">
</head>`);
  },
};

export default defineConfig(() => {
  return {
    plugins: [react(), cspPlugin],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
