import { createApiClient } from "@mimo/sdk";

export default async function HomePage() {
  const client = await createApiClient({
    baseUrl: "http://localhost:3001",
  });

  const { data, error } = await client.GET("/health");

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>Laundry OS Web</h1>
      <p>Chapter 5.2 SDK placeholder</p>
      <pre>{JSON.stringify({ data, error: error ?? null }, null, 2)}</pre>
    </main>
  );
}
