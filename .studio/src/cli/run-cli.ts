import { parseArgs } from './parse-args.js';
import { runBuild } from './commands/build.js';
import { runDev } from './commands/dev.js';
import { runValidate } from './commands/validate.js';

export const runCli = async (argv: string[]) => {
  const parsed = parseArgs(argv);

  switch (parsed.command) {
    case 'dev':
      return runDev();
    case 'build':
      return runBuild();
    case 'validate':
      return runValidate();
    default:
      return 'Unknown command\n';
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  runCli(process.argv.slice(2)).then((message) => {
    if (typeof message === 'string') {
      process.stdout.write(message);
    }
  });
}
