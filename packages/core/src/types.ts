export type TemplateProjectConfig = {
  rootDir: string;
  pagesDir: string;
  componentsDir: string;
  stylesDir: string;
  outDir: string;
};

export type TemplateVariable = {
  expression: string;
  key: string;
  label: string;
  defaultValue: string;
};

export type TemplateDescriptor = {
  id: string;
  name: string;
  filePath: string;
};

export type BuildResult = {
  templateId: string;
  outFile: string;
};
