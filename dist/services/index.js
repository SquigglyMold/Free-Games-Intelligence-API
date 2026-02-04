"use strict";
/**
 * Services entry point.
 * All game data is derived exclusively from Epic Games Store.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAxiosError = exports.defaultClient = exports.createHttpClient = exports.getJson = exports.toFreeGameResponses = exports.toFreeGameResponse = exports.getEpicFreeGameBySlug = exports.fetchEpicFreeGamesStructured = exports.fetchEpicFreeGames = void 0;
var epicGamesService_1 = require("./epicGamesService");
Object.defineProperty(exports, "fetchEpicFreeGames", { enumerable: true, get: function () { return epicGamesService_1.fetchEpicFreeGames; } });
Object.defineProperty(exports, "fetchEpicFreeGamesStructured", { enumerable: true, get: function () { return epicGamesService_1.fetchEpicFreeGamesStructured; } });
Object.defineProperty(exports, "getEpicFreeGameBySlug", { enumerable: true, get: function () { return epicGamesService_1.getEpicFreeGameBySlug; } });
var gameEvaluationService_1 = require("./gameEvaluationService");
Object.defineProperty(exports, "toFreeGameResponse", { enumerable: true, get: function () { return gameEvaluationService_1.toFreeGameResponse; } });
Object.defineProperty(exports, "toFreeGameResponses", { enumerable: true, get: function () { return gameEvaluationService_1.toFreeGameResponses; } });
var httpClient_1 = require("./httpClient");
Object.defineProperty(exports, "getJson", { enumerable: true, get: function () { return httpClient_1.getJson; } });
Object.defineProperty(exports, "createHttpClient", { enumerable: true, get: function () { return httpClient_1.createHttpClient; } });
Object.defineProperty(exports, "defaultClient", { enumerable: true, get: function () { return httpClient_1.defaultClient; } });
Object.defineProperty(exports, "isAxiosError", { enumerable: true, get: function () { return httpClient_1.isAxiosError; } });
//# sourceMappingURL=index.js.map