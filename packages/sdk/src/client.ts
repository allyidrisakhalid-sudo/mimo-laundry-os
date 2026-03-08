import createClient from "openapi-fetch";
import type { paths } from "./generated/api";

export type TokenProvider = () => string | null | undefined | Promise<string | null | undefined>;

export type CreateClientOptions = {
  baseUrl: string;
  tokenProvider?: TokenProvider;
  headers?: HeadersInit;
};

export async function createApiClient(options: CreateClientOptions) {
  const token = options.tokenProvider ? await options.tokenProvider() : null;

  const headers = new Headers(options.headers ?? {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return createClient<paths>({
    baseUrl: options.baseUrl,
    headers,
  });
}

export type ApiClient = Awaited<ReturnType<typeof createApiClient>>;
