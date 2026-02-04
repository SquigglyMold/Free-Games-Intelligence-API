/**
 * Reusable HTTP client for external API requests.
 * Shared by Epic Games, Steam, and future data sources.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

const DEFAULT_TIMEOUT_MS = 15_000;

export function createHttpClient(baseURL?: string, timeout: number = DEFAULT_TIMEOUT_MS): AxiosInstance {
  return axios.create({
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
export const defaultClient = createHttpClient();

export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}

export async function getJson<T>(url: string, client: AxiosInstance = defaultClient): Promise<T> {
  const response = await client.get<T>(url);
  return response.data;
}
