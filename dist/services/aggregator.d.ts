/**
 * Aggregates free games from one or more sources (Epic now, Steam later).
 * Merges by slug: first occurrence wins. Ready for Steam API enrichment:
 * add a Steam source or an enrichment step that adds review_score, playtime, etc.
 */
import type { NormalizedGame } from '../types';
import type { FreeGamesSource } from './sources/types';
export declare function aggregateFreeGames(sources: FreeGamesSource[]): Promise<NormalizedGame[]>;
//# sourceMappingURL=aggregator.d.ts.map