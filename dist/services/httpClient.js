"use strict";
/**
 * Reusable HTTP client for external API requests.
 * Shared by Epic Games, Steam, and future data sources.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultClient = void 0;
exports.createHttpClient = createHttpClient;
exports.isAxiosError = isAxiosError;
exports.getJson = getJson;
const axios_1 = __importDefault(require("axios"));
const DEFAULT_TIMEOUT_MS = 15000;
function createHttpClient(baseURL, timeout = DEFAULT_TIMEOUT_MS) {
    return axios_1.default.create({
        baseURL,
        timeout,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        validateStatus: (status) => status >= 200 && status < 300,
    });
}
/** Default client for one-off requests (e.g. Epic, Steam) when no base URL is shared. */
exports.defaultClient = createHttpClient();
function isAxiosError(error) {
    return axios_1.default.isAxiosError(error);
}
async function getJson(url, client = exports.defaultClient) {
    const response = await client.get(url);
    return response.data;
}
//# sourceMappingURL=httpClient.js.map