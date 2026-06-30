import fs from 'node:fs/promises';
import path from 'node:path';
import type { TemplateProjectConfig } from '../types.js';
import type { LoadConfigOptions, UserConfig } from './types.js';
import { defaultConfig } from './default-config.js';

const tryLoadConfigFile = async (cwd: string): Promise<UserConfig> => {
  const tsPath = path.join(cwd, 'email-template-studio.config.ts');
  const jsPath = path.join(cwd, 'email-template-studio.config.js');
  const configPath = await fs
    .access(tsPath)
    .then(() => tsPath)
    .catch(async () => fs.access(jsPath).then(() => jsPath).catch(() => null));

  if (!configPath) return {};
  const mod = await import(pathToFileUrl(configPath));
  return (mod.default ?? {}) as UserConfig;
};

const pathToFileUrl = (filePath: string) => new URL(`file://${filePath}`).href;

export const loadConfig = async ({ cwd, config = {} }: LoadConfigOptions): Promise<TemplateProjectConfig> => {
  const fileConfig = await tryLoadConfigFile(cwd);
  const merged = { ...defaultConfig, ...fileConfig, ...config };

  return {
    rootDir: cwd,
    pagesDir: path.resolve(cwd, merged.pagesDir),
    componentsDir: path.resolve(cwd, merged.componentsDir),
    stylesDir: path.resolve(cwd, merged.stylesDir),
    outDir: path.resolve(cwd, merged.outDir)
  };
};
