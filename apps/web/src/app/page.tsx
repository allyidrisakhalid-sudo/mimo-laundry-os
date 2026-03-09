import { createApiClient } from "@mimo/sdk";
import { tokens } from "@mimo/ui";

export default async function HomePage() {
  const client = await createApiClient({
    baseUrl: "http://localhost:3001",
  });

  const { data, error } = await client.GET("/health");

  return (
    <main
      style={{
        minHeight: "100vh",
        background: tokens.color.background,
        color: tokens.color.textPrimary,
        fontFamily: tokens.typography.fontFamily.sans,
        padding: tokens.spacing[24],
      }}
    >
      <h1
        style={{
          fontSize: tokens.typography.fontSize.h1,
          lineHeight: tokens.typography.lineHeight.h1,
          margin: 0,
        }}
      >
        Laundry OS Web
      </h1>
      <p
        style={{
          color: tokens.color.textSecondary,
          marginTop: tokens.spacing[12],
          marginBottom: tokens.spacing[16],
        }}
      >
        Chapter 7.1 base styling now uses shared UI tokens.
      </p>
      <p style={{ marginBottom: tokens.spacing[24] }}>
        Open <a href="/ui-demo">/ui-demo</a> to view the design token demo page.
      </p>
      <pre
        style={{
          padding: tokens.spacing[16],
          background: tokens.color.surface,
          border: `1px solid ${tokens.color.border}`,
          borderRadius: tokens.radius[12],
          boxShadow: tokens.shadow.subtle,
          overflowX: "auto",
        }}
      >
        {JSON.stringify({ data, error: error ?? null }, null, 2)}
      </pre>
    </main>
  );
}
