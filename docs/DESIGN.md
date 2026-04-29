---
name: Ahd Design System
product: Ahd / عهد
theme: shadcn/ui radix-luma, mist base
direction: rtl
language: ar
font: Cairo
iconLibrary: Hugeicons
radiusBase: 10px
---

# Ahd Design System

This file is the design reference for Ahd / عهد prototypes. It should guide design agents when generating screens, flows, and component states. Ahd is an Arabic-first fintech workflow product for turning informal deals into funded, milestone-based contracts.

## How To Use This File

This guide follows a practical design-system documentation structure: product intent first, then tokens, typography, spacing, components, navigation patterns, accessibility, and prototype quality rules. Design agents should pair it with `docs/page_prototype_brief.md`, which describes the screens, workflows, data, and form fields.

When a prototype decision is unclear, prefer the semantic token or component pattern documented here over a one-off visual choice.

## Design Intent

Ahd should feel serious, calm, trustworthy, and operational. It is not a marketplace, not a marketing website, and not a decorative startup landing page. The product surface should feel like a focused financial workspace where contract state, payment state, and next action are always clear.

The visual language is Mist + Luma: light, precise, softly rounded, Apple-like in polish, but denser and more operational than a consumer app. Use quiet surfaces, restrained contrast, high readability, and purposeful state colors.

## Product Principles

- The dashboard is the main product surface.
- Every screen should answer: what is the contract state, what is the payment state, and what should this user do next?
- Separate creator identity from contract role. Show whether the user is `منشئ العقد`, `مقدم الخدمة`, or `الممول / المراجع`.
- Do not design separate "client UI" and "freelancer UI". Design one unified role-aware system.
- Prioritize clarity over visual decoration.
- Use Arabic as the primary UI language. English can appear only as secondary helper text when useful for demo clarity.

## Layout Direction

- Global direction: RTL.
- Primary navigation sits on the right.
- Content reading order flows right to left.
- Icons that imply direction should be mirrored when needed.
- Tooltips from the right sidebar should open toward the main content area, usually to the left.

## Color Tokens

Use semantic tokens, not arbitrary colors. The exact implementation uses OKLCH CSS variables from `src/styles/globals.css`; prototype tools may approximate visually if they cannot ingest OKLCH.

### Light Mode

| Token | Value | Usage |
| --- | --- | --- |
| `background` | `oklch(0.982 0.007 197.1)` | Main app background, quiet mist surface. |
| `foreground` | `oklch(0.148 0.01 228.8)` | Primary text. |
| `card` | `oklch(1 0 0)` | Cards, panels, elevated surfaces. |
| `primary` | `oklch(0.38 0.083 190.4)` | Main CTAs, active nav, brand mark. |
| `secondary` | `oklch(0.955 0.012 197.1)` | Secondary controls and neutral UI. |
| `muted` | `oklch(0.955 0.012 197.1)` | Subtle backgrounds. |
| `muted-foreground` | `oklch(0.53 0.025 213.5)` | Secondary text. |
| `accent` | `oklch(0.925 0.026 185.8)` | Active hover surfaces, selected filters. |
| `border` | `oklch(0.895 0.012 214.3)` | Dividers, card borders, input borders. |
| `success` | `oklch(0.53 0.12 151.6)` | Approved, released, completed. |
| `warning` | `oklch(0.78 0.14 78.4)` | Review window, action needed, deadline. |
| `funded` | `oklch(0.72 0.13 88.7)` | Funded money state. Use sparingly. |
| `info` | `oklch(0.55 0.1 238.2)` | Informational state and neutral notices. |
| `destructive` | `oklch(0.577 0.245 27.325)` | Dispute, release paused, destructive actions. |
| `sidebar` | `oklch(0.935 0.018 197.1)` | Sidebar background, slightly stronger than app background. |
| `sidebar-accent` | `oklch(0.88 0.035 185.8)` | Sidebar active/hover item surface. |
| `sidebar-border` | `oklch(0.82 0.018 214.3)` | Sidebar divider and edge. |

### Color Meaning

- Deep teal means trust, protection, and primary action.
- Green means fulfillment accepted or payment released.
- Amber means time-sensitive review or action required.
- Restrained gold means money is funded.
- Red means dispute, blocked release, or destructive choice.
- Gray/mist means draft, waiting, inactive, or supporting metadata.

## Typography

- Font family: Cairo.
- Use a professional Arabic-first type rhythm.
- Do not use negative letter spacing.
- Do not scale font size with viewport width.

Recommended scale:

| Role | Suggested class/size | Usage |
| --- | --- | --- |
| Page title | 28-32px, semibold | Dashboard and major pages. |
| Section title | 18-22px, semibold | Panels and page sections. |
| Card title | 15-17px, medium/semibold | Cards and milestone panels. |
| Body | 14-16px, regular | Descriptions and form text. |
| Metadata | 12-13px, regular | Status details, timestamps, helper labels. |

## Spacing And Shape

