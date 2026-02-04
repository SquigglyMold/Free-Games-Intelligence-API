import { Router, Request, Response } from 'express';
import { fetchEpicFreeGamesStructured, getEpicFreeGameBySlug } from '../services/epicGamesService';
import { toFreeGameResponse, toFreeGameResponses } from '../services/gameEvaluationService';

const router = Router();

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function parseLimit(queryLimit: unknown): number {
  if (queryLimit === undefined || queryLimit === null) return DEFAULT_LIMIT;
  const n = Number(queryLimit);
  if (!Number.isInteger(n) || n < 1) return DEFAULT_LIMIT;
  return Math.min(n, MAX_LIMIT);
}

/** GET /api/free-games — list all currently free Epic games, optional limit */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const limit = parseLimit(_req.query.limit);
    const result = await fetchEpicFreeGamesStructured();
    if (!result.success) {
      return res.status(500).json({ message: result.message ?? 'Failed to fetch free games' });
    }
    const data = toFreeGameResponses(result.data).slice(0, limit);
    res.json({ count: data.length, data });
  } catch (err) {
    console.error('GET /api/free-games error:', err);
    res.status(500).json({ message: 'Failed to fetch free games' });
  }
});

/** GET /api/free-games/search — search by name; requires query param "type" */
router.get('/search', async (req: Request, res: Response) => {
  const type = req.query.type;
  if (type === undefined || type === null || String(type).trim() === '') {
    return res.status(400).json({ message: 'Query parameter "type" (game name or partial name) is required' });
  }
  try {
    const limit = parseLimit(req.query.limit);
    const result = await fetchEpicFreeGamesStructured();
    if (!result.success) {
      return res.status(500).json({ message: result.message ?? 'Failed to search free games' });
    }
    const term = String(type).trim().toLowerCase();
    const matched = result.data.filter((g) => g.title.toLowerCase().includes(term));
    const data = toFreeGameResponses(matched).slice(0, limit);
    if (data.length === 0 && result.data.length > 0) {
      return res.status(404).json({ message: 'The title is not available as a free game at this time' });
    }
    res.json({ count: data.length, data });
  } catch (err) {
    console.error('GET /api/free-games/search error:', err);
    res.status(500).json({ message: 'Failed to search free games' });
  }
});

/** GET /api/free-games/:slug — single game by slug */
router.get('/:slug', async (req: Request, res: Response) => {
  const slug = req.params.slug?.trim();
  if (!slug) {
    return res.status(400).json({ message: 'Slug is required' });
  }
  try {
    const result = await getEpicFreeGameBySlug(slug);
    if (!result.found) {
      return res.status(404).json({ message: result.message });
    }
    res.json(toFreeGameResponse(result.game));
  } catch (err) {
    console.error('GET /api/free-games/:slug error:', err);
    res.status(500).json({ message: 'Failed to fetch game' });
  }
});

export default router;
