"use client";

import { useOnboardingMessages } from "../app/_components/p2Onboarding";

export default function HelpPage() {
  const { t } = useOnboardingMessages();

  return (
    <main style={{ display: "grid", gap: 24 }}>
      <section
        style={{
          border: "1px solid var(--color-mist, #d7dce3)",
          borderRadius: 24,
          padding: 24,
          background: "var(--color-silk, #f8f6f2)",
        }}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <h1 style={{ margin: 0 }}>{t.help.publicTitle}</h1>
          <p style={{ margin: 0 }}>{t.help.publicBody}</p>
          <p style={{ margin: 0 }}>
            WhatsApp: <a href="https://wa.me/255788558975" target="_blank" rel="noreferrer">+255788558975</a>
          </p>
        </div>
      </section>
    </main>
  );
}