- Base spacing follows Tailwind/shadcn rhythm.
- Use 4px increments.
- Default card radius follows Luma rounded treatment: `rounded-4xl` in current components.
- Keep dense operational layouts balanced with generous section gaps.
- Do not nest cards inside cards.
- Use panels, separators, and bands instead of decorative boxes.

Recommended layout widths:

- Dashboard content max width: full flexible workspace with comfortable padding.
- Detail pages: two-column desktop layout when useful.
- Mobile: stacked sections; no horizontal tables.

## Elevation

- Use subtle shadows only.
- Cards should use quiet shadow/ring treatment.
- Dialogs and sheets may use stronger elevation.
- Avoid glassmorphism, glow effects, gradient orbs, and decorative blurred backgrounds.

## Iconography

- Icon library: Hugeicons.
- Use line icons with consistent stroke width.
- Use icons in buttons where they clarify actions.
- Temporary product mark: `LegalDocument01Icon`.
- Preferred icons:
  - Contracts: `LegalDocument01Icon` or `File01Icon`.
  - Dashboard: `Home01Icon`.
  - People/parties: `UserGroupIcon`.
  - Funding/payment: wallet/payment icon from Hugeicons.
  - Review/time: clock/time icon from Hugeicons.
  - Settings/help: `Settings01Icon`, help circle icon.

## Components

Use shadcn/ui composition and Luma styling. Design agents should represent these components faithfully.

### Buttons

- Primary button: deep teal background, white text.
- Secondary button: muted surface, strong foreground.
- Outline button: card/background surface, visible border.
- Destructive button: destructive color treatment only for disputes/cancel.
- Disabled buttons must look clearly inactive.
- Include icons for clear commands such as create, fund, submit, approve, review, settings, and help.

### Cards

- Use cards for actual objects: contracts, milestones, summary metrics, review panels.
- Card radius should match current Luma shape.
- Do not place cards inside cards.
- Repeated cards should have consistent internal layout.

### Badges

Badges are mandatory for state.

Suggested badge mapping:

- Draft: neutral.
- Sent: info.
- Accepted: primary.
- Funded: funded/gold.
- Under review: warning.
- Revision requested: warning.
- Change requested: info or warning.
- Disputed: destructive.
- Approved: success.
- Auto-approved: success with time/automation cue.
- Released: success.
- Release paused: destructive.

### Tables And Lists

- Desktop dashboard can use a table for contract scanning.
- Mobile must use stacked cards.
- Every contract row/card should include title, other party, role, status, amount, current milestone, and next action.

### Forms

- Use clear sections and field grouping.
- Avoid long single-column walls on desktop; group related fields.
- Required fields should be obvious.
- Validation messages should be concise and human.
- For role selection, use two large selectable cards.
- For acceptance confirmation, use a modal with text input requiring `أقبل هذا العقد`.

### Dialogs And Sheets

- Acceptance confirmation must be a dialog.
- Submit completion request can be dialog or page, but the prototype should show the dialog version if space allows.
- Mobile review actions can become sheets/drawers.

### Empty States

Use real product empty states, not generic illustrations.

Examples:

- No contracts: "أنشئ أول عقد وحدد متى يتم صرف الدفعات."
- No action needed: "لا توجد إجراءات مطلوبة منك الآن."
- Waiting: "هذه العقود بانتظار الطرف الآخر."

## Navigation

Sidebar is icon-collapsible and RTL on the right.

Main items:

- الرئيسية
- العقود
- إجراء مطلوب
- المدفوعات

Bottom actions:

- الإعدادات
- المساعدة

Settings and help are bottom sidebar actions, not pages. They may open small popovers/dialogs in prototypes.

Sidebar footer:

- Current demo user.
- Role hint.
- Switch/logout action.

Header:

- Page title.
- Current user/role context.
- Primary action `إنشاء عقد`.
- Optional settings/help icons if appropriate.

## Accessibility

- Maintain strong contrast between text and surfaces.
- Never communicate status with color alone; pair badges with text.
- Forms require labels.
- Dialogs require clear titles.
- Buttons must have readable text or accessible labels.
- Disabled states must be visually distinct.

## Content Voice

Tone: clear, calm, formal but not legalistic.

Prefer:

- `قبول العقد`
- `تمويل المرحلة`
- `إرسال طلب الإنجاز`
- `مراجعة الطلب`
- `طلب تعديل`
- `طلب تغيير مدفوع`
- `فتح نزاع`

Avoid:

- Agreement as the core object.
- Marketplace language.
- Legal-heavy jargon.
- Overly playful copy.

## Prototype Quality Bar

Every prototype must show:

- The user's role on the screen.
- Contract or milestone state.
- Payment/funding state where relevant.
- The next action.
- Audit/timeline proof where relevant.
- Mobile-safe layout.

## Structure References

The structure of this guide was informed by common design-system documentation patterns: token-driven foundations, component usage guidance, interaction patterns, accessibility notes, and content guidelines.

- VA.gov Design System component guidance: https://design.va.gov/about/designers/creating-components
- Design system documentation overview: https://www.daasign.io/topics/design-system-documentation
- Design tokens guide: https://design.dev/guides/design-systems/
- User flow template guidance: https://miro.com/templates/user-flow/
