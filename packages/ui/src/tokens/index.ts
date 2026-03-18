export const mimoBrand = {
  name: "Midnight Silk",
  direction: "premium smooth operational luxury",
  fonts: {
    heading: "'Plus Jakarta Sans', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
  },
  icons: {
    family: "lucide",
    style: "rounded-outline",
  },
  imagery: {
    direction: "real, premium, believable",
    avoid: [
      "cheesy stock look",
      "cartoon mascot direction",
      "decorative visual clutter",
    ],
  },
} as const;

export const mimoTokens = {
  color: {
    obsidian: "#0B1020",
    midnight: "#121A2F",
    ink: "#1C2740",

    silk: "#F8F7F4",
    cloud: "#F1EFEA",
    mist: "#E7E3DB",

    champagne: "#D6B36A",
    teal: "#3AB8B2",
    royal: "#6F8CFF",
    plum: "#7B61A8",

    success: "#24A36A",
    warning: "#E6A23C",
    error: "#D95C75",
    info: "#4E8DFF",
  },
  gradient: {
    hero: "linear-gradient(135deg, #0B1020 0%, #121A2F 58%, #1C2740 100%)",
    accent: "linear-gradient(135deg, #3AB8B2 0%, #6F8CFF 100%)",
    premium: "linear-gradient(135deg, #D6B36A 0%, #7B61A8 100%)",
  },
  typography: {
    family: {
      heading: "'Plus Jakarta Sans', system-ui, sans-serif",
      body: "'Inter', system-ui, sans-serif",
    },
    size: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px",
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      snug: 1.35,
      normal: 1.5,
      relaxed: 1.65,
    },
  },
  spacing: {
    0: "0px",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
  },
  radius: {
    xs: "8px",
    sm: "12px",
    md: "16px",
    lg: "20px",
    xl: "24px",
    pill: "999px",
  },
  shadow: {
    soft: "0 8px 24px rgba(11, 16, 32, 0.08)",
    medium: "0 14px 36px rgba(11, 16, 32, 0.12)",
    elevated: "0 20px 50px rgba(11, 16, 32, 0.16)",
  },
  border: {
    subtle: "1px solid rgba(18, 26, 47, 0.10)",
    strong: "1px solid rgba(18, 26, 47, 0.18)",
    accent: "1px solid rgba(58, 184, 178, 0.35)",
  },
  motion: {
    fast: "120ms ease",
    standard: "180ms ease",
    calm: "240ms ease",
  },
  surface: {
    app: "#F8F7F4",
    elevated: "#FFFFFF",
    muted: "#F1EFEA",
    dark: "#121A2F",
  },
} as const;

export type MimoTokens = typeof mimoTokens;
export type MimoBrand = typeof mimoBrand;
