export const designTokens = {
  colors: {
    primary: "#1D4ED8",
    accent: "#0EA5E9",
  },
  radii: {
    md: "8px",
  },
  spacing: {
    md: "16px",
  },
};

export function Button(label: string): string {
  return `<button>${label}</button>`;
}
