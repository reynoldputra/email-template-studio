export const parseArgs = (argv: string[]) => {
  const [command = 'dev', ...rest] = argv;
  const flags: Record<string, string> = {};
  for (let index = 0; index < rest.length; index += 1) {
    const key = rest[index];
    if (!key?.startsWith('--')) continue;
    flags[key.slice(2)] = rest[index + 1] ?? 'true';
    index += 1;
  }
  return { command, flags };
};
