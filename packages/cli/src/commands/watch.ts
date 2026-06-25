import chokidar from 'chokidar';
import { runBuild } from './build.js';

export const runWatch = async () => {
  await runBuild();
  const watcher = chokidar.watch(['src/pages/**/*.mjml', 'src/components/**/*.mjml', 'src/styles/**/*.mjml'], {
    ignoreInitial: true
  });

  watcher.on('all', async () => {
    await runBuild();
  });

  return 'Watching for MJML changes\n';
};
