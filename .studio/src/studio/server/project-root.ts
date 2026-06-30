import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDir = path.dirname(fileURLToPath(import.meta.url));

const hasProjectMarkers = (cwd: string) =>
  fs.existsSync(path.join(cwd, 'src/pages')) || fs.existsSync(path.join(cwd, 'email-template-studio.config.ts'));

const resolveRepoProjectRoot = () => {
  const cwdCandidate = process.cwd();
  if (fs.existsSync(path.join(cwdCandidate, 'src/pages'))) return cwdCandidate;

  return path.resolve(serverDir, '../../../../..');
};

export const resolveStudioProjectRoot = () => {
  if (process.env.EMAIL_TEMPLATE_STUDIO_PROJECT) {
    return path.resolve(process.cwd(), process.env.EMAIL_TEMPLATE_STUDIO_PROJECT);
  }

  if (hasProjectMarkers(process.cwd())) {
    return process.cwd();
  }

  return resolveRepoProjectRoot();
};
