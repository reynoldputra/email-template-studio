import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { getPreview } from './routes/preview.js';
import { postSend } from './routes/send.js';
import { getTemplates } from './routes/templates.js';
import { getValidation } from './routes/validate.js';

export const createStudioServer = (): Express => {
  const app = express();
  app.use(express.json());

  // Express 5 propagates rejected async route handlers to the error handler automatically.
  app.get('/api/templates', async (_req: Request, res: Response) => {
    res.json(await getTemplates());
  });

  app.post('/api/preview', async (req: Request, res: Response) => {
    res.json({ html: await getPreview(req.body.templateId, req.body.values ?? {}) });
  });

  app.post('/api/send', async (req: Request, res: Response) => {
    res.json({ messageId: await postSend(req.body.templateId, req.body.to, req.body.values ?? {}) });
  });

  app.get('/api/validate', async (_req: Request, res: Response) => {
    res.json(await getValidation());
  });

  // Error handler — returns JSON so the UI can display the message.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[studio api error]', message);
    res.status(500).json({ error: message });
  });

  return app;
};
