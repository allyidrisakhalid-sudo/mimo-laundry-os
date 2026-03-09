import { tokens } from "@mimo/ui";

const colorRows = [
  ["primary", tokens.color.primary],
  ["primaryActive", tokens.color.primaryActive],
  ["primarySoft", tokens.color.primarySoft],
  ["accent", tokens.color.accent],
  ["accentSoft", tokens.color.accentSoft],
  ["background", tokens.color.background],
  ["surface", tokens.color.surface],
  ["surface2", tokens.color.surface2],
  ["border", tokens.color.border],
  ["textPrimary", tokens.color.textPrimary],
  ["textSecondary", tokens.color.textSecondary],
  ["textDisabled", tokens.color.textDisabled],
  ["statusSuccess", tokens.color.statusSuccess],
  ["statusWarning", tokens.color.statusWarning],
  ["statusDanger", tokens.color.statusDanger],
  ["statusInfo", tokens.color.statusInfo],
] as const;

const spacingRows = Object.entries(tokens.spacing);
const radiusRows = Object.entries(tokens.radius);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: tokens.spacing[32] }}>
      <h2
        style={{
          fontSize: tokens.typography.fontSize.h2,
          lineHeight: tokens.typography.lineHeight.h2,
          marginBottom: tokens.spacing[16],
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
        background: tokens.color.background,
        color: tokens.color.textPrimary,
        fontFamily: tokens.typography.fontFamily.sans,
        padding: tokens.spacing[24],
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: tokens.typography.fontSize.h1,
            lineHeight: tokens.typography.lineHeight.h1,
            marginTop: 0,
            marginBottom: tokens.spacing[12],
          }}
        >
          Laundry OS Design Tokens
        </h1>
        <p
          style={{
            color: tokens.color.textSecondary,
            marginTop: 0,
            marginBottom: tokens.spacing[32],
          }}
        >
          Warm and welcoming, mass-market visual baseline powered by shared semantic tokens.
        </p>

        <Section title="Color swatches">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: tokens.spacing[16],
            }}
          >
            {colorRows.map(([name, value]) => (
              <div
                key={name}
                style={{
                  background: tokens.color.surface,
                  border: `1px solid ${tokens.color.border}`,
                  borderRadius: tokens.radius[16],
                  boxShadow: tokens.shadow.subtle,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: 96,
                    background: value,
                    borderBottom: `1px solid ${tokens.color.border}`,
                  }}
                />
                <div style={{ padding: tokens.spacing[16] }}>
                  <div style={{ fontWeight: tokens.typography.fontWeight.semibold }}>{name}</div>
                  <div style={{ color: tokens.color.textSecondary, marginTop: tokens.spacing[8] }}>
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
              background: tokens.color.surface,
              border: `1px solid ${tokens.color.border}`,
              borderRadius: tokens.radius[16],
              boxShadow: tokens.shadow.subtle,
              padding: tokens.spacing[24],
            }}
          >
            <div
              style={{
                fontSize: tokens.typography.fontSize.h1,
                lineHeight: tokens.typography.lineHeight.h1,
                fontWeight: tokens.typography.fontWeight.bold,
                marginBottom: tokens.spacing[12],
              }}
            >
              H1 Fast, trusted laundry for every household
            </div>
            <div
              style={{
                fontSize: tokens.typography.fontSize.h2,
                lineHeight: tokens.typography.lineHeight.h2,
                fontWeight: tokens.typography.fontWeight.semibold,
                marginBottom: tokens.spacing[12],
              }}
            >
              H2 Clear status, simple actions, human warmth
            </div>
            <div
              style={{
                fontSize: tokens.typography.fontSize.h3,
                lineHeight: tokens.typography.lineHeight.h3,
                fontWeight: tokens.typography.fontWeight.semibold,
                marginBottom: tokens.spacing[12],
              }}
            >
              H3 Designed for busy customers, affiliates, hubs, and drivers
            </div>
            <div
              style={{
                fontSize: tokens.typography.fontSize.body,
                lineHeight: tokens.typography.lineHeight.body,
                marginBottom: tokens.spacing[12],
              }}
            >
              Body Laundry OS provides end-to-end visibility across zones, hubs, drivers,
              affiliates, and customers.
            </div>
            <div
              style={{
                fontSize: tokens.typography.fontSize.small,
                lineHeight: tokens.typography.lineHeight.small,
                color: tokens.color.textSecondary,
                marginBottom: tokens.spacing[8],
              }}
            >
              Small Secondary information, helper text, and supporting labels.
            </div>
            <div
              style={{
                fontSize: tokens.typography.fontSize.caption,
                lineHeight: tokens.typography.lineHeight.caption,
                color: tokens.color.textDisabled,
              }}
            >
              Caption Metadata, timestamps, and subtle descriptors.
            </div>
          </div>
        </Section>

        <Section title="Spacing scale">
          <div
            style={{
              background: tokens.color.surface,
              border: `1px solid ${tokens.color.border}`,
              borderRadius: tokens.radius[16],
              boxShadow: tokens.shadow.subtle,
              padding: tokens.spacing[24],
            }}
          >
            <div style={{ display: "grid", gap: tokens.spacing[12] }}>
              {spacingRows.map(([name, value]) => (
                <div
                  key={name}
                  style={{ display: "flex", alignItems: "center", gap: tokens.spacing[16] }}
                >
                  <div style={{ width: 56, color: tokens.color.textSecondary }}>{name}</div>
                  <div
                    style={{
                      height: 16,
                      width: value,
                      minWidth: value,
                      background: tokens.color.primary,
                      borderRadius: tokens.radius[8],
                    }}
                  />
                  <div style={{ color: tokens.color.textSecondary }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Radii + surfaces">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: tokens.spacing[16],
            }}
          >
            {radiusRows.map(([name, value]) => (
              <div
                key={name}
                style={{
                  background: tokens.color.surface,
                  border: `1px solid ${tokens.color.border}`,
                  borderRadius: value,
                  boxShadow: tokens.shadow.subtle,
                  padding: tokens.spacing[20],
                }}
              >
                <div
                  style={{
                    fontWeight: tokens.typography.fontWeight.semibold,
                    marginBottom: tokens.spacing[8],
                  }}
                >
                  radius {name}
                </div>
                <div style={{ color: tokens.color.textSecondary }}>{value}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
