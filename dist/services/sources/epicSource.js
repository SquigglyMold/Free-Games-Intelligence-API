"use strict";
/**
 * Epic Games Store as a FreeGamesSource.
 * Reusable implementation that fetches live data and normalizes it.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.epicGamesSource = void 0;
const epicGamesService_1 = require("../epicGamesService");
exports.epicGamesSource = {
    id: 'epic',
    fetchFreeGames: epicGamesService_1.fetchEpicFreeGames,
};
//# sourceMappingURL=epicSource.js.map