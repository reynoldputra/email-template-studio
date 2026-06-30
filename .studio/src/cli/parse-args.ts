export type SupportedCommand = 'dev' | 'build' | 'validate';

export type ParsedArgs = {
  command: SupportedCommand;
  options: Record<string, string | boolean>;
};

export const parseArgs = (argv: string[]): ParsedArgs => {
  const [command = 'dev'] = argv;

  if (!['dev', 'build', 'validate'].includes(command)) {
    return { command: 'dev', options: {} };
  }

  return {
    command: command as SupportedCommand,
    options: {}
  };
};
