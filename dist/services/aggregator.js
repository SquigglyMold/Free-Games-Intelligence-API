"use strict";
/**
 * Aggregates free games from one or more sources (Epic now, Steam later).
 * Merges by slug: first occurrence wins. Ready for Steam API enrichment:
 * add a Steam source or an enrichment step that adds review_score, playtime, etc.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateFreeGames = aggregateFreeGames;
async function aggregateFreeGames(sources) {
    if (sources.length === 0)
        return [];
    const results = await Promise.all(sources.map((s) => s.fetchFreeGames()));
    const bySlug = new Map();
    for (const games of results) {
        for (const g of games) {
            const key = g.slug.toLowerCase();
            if (!bySlug.has(key))
                bySlug.set(key, g);
        }
    }
    return Array.from(bySlug.values());
}
//# sourceMappingURL=aggregator.js.map