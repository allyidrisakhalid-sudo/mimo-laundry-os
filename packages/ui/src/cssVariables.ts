import { tokens } from "./tokens/index";

const root = {
  "--mimo-color-primary": tokens.color.primary,
  "--mimo-color-primary-active": tokens.color.primaryActive,
  "--mimo-color-primary-soft": tokens.color.primarySoft,
  "--mimo-color-accent": tokens.color.accent,
  "--mimo-color-accent-soft": tokens.color.accentSoft,
  "--mimo-color-background": tokens.color.background,
  "--mimo-color-surface": tokens.color.surface,
  "--mimo-color-surface-2": tokens.color.surface2,
  "--mimo-color-border": tokens.color.border,
  "--mimo-color-text-primary": tokens.color.textPrimary,
  "--mimo-color-text-secondary": tokens.color.textSecondary,
  "--mimo-color-text-disabled": tokens.color.textDisabled,
  "--mimo-color-status-success": tokens.color.statusSuccess,
  "--mimo-color-status-warning": tokens.color.statusWarning,
  "--mimo-color-status-danger": tokens.color.statusDanger,
  "--mimo-color-status-info": tokens.color.statusInfo,
  "--mimo-font-sans": tokens.typography.fontFamily.sans,
  "--mimo-font-size-h1": tokens.typography.fontSize.h1,
  "--mimo-font-size-h2": tokens.typography.fontSize.h2,
  "--mimo-font-size-h3": tokens.typography.fontSize.h3,
  "--mimo-font-size-body": tokens.typography.fontSize.body,
  "--mimo-font-size-small": tokens.typography.fontSize.small,
  "--mimo-font-size-caption": tokens.typography.fontSize.caption,
  "--mimo-line-height-h1": tokens.typography.lineHeight.h1,
  "--mimo-line-height-h2": tokens.typography.lineHeight.h2,
  "--mimo-line-height-h3": tokens.typography.lineHeight.h3,
  "--mimo-line-height-body": tokens.typography.lineHeight.body,
  "--mimo-line-height-small": tokens.typography.lineHeight.small,
  "--mimo-line-height-caption": tokens.typography.lineHeight.caption,
  "--mimo-space-4": tokens.spacing[4],
  "--mimo-space-8": tokens.spacing[8],
  "--mimo-space-12": tokens.spacing[12],
  "--mimo-space-16": tokens.spacing[16],
  "--mimo-space-20": tokens.spacing[20],
  "--mimo-space-24": tokens.spacing[24],
  "--mimo-space-32": tokens.spacing[32],
  "--mimo-space-40": tokens.spacing[40],
  "--mimo-space-48": tokens.spacing[48],
  "--mimo-space-64": tokens.spacing[64],
  "--mimo-radius-8": tokens.radius[8],
  "--mimo-radius-12": tokens.radius[12],
  "--mimo-radius-16": tokens.radius[16],
  "--mimo-radius-20": tokens.radius[20],
  "--mimo-shadow-subtle": tokens.shadow.subtle,
} as const;

export function getTokenCssVariables() {
  return Object.entries(root)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n");
}
