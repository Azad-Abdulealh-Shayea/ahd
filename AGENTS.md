# AGENTS.md

This file is the always-on working guide for coding agents in this repo. Keep product details in `docs/`; use this file for commands, conventions, and project rules that should affect every change.

## Start Here

- Read `docs/main_project_description.md` before changing product behavior.
- Read `docs/mvp_implementation_plan.md` before adding new pages, models, or workflows.
- Treat the app as an Arabic-first hackathon MVP. Optimize for a clear demo and polished UX.
- The core object is a `Contract` / `عقد`. Do not introduce "agreement" as a user-facing object name.

## Commands

Use Bun. Do not add npm, pnpm, or yarn lockfiles.

```bash
bun install
bun run dev
bun run typecheck
bun run lint
bun run format:write
bun run db:push
```

Use shadcn/ui through Bun:

```bash
bunx --bun shadcn@latest ...
```

After Prisma schema changes, run `bun run db:push`. After meaningful TypeScript or UI changes, run `bun run typecheck` and `bun run lint` when feasible.

## UX Rules For Every Feature

- UX is not secondary in this project. Every feature should make the contract state, payment state, and next action easier to understand.
- Prefer Arabic-first labels and RTL layouts for core screens.
- Use concise English only when it improves hackathon demo clarity.
- Do not build marketing-style landing pages unless explicitly requested. The product surface should be useful immediately.
- Show important state with visible UI: status badges, revision counts, review deadlines, funding state, and audit events.
- Keep flows structured. Review actions should guide users toward approve, revision, change order, or dispute without ambiguity.
- Empty, loading, disabled, error, and success states matter. Use shadcn/ui primitives for them.

## UI Conventions

- Use shadcn/ui components before custom markup.
- Follow the project `components.json` once shadcn is initialized. Use its aliases, style, base primitive, and icon library.
- Use `Card` for real contained objects or panels, not decorative page sections.
- Use `Badge` for statuses, `Table` for dense desktop lists, stacked cards for mobile lists, `Dialog` or `Sheet` for focused actions, `Alert` for important state, `Empty` for empty states, `Skeleton` for loading, and `Sonner` for feedback.
- Avoid nested cards and decorative clutter.
- Icons in buttons should come from the configured icon library.
- Keep layouts responsive and verify that Arabic text does not overflow buttons, cards, or tables.

## Workflow Rules

- Keep contract and payment state transitions on the server. React components may explain state, but must not be the only place enforcing rules.
- Every major contract action should create an audit log event.
- Do not release payment unless the milestone is funded, approved or auto-approved, not disputed, and not already released.
- Revision requests are limited by `revisionsUsed < revisionsAllowed`.
- When revisions are exhausted, guide users to approve, request a paid change order, or open a criteria-based dispute.
- Disputes must reference acceptance criteria. Do not create vague "I do not like it" dispute flows.
- Change orders represent out-of-scope paid work. Do not silently treat them as free revisions.

## Code Organization

- Keep route files thin.
- Put reusable app UI in `src/components/app`.
- Put shadcn primitives in `src/components/ui`.
- Put contract-specific UI, schemas, status helpers, and copy in `src/features/contracts`.
- Put tRPC routers in `src/server/api/routers`.
- Put server-side workflow logic in `src/server/services`.
- Prefer small, named helpers for status formatting, money formatting, deadline formatting, and next-action labels.

## Engineering Practices

- Follow existing project patterns before adding new abstractions.
- Use `rg` for searching.
- Use `apply_patch` for manual edits.
- Do not revert user changes unless explicitly asked.
- Keep edits scoped to the requested feature.
- Remove the default T3 sample code only when replacing it with working Ahd functionality.
- If adding shadcn components, inspect generated files and fix imports to match project aliases and icon configuration.

## Demo Judgment

When choosing between more features and a clearer golden path, choose the clearer golden path. Ahd should quickly show that it is a contract execution workflow connected to payment state, not just a static contract document.


Concise rules for building accessible, fast, delightful UIs. Use MUST/SHOULD/NEVER to guide decisions.

## Interactions

### Keyboard

- MUST: Full keyboard support per [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/)
- MUST: Visible focus rings (`:focus-visible`; group with `:focus-within`)
- MUST: Manage focus (trap, move, return) per APG patterns
- NEVER: `outline: none` without visible focus replacement

### Targets & Input

- MUST: Hit target ≥24px (mobile ≥44px); if visual <24px, expand hit area
- MUST: Mobile `<input>` font-size ≥16px to prevent iOS zoom
- NEVER: Disable browser zoom (`user-scalable=no`, `maximum-scale=1`)
- MUST: `touch-action: manipulation` to prevent double-tap zoom
- SHOULD: Set `-webkit-tap-highlight-color` to match design

### Forms

- MUST: Hydration-safe inputs (no lost focus/value)
- NEVER: Block paste in `<input>`/`<textarea>`
- MUST: Loading buttons show spinner and keep original label
- MUST: Enter submits focused input; in `<textarea>`, ⌘/Ctrl+Enter submits
- MUST: Keep submit enabled until request starts; then disable with spinner
- MUST: Accept free text, validate after—don't block typing
- MUST: Allow incomplete form submission to surface validation
- MUST: Errors inline next to fields; on submit, focus first error
- MUST: `autocomplete` + meaningful `name`; correct `type` and `inputmode`
- SHOULD: Disable spellcheck for emails/codes/usernames
- SHOULD: Placeholders end with `…` and show example pattern
- MUST: Warn on unsaved changes before navigation
- MUST: Compatible with password managers & 2FA; allow pasting codes
- MUST: Trim values to handle text expansion trailing spaces
- MUST: No dead zones on checkboxes/radios; label+control share one hit target

### State & Navigation

