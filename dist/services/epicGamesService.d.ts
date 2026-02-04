/**
 * Epic Games Store free games service.
 * Fetches live data from the Epic freeGamesPromotions endpoint.
 * All game data is derived exclusively from Epic; no external sources.
 */
import type { NormalizedGame, EpicFreeGamesListResult, EpicFreeGameBySlugResult } from '../types';
export declare function fetchEpicFreeGamesStructured(): Promise<EpicFreeGamesListResult>;
export declare function fetchEpicFreeGames(): Promise<NormalizedGame[]>;
export declare function getEpicFreeGameBySlug(slug: string): Promise<EpicFreeGameBySlugResult>;
//# sourceMappingURL=epicGamesService.d.ts.map