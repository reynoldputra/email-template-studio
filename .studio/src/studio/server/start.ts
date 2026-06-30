import { createStudioServer } from './dev-server.js';

export const startStudio = async () => {
  const app = createStudioServer();
  const port = Number(process.env.STUDIO_PORT ?? '3100');
  await new Promise<void>((resolve) => {
    app.listen(port, '127.0.0.1', () => resolve());
  });
  return `Studio running on http://127.0.0.1:${port}\n`;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  startStudio().then((message) => process.stdout.write(message));
}