- MUST: URL reflects state (deep-link filters/tabs/pagination/expanded panels)
- MUST: Back/Forward restores scroll position
- MUST: Links use `<a>`/`<Link>` for navigation (support Cmd/Ctrl/middle-click)
- NEVER: Use `<div onClick>` for navigation

### Feedback

- SHOULD: Optimistic UI; reconcile on response; on failure rollback or offer Undo
- MUST: Confirm destructive actions or provide Undo window
- MUST: Use polite `aria-live` for toasts/inline validation
- SHOULD: Ellipsis (`…`) for options opening follow-ups ("Rename…") and loading states ("Loading…")

### Touch & Drag

- MUST: Generous targets, clear affordances; avoid finicky interactions
- MUST: Delay first tooltip; subsequent peers instant
- MUST: `overscroll-behavior: contain` in modals/drawers
- MUST: During drag, disable text selection and set `inert` on dragged elements
- MUST: If it looks clickable, it must be clickable

### Autofocus

- SHOULD: Autofocus on desktop with single primary input; rarely on mobile

## Animation

- MUST: Honor `prefers-reduced-motion` (provide reduced variant or disable)
- SHOULD: Prefer CSS > Web Animations API > JS libraries
- MUST: Animate compositor-friendly props (`transform`, `opacity`) only
- NEVER: Animate layout props (`top`, `left`, `width`, `height`)
- NEVER: `transition: all`—list properties explicitly
- SHOULD: Animate only to clarify cause/effect or add deliberate delight
- SHOULD: Choose easing to match the change (size/distance/trigger)
- MUST: Animations interruptible and input-driven (no autoplay)
- MUST: Correct `transform-origin` (motion starts where it "physically" should)
- MUST: SVG transforms on `<g>` wrapper with `transform-box: fill-box`

## Layout

- SHOULD: Optical alignment; adjust ±1px when perception beats geometry
- MUST: Deliberate alignment to grid/baseline/edges—no accidental placement
- SHOULD: Balance icon/text lockups (weight/size/spacing/color)
- MUST: Verify mobile, laptop, ultra-wide (simulate ultra-wide at 50% zoom)
- MUST: Respect safe areas (`env(safe-area-inset-*)`)
- MUST: Avoid unwanted scrollbars; fix overflows
- SHOULD: Flex/grid over JS measurement for layout

## Content & Accessibility

- SHOULD: Inline help first; tooltips last resort
- MUST: Skeletons mirror final content to avoid layout shift
- MUST: `<title>` matches current context
- MUST: No dead ends; always offer next step/recovery
- MUST: Design empty/sparse/dense/error states
- SHOULD: Curly quotes (" "); avoid widows/orphans (`text-wrap: balance`)
- MUST: `font-variant-numeric: tabular-nums` for number comparisons
- MUST: Redundant status cues (not color-only); icons have text labels
- MUST: Accessible names exist even when visuals omit labels
- MUST: Use `…` character (not `...`)
- MUST: `scroll-margin-top` on headings; "Skip to content" link; hierarchical `<h1>`–`<h6>`
- MUST: Resilient to user-generated content (short/avg/very long)
- MUST: Locale-aware dates/times/numbers (`Intl.DateTimeFormat`, `Intl.NumberFormat`)
- SHOULD: `translate="no"` on brand names, code tokens, & identifiers to prevent garbled auto-translation
- MUST: Accurate `aria-label`; decorative elements `aria-hidden`
- MUST: Icon-only buttons have descriptive `aria-label`
- MUST: Prefer native semantics (`button`, `a`, `label`, `table`) before ARIA
- MUST: Non-breaking spaces: `10&nbsp;MB`, `⌘&nbsp;K`, brand names

## Content Handling

- MUST: Text containers handle long content (`truncate`, `line-clamp-*`, `break-words`)
- MUST: Flex children need `min-w-0` to allow truncation
- MUST: Handle empty states—no broken UI for empty strings/arrays

## Performance

- SHOULD: Test iOS Low Power Mode and macOS Safari
- MUST: Measure reliably (disable extensions that skew runtime)
- MUST: Track and minimize re-renders (React DevTools/React Scan)
- MUST: Profile with CPU/network throttling
- MUST: Batch layout reads/writes; avoid reflows/repaints
- MUST: Mutations (`POST`/`PATCH`/`DELETE`) target <500ms
- SHOULD: Prefer uncontrolled inputs; controlled inputs cheap per keystroke
- MUST: Virtualize large lists (>50 items)
- MUST: Preload above-fold images; lazy-load the rest
- MUST: Prevent CLS (explicit image dimensions)
- SHOULD: `<link rel="preconnect">` for CDN domains
- SHOULD: Critical fonts: `<link rel="preload" as="font">` with `font-display: swap`

## Dark Mode & Theming

- MUST: `color-scheme: dark` on `<html>` for dark themes
- SHOULD: `<meta name="theme-color">` matches page background
- MUST: Native `<select>`: explicit `background-color` and `color` (Windows fix)

## Hydration

- MUST: Inputs with `value` need `onChange` (or use `defaultValue`)
- SHOULD: Guard date/time rendering against hydration mismatch

## Design

- SHOULD: Layered shadows (ambient + direct)
- SHOULD: Crisp edges via semi-transparent borders + shadows
- SHOULD: Nested radii: child ≤ parent; concentric
- SHOULD: Hue consistency: tint borders/shadows/text toward bg hue
- MUST: Accessible charts (color-blind-friendly palettes)
- MUST: Meet contrast—prefer [APCA](https://apcacontrast.com/) over WCAG 2
- MUST: Increase contrast on `:hover`/`:active`/`:focus`
- SHOULD: Match browser UI to bg
- SHOULD: Avoid dark color gradient banding (use background images when needed)
