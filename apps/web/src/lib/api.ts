export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.mimolaundry.org";

export type LoginResponse = {
  data: {
    user: {
      id: string;
      phone: string;
      email: string;
      fullName: string;
      role: string;
      status: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      accessTokenExpiresInSeconds: number;
      refreshTokenExpiresInSeconds: number;
    };
  };
};

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { token?: string }
): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  headers.set("Content-Type", "application/json");

  if (init?.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      data?.error?.message ?? data?.message ?? `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function login(phone: string, password: string) {
  return apiFetch<LoginResponse>("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ phone, password }),
  });
}
