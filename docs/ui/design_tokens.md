# Design Tokens Chapter 7.1

## Purpose

Laundry OS uses shared semantic design tokens from `packages/ui` as the single source of truth for web and mobile UI foundations.

## Visual direction

- Warm and welcoming
- Mass market friendly
- Light theme first
- Semantic token naming only

## Palette

- `color.primary` `#0F766E`
- `color.primaryActive` `#115E59`
- `color.primarySoft` `#CCFBF1`
- `color.accent` `#F97316`
- `color.accentSoft` `#FFEDD5`
- `color.background` `#F8FAFC`
- `color.surface` `#FFFFFF`
- `color.surface2` `#F1F5F9`
- `color.border` `#E2E8F0`
- `color.textPrimary` `#0F172A`
- `color.textSecondary` `#475569`
- `color.textDisabled` `#94A3B8`
- `color.statusSuccess` `#16A34A`
- `color.statusWarning` `#F59E0B`
- `color.statusDanger` `#DC2626`
- `color.statusInfo` `#2563EB`

## Typography

- Font family: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- `h1` `2.25rem / 2.75rem`
- `h2` `1.875rem / 2.25rem`
- `h3` `1.5rem / 2rem`
- `body` `1rem / 1.5rem`
- `small` `0.875rem / 1.25rem`
- `caption` `0.75rem / 1rem`

## Spacing scale

- `4px`
- `8px`
- `12px`
- `16px`
- `20px`
- `24px`
- `32px`
- `40px`
- `48px`
- `64px`

## Radius scale

- `8px`
- `12px`
- `16px`
- `20px`

## Naming conventions

- Use semantic names:
  - `color.primary`
  - `color.surface`
  - `color.textPrimary`
  - `color.statusSuccess`
- Do not hardcode palette hex values in application screens.
- Web consumes CSS variables through `@mimo/ui/styles.css`.
- Mobile consumes the same token object directly from `@mimo/ui`.

## Baseline styling

- CSS reset with border-box sizing
- Global background and text color defaults
- Inter-based sans stack
- Accessible focus ring using accent color
- Subtle shadow and neutral border baseline
