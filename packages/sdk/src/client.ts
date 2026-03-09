import createClient from "openapi-fetch";
import type { paths } from "./generated/api";

export type CreateApiClientOptions = {
  baseUrl: string;
  tokenProvider?: (() => Promise<string | null> | string | null) | undefined;
  headers?: Record<string, string> | undefined;
};

export async function createApiClient(options: CreateApiClientOptions) {
  const token = options.tokenProvider ? await options.tokenProvider() : null;

  const headers: Record<string, string> = {
    ...(options.headers ?? {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return createClient<paths>({
    baseUrl: options.baseUrl,
    headers,
  });
}
