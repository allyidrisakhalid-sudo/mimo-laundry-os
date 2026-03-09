# Component Library v1

## Styling approach

Laundry OS UI components use a single token-backed utility class approach in `packages/ui`.
Components rely on shared design tokens and CSS variables from Chapter 7.1.

## Components included

### Button

- Variants: `primary`, `secondary`, `ghost`, `danger`
- Sizes: `sm`, `md`, `lg`
- States: `loading`, `disabled`
- Optional icon slots: `leftIcon`, `rightIcon`

### Input

- Sizes: `sm`, `md`
- Types: `text`, `phone`, `password`
- Supports:
  - `label`
  - `helperText`
  - `error`

### Card

- Variants: `default`, `subtle`, `clickable`
- Composition:
  - `Card`
  - `CardHeader`
  - `CardTitle`
  - `CardDescription`
  - `CardContent`
  - `CardFooter`

### Badge

- Variants: `neutral`, `info`, `success`, `warning`, `danger`

### Toast

- Helpers via `useToast()`:
  - `showSuccess`
  - `showError`
  - `showInfo`
- Supports auto-dismiss and stacked notifications

### Modal

- Controlled with `open` and `onClose`
- Supports `title`, body content, and `footer`

### Skeleton

- `SkeletonLine`
- `SkeletonCard`
- `SkeletonList`

### OrderTimeline

- Accepts array of items with:
  - `label`
  - `timestamp`
  - `status`
  - `proofHref`
- Status values:
  - `done`
  - `current`
  - `pending`
  - `error`

## Prop guidelines

- Keep props minimal and composable
- Prefer token-backed visual variants over one-off styling props
- Prefer controlled behavior for interactive overlays like `Modal`
- Preserve semantic HTML and keyboard focus behavior

## Accessibility notes

- Buttons and modal close controls have visible focus states
- Inputs wire labels and helper/error text using accessible attributes
- Toasts announce with polite live region behavior
- Modal supports Escape-to-close and overlay click close
- Clickable card demo uses keyboard focus via `tabIndex={0}`

## Token usage rule

Components must use shared tokens and CSS variables.
No raw hex color values are allowed inside component implementations.
