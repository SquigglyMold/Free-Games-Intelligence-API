"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_1 = __importDefault(require("./health"));
const freeGames_1 = __importDefault(require("./freeGames"));
const router = (0, express_1.Router)();
router.use('/', health_1.default);
router.use('/free-games', freeGames_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map