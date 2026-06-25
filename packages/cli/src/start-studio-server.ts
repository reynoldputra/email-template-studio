import { execa } from 'execa';

export const startStudioServer = async () => {
  const subprocess = execa('corepack', ['pnpm', '--filter', '@email-template-studio/studio', 'dev'], {
    cwd: process.cwd(),
    stdio: 'inherit'
  });

  await subprocess;
  return 'Studio stopped\n';
};
