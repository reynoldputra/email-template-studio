export type TemplateProjectConfig = {
  rootDir: string;
  pagesDir: string;
  componentsDir: string;
  stylesDir: string;
  outDir: string;
};

export type VariableInputType = 'text' | 'email' | 'url';

export type TemplateVariable = {
  expression: string;
  key: string;
  label: string;
  defaultValue: string;
  inputType: VariableInputType;
};

export type TemplateDescriptor = {
  id: string;
  name: string;
  filePath: string;
};

export type TemplateSummary = {
  id: string;
  name: string;
  preview: string;
  tokens: TemplateVariable[];
};

export type BuildResult = {
  templateId: string;
  outFile: string;
};
