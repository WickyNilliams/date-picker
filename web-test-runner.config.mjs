import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import path from 'path';

const filteredLogs = ['Running in dev mode', 'lit-html is in dev mode'];

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  /** Test files to run */
  files: 'src/**/*.test.{js,ts}',
  nodeResolve: true,

  /** Filter out lit dev mode logs */
  filterBrowserLogs(log) {
    for (const arg of log.args) {
      if (typeof arg === 'string' && filteredLogs.some(l => arg.includes(l))) {
        return false;
      }
    }
    return true;
  },

  plugins: [
    esbuildPlugin({ ts: true, target: 'auto' }),

    visualRegressionPlugin({
      update: process.argv.includes('-u') || process.argv.includes('--update'),

      getBaselineName: ({ testFile, browser, name }) =>
        path.join(testFile, '..', 'screenshots', browser, 'baseline', name),

      getDiffName: ({ testFile, browser, name }) =>
        path.join(testFile, '..', 'screenshots', browser, 'failed', `${name}-diff`),

      getFailedName: ({ testFile, browser, name }) => path.join(testFile, '..', 'screenshots', browser, 'failed', name),
    }),
  ],
});
