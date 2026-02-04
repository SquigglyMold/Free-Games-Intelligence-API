"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
function isRootPath(path) {
    const p = (path || '').replace(/\?.*$/, '').replace(/\/+$/, '') || '/';
    return p === '/' || p === '' || p === '/api';
}
app.use((req, res, next) => {
    if (req.method !== 'GET')
        return next();
    const path = (req.url ?? req.path ?? '/').split('?')[0] || '/';
    if (isRootPath(path)) {
        return res.json(welcomePayload);
    }
    next();
});
app.get('/', (_req, res) => res.json(welcomePayload));
app.get('/api', (_req, res) => res.json(welcomePayload));
app.use('/api', routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map