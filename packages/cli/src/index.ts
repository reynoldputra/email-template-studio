import { parseArgs } from './parse-args.js';
import { runBuild } from './commands/build.js';
import { runValidate } from './commands/validate.js';
import { runWatch } from './commands/watch.js';
import { runDev } from './commands/dev.js';
import { runSend } from './commands/send.js';

export const runCli = async (argv: string[]) => {
  const { command, flags } = parseArgs(argv);
  if (command === 'build') return runBuild();
  if (command === 'validate') return runValidate();
  if (command === 'watch') return runWatch();
  if (command === 'dev') return runDev();
  if (command === 'send') return runSend({ to: flags.to, template: flags.template });
  return `Unknown command: ${command}\n`;
};
