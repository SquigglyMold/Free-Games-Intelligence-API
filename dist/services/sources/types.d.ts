/**
 * Abstraction for free games data sources.
 * Epic and (future) Steam implement this interface so the aggregator
 * can fetch from multiple providers and merge or enrich results.
 */
import type { NormalizedGame } from '../../types';
export interface FreeGamesSource {
    readonly id: string;
    fetchFreeGames(): Promise<NormalizedGame[]>;
}
//# sourceMappingURL=types.d.ts.map