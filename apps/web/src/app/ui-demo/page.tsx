import { mimoTokens } from "@mimo/ui";

const colorRows = [
  ["obsidian", mimoTokens.color.obsidian],
  ["midnight", mimoTokens.color.midnight],
  ["ink", mimoTokens.color.ink],
  ["silk", mimoTokens.color.silk],
  ["cloud", mimoTokens.color.cloud],
  ["mist", mimoTokens.color.mist],
  ["champagne", mimoTokens.color.champagne],
  ["teal", mimoTokens.color.teal],
  ["royal", mimoTokens.color.royal],
  ["plum", mimoTokens.color.plum],
  ["success", mimoTokens.color.success],
  ["warning", mimoTokens.color.warning],
  ["error", mimoTokens.color.error],
  ["info", mimoTokens.color.info]
] as const;

const spacingRows = Object.entries(mimoTokens.spacing);
const radiusRows = Object.entries(mimoTokens.radius);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: mimoTokens.spacing[16] }}>
      <h2
        style={{
          fontSize: mimoTokens.typography.size["2xl"],
          lineHeight: String(mimoTokens.typography.lineHeight.snug),
          marginBottom: mimoTokens.spacing[6],
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function UiDemoPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: mimoTokens.surface.app,
        color: mimoTokens.color.midnight,
        fontFamily: mimoTokens.typography.family.body,
        padding: mimoTokens.spacing[8],
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: mimoTokens.typography.size["4xl"],
            lineHeight: String(mimoTokens.typography.lineHeight.tight),
            fontFamily: mimoTokens.typography.family.heading,
            marginTop: 0,
            marginBottom: mimoTokens.spacing[4],
          }}
        >
          Mimo Design Tokens
        </h1>

        <p
          style={{
            color: mimoTokens.color.ink,
            marginTop: 0,
            marginBottom: mimoTokens.spacing[8],
          }}
        >
          Midnight Silk token preview aligned to the current shared package export surface.
        </p>

        <Section title="Color swatches">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: mimoTokens.spacing[4],
            }}
          >
            {colorRows.map(([name, value]) => (
              <div
                key={name}
                style={{
                  background: mimoTokens.surface.elevated,
                  border: mimoTokens.border.subtle,
                  borderRadius: mimoTokens.radius.md,
                  boxShadow: mimoTokens.shadow.soft,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: 96,
                    background: value,
                    borderBottom: mimoTokens.border.subtle,
                  }}
                />
                <div style={{ padding: mimoTokens.spacing[4] }}>
                  <div style={{ fontWeight: mimoTokens.typography.weight.semibold }}>{name}</div>
                  <div style={{ color: mimoTokens.color.ink, marginTop: mimoTokens.spacing[2] }}>
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Typography scale">
          <div
            style={{
              background: mimoTokens.surface.elevated,
              border: mimoTokens.border.subtle,
              borderRadius: mimoTokens.radius.md,
              boxShadow: mimoTokens.shadow.soft,
              padding: mimoTokens.spacing[6],
            }}
          >
            <div
              style={{
                fontSize: mimoTokens.typography.size["4xl"],
                lineHeight: String(mimoTokens.typography.lineHeight.tight),
                fontWeight: mimoTokens.typography.weight.bold,
                fontFamily: mimoTokens.typography.family.heading,
                marginBottom: mimoTokens.spacing[3],
              }}
            >
              Heading display
            </div>
            <div
              style={{
                fontSize: mimoTokens.typography.size["3xl"],
                lineHeight: String(mimoTokens.typography.lineHeight.snug),
                fontWeight: mimoTokens.typography.weight.semibold,
                fontFamily: mimoTokens.typography.family.heading,
                marginBottom: mimoTokens.spacing[3],
              }}
            >
              Section heading
            </div>
            <div
              style={{
                fontSize: mimoTokens.typography.size.base,
                lineHeight: String(mimoTokens.typography.lineHeight.normal),
                marginBottom: mimoTokens.spacing[3],
              }}
            >
              Body text for operational clarity, readable UI, and calm customer-facing surfaces.
            </div>
            <div
              style={{
                fontSize: mimoTokens.typography.size.sm,
                lineHeight: String(mimoTokens.typography.lineHeight.normal),
                color: mimoTokens.color.ink,
              }}
            >
              Supporting text and metadata.
            </div>
          </div>
        </Section>

        <Section title="Spacing scale">
          <div
            style={{
              background: mimoTokens.surface.elevated,
              border: mimoTokens.border.subtle,
              borderRadius: mimoTokens.radius.md,
              boxShadow: mimoTokens.shadow.soft,
              padding: mimoTokens.spacing[6],
            }}
          >
            <div style={{ display: "grid", gap: mimoTokens.spacing[3] }}>
              {spacingRows.map(([name, value]) => (
                <div
                  key={name}
                  style={{ display: "flex", alignItems: "center", gap: mimoTokens.spacing[4] }}
                >
                  <div style={{ width: 56, color: mimoTokens.color.ink }}>{name}</div>
                  <div
                    style={{
                      height: 16,
                      width: value,
                      minWidth: value,
                      background: mimoTokens.color.teal,
                      borderRadius: mimoTokens.radius.xs,
                    }}
                  />
                  <div style={{ color: mimoTokens.color.ink }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Radii">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: mimoTokens.spacing[4],
            }}
          >
            {radiusRows.map(([name, value]) => (
              <div
                key={name}
                style={{
                  background: mimoTokens.surface.elevated,
                  border: mimoTokens.border.subtle,
                  borderRadius: value,
                  boxShadow: mimoTokens.shadow.soft,
                  padding: mimoTokens.spacing[5],
                }}
              >
                <div
                  style={{
                    fontWeight: mimoTokens.typography.weight.semibold,
                    marginBottom: mimoTokens.spacing[2],
                  }}
                >
                  radius {name}
                </div>
                <div style={{ color: mimoTokens.color.ink }}>{value}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
