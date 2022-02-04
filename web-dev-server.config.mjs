// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';
// @ts-check

import { esbuildPlugin } from '@web/dev-server-esbuild';

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  port: 3333,
  nodeResolve: true,
  open: '/demo/',
  watch: true,

  plugins: [
    esbuildPlugin({
      ts: true,
    }),
  ],
});
