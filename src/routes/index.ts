import { Router } from 'express';
import healthRouter from './health';
import freeGamesRouter from './freeGames';

const router = Router();

router.use('/', healthRouter);
router.use('/free-games', freeGamesRouter);

export default router;
