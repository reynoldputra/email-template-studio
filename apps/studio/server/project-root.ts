import fs from 'node:fs';
import path from 'node:path';

const hasProjectMarkers = (cwd: string) => fs.existsSync(path.join(cwd, 'src/pages')) || fs.existsSync(path.join(cwd, 'email-template-studio.config.ts'));

export const resolveStudioProjectRoot = () => {
  if (process.env.EMAIL_TEMPLATE_STUDIO_PROJECT) {
    return path.resolve(process.cwd(), process.env.EMAIL_TEMPLATE_STUDIO_PROJECT);
  }

  if (hasProjectMarkers(process.cwd())) {
    return process.cwd();
  }

  return path.resolve(process.cwd(), '../../examples/basic');
};
