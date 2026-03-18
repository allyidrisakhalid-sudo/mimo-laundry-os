import { mimoBrand, mimoTokens } from "./tokens";

export const mimoCssVariables = {
  "--font-heading": mimoBrand.fonts.heading,
  "--font-body": mimoBrand.fonts.body,

  "--color-obsidian": mimoTokens.color.obsidian,
  "--color-midnight": mimoTokens.color.midnight,
  "--color-ink": mimoTokens.color.ink,

  "--color-silk": mimoTokens.color.silk,
  "--color-cloud": mimoTokens.color.cloud,
  "--color-mist": mimoTokens.color.mist,

  "--color-champagne": mimoTokens.color.champagne,
  "--color-teal": mimoTokens.color.teal,
  "--color-royal": mimoTokens.color.royal,
  "--color-plum": mimoTokens.color.plum,

  "--color-success": mimoTokens.color.success,
  "--color-warning": mimoTokens.color.warning,
  "--color-error": mimoTokens.color.error,
  "--color-info": mimoTokens.color.info,

  "--gradient-hero": mimoTokens.gradient.hero,
  "--gradient-accent": mimoTokens.gradient.accent,
  "--gradient-premium": mimoTokens.gradient.premium,

  "--space-1": mimoTokens.spacing[1],
  "--space-2": mimoTokens.spacing[2],
  "--space-3": mimoTokens.spacing[3],
  "--space-4": mimoTokens.spacing[4],
  "--space-5": mimoTokens.spacing[5],
  "--space-6": mimoTokens.spacing[6],
  "--space-8": mimoTokens.spacing[8],
  "--space-10": mimoTokens.spacing[10],
  "--space-12": mimoTokens.spacing[12],
  "--space-16": mimoTokens.spacing[16],

  "--radius-xs": mimoTokens.radius.xs,
  "--radius-sm": mimoTokens.radius.sm,
  "--radius-md": mimoTokens.radius.md,
  "--radius-lg": mimoTokens.radius.lg,
  "--radius-xl": mimoTokens.radius.xl,
  "--radius-pill": mimoTokens.radius.pill,

  "--shadow-soft": mimoTokens.shadow.soft,
  "--shadow-medium": mimoTokens.shadow.medium,
  "--shadow-elevated": mimoTokens.shadow.elevated,

  "--border-subtle": mimoTokens.border.subtle,
  "--border-strong": mimoTokens.border.strong,
  "--border-accent": mimoTokens.border.accent,

  "--motion-fast": mimoTokens.motion.fast,
  "--motion-standard": mimoTokens.motion.standard,
  "--motion-calm": mimoTokens.motion.calm,

  "--surface-app": mimoTokens.surface.app,
  "--surface-elevated": mimoTokens.surface.elevated,
  "--surface-muted": mimoTokens.surface.muted,
  "--surface-dark": mimoTokens.surface.dark,
} as const;

export function getMimoCssVariableBlock(): string {
  return Object.entries(mimoCssVariables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");
}
