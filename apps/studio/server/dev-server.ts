import express, { type Express, type Request, type Response } from 'express';
import { getPreview } from './routes/preview.js';
import { postSend } from './routes/send.js';
import { getTemplates } from './routes/templates.js';
import { getValidation } from './routes/validate.js';

export const createStudioServer = (): Express => {
  const app = express();
  app.use(express.json());

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

  return app;
};
