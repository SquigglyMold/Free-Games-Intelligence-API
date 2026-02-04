import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRouter from './routes';

const app = express();

app.use(cors());
app.use(express.json());

const welcomePayload = {
  message: 'Welcome to the Free Games Intelligence API',
  documentation: 'Use the endpoints below to get current free games from the Epic Games Store.',
  endpoints: [
    { method: 'GET', path: '/api/health', description: 'Health check. Returns { "status": "ok" }' },
    { method: 'GET', path: '/api/free-games', description: 'List all currently free Epic games. Query: limit (optional)' },
    { method: 'GET', path: '/api/free-games/search', description: 'Search free games by name. Query: type (required), limit (optional)' },
    { method: 'GET', path: '/api/free-games/:slug', description: 'Get a single free game by slug' },
  ],
};

function isRootPath(path: string): boolean {
  const p = (path || '').replace(/\?.*$/, '').replace(/\/+$/, '') || '/';
  return p === '/' || p === '' || p === '/api';
}

app.use((req: Request, res: Response, next) => {
  if (req.method !== 'GET') return next();
  const path = (req.url ?? req.path ?? '/').split('?')[0] || '/';
  if (isRootPath(path)) {
    return res.json(welcomePayload);
  }
  next();
});

app.get('/', (_req: Request, res: Response) => res.json(welcomePayload));
app.get('/api', (_req: Request, res: Response) => res.json(welcomePayload));

app.use('/api', apiRouter);

export default app;
