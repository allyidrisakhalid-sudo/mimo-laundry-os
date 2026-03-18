# Component States and Rules  Mimo Phase 2

## 1) Universal States

Every relevant Phase 2 component inherits a shared state model.

Universal states:
- default
- hover
- focus
- active
- selected
- loading
- empty
- disabled
- error
- success

State baseline:
- every interactive component must define hover, focus, and disabled
- every data component must define loading and empty
- every form component must define error and helper state
- every selection component must define selected state
- focus visibility is mandatory
- disabled state must remain readable, not invisible
- 403 state must be a deliberate permission surface, not a broken page
- loading state must preserve layout stability
- empty state must preserve dignity and next-step clarity

---

## 2) Interactive States

### Default
- calm, readable, token-aligned visual baseline
- no exaggerated chrome
- structure and hierarchy must be clear before interaction

### Hover
- visible on pointer-capable devices only
- subtle elevation, tint, or border refinement
- may not cause layout shift
- hover must never be the only sign of interactivity

### Focus
- mandatory visible focus ring or equivalent token-based focus treatment
- focus must be distinct from hover
- keyboard users must be able to locate active control immediately
- focus cannot be removed for aesthetics

### Active
- immediate pressed or engaged feedback
- used for buttons, nav items, tabs, toggles, and similar controls
- active state must feel intentional but restrained
- active treatment must not break token consistency

### Selected
- used when a component stays chosen beyond the moment of click
- examples: active nav item, selected filter chip, chosen row, chosen step
- selected must remain visually obvious without overwhelming the layout
- selected must not be confused with hover or focus

---

## 3) Disabled and Restricted States

### Disabled
- disabled controls must still be readable
- disabled elements must clearly look unavailable
- disabled elements must not appear broken or hidden
- explanatory helper text should be used where the reason is not obvious

### Restricted
- restricted content or actions must not silently fail
- when a user lacks permission, the interface must present a deliberate restricted or 403 surface
- permission surfaces must explain that access is unavailable for the current role
- permission surfaces must not mimic data loading or generic error states

### Destructive Action Color Handling
- destructive styling is reserved for actions with real irreversible or high-risk consequences
- destructive color treatment must be used consistently across dialogs, buttons, and alerts
- danger treatment must remain premium and restrained, not loud or cartoonish
- neutral actions may not use destructive tones for emphasis

---

## 4) Empty and Loading States

### Empty
- empty states must explain which empty condition is happening:
  - no data yet
  - no results after filtering
  - no role-relevant content
- empty states must keep dignity and clarity
- empty states should include the next step where appropriate
- empty states must not blame the user

### Loading
- loading states must preserve the final layout footprint
- skeletons are preferred over spinner-only experiences
- animation must remain subtle
- loading states must not cause major page jumps when data resolves
- loading should mirror the component being loaded:
  - dashboard cards load like cards
  - tables load like rows/columns
  - forms load like fields
  - detail pages load like sections

---

## 5) Validation and Error States

### Helper State
- helper text appears near the relevant field or control
- helper text is short and practical
- helper copy must not be confused with error styling

### Error State
- error must appear close to the relevant field or component
- the user must understand what to fix
- raw technical jargon is not allowed
- top-level form error may exist, but must not replace field-level mapping

### Success State
- success is used selectively where reassurance matters
- success must not flood the interface
- success treatment must follow locked success tokens

### Warning State
- warning is distinct from error
- warning explains caution or risk without implying failure
- warning must stay calm and actionable

---

## 6) Permission and 403 Surface Rules

- 403 is a designed surface, not a crash state
- restricted pages must remain inside the approved shell where appropriate
- the user should know:
  - they reached a valid place
  - their role cannot access it
  - where to go next if applicable
- 403 surfaces should use:
  - clear title
  - short explanation
  - safe next step or return action
- permission surfaces must not expose hidden operational data

---

## 7) Mobile and Responsive State Rules

- responsive behavior may reflow layout but may not change core meaning
- hover-dependent behavior must always have touch-safe alternatives
- focus visibility remains mandatory on mobile keyboard flows
- disabled, error, and selected states must remain clear at smaller sizes
- skeletons and empty states must remain compact on mobile
- dense dashboard layouts may reduce secondary detail on smaller screens, but primary identifiers and statuses must remain visible
- pointer targets must remain comfortable for touch interaction
- stacked controls must keep clear tap separation

### Keyboard Interaction Expectation
- all interactive controls must support keyboard navigation where applicable
- dialogs must trap and restore focus correctly
- menus and form controls must remain operable without a mouse
- keyboard order must follow logical visual order

### Pointer Target Sizing Expectations
- controls must be large enough for confident touch use
- compact controls may exist for dense operational layouts, but must remain usable
- icon-only targets must still meet comfortable tap expectations

### Density Consistency Rules for Dashboard vs Mobile
- desktop dashboards may use denser presentation for scanning
- mobile layouts must reduce density without losing clarity
- dense tables may transform into cards/lists on mobile, but state and meaning must remain intact
- card rhythm, spacing, and visual hierarchy must remain consistent with Midnight Silk tokens

---

## 8) State Lock Statement

P2.2 State Lock

All current and future Phase 2 components must inherit this shared state model.

No component may:
- invent undocumented hover, focus, or disabled behavior
- omit loading or empty rules where required
- hide focus for visual preference
- treat restricted access as a broken page
- introduce ad hoc destructive styles
- invent inconsistent density behavior across breakpoints

Any new state behavior must be added by a later approved chapter, not improvised during implementation.
