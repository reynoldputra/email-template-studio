export type PreviewMode = 'mobile' | 'desktop';

export type StudioVariableInputType = 'text' | 'email' | 'url';

export type StudioTemplateVariable = {
  expression: string;
  key: string;
  label: string;
  defaultValue: string;
  inputType: StudioVariableInputType;
};

export type StudioTemplateSummary = {
  id: string;
  name: string;
  preview: string;
  tokens: StudioTemplateVariable[];
};

export type StudioStatus = 'idle' | 'busy' | 'success' | 'error';
