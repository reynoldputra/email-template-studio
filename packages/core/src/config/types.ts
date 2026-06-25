export type UserConfig = {
  pagesDir?: string;
  componentsDir?: string;
  stylesDir?: string;
  outDir?: string;
};

export type LoadConfigOptions = {
  cwd: string;
  config?: UserConfig;
};
