/**
 * Reusable HTTP client for external API requests.
 * Shared by Epic Games, Steam, and future data sources.
 */
import { AxiosInstance, AxiosError } from 'axios';
export declare function createHttpClient(baseURL?: string, timeout?: number): AxiosInstance;
/** Default client for one-off requests (e.g. Epic, Steam) when no base URL is shared. */
export declare const defaultClient: AxiosInstance;
export declare function isAxiosError(error: unknown): error is AxiosError;
export declare function getJson<T>(url: string, client?: AxiosInstance): Promise<T>;
//# sourceMappingURL=httpClient.d.ts.map