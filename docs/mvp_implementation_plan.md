# Ahd MVP Implementation Plan

This plan translates the product brief in `docs/main_project_description.md` into a practical build path for the current T3 Stack project. The goal is to build a polished Arabic-first hackathon MVP for Ahd / عهد, where informal deals become structured, funded milestone contracts and payment release follows contract state.

## Product Focus

Ahd is a contract execution workflow, not a freelancer marketplace and not a legal document generator. The MVP should prove one thing clearly: a user can create a contract, define milestone fulfillment, send it to the other party, fund the first milestone, submit a milestone completion request, review the work, and release or pause payment based on deterministic contract rules.

The demo should make this understandable within two minutes:

1. A contract was created.
2. The milestone was funded.
3. A milestone completion request was submitted against acceptance criteria.
4. The reviewer had structured actions.
5. Payment was released because the state machine allowed it.
6. Ghosting and infinite revisions are constrained.
7. The audit trail records what happened.

## MVP Scope

Build these features:

- Contract creation.
- Milestone creation.
- Deliverables and acceptance criteria.
- Revision limits and revision counters.
- Review windows.
- Mock funding and mock payout/release.
- Invite/acceptance flow for the other party.
- Milestone completion request flow.
- Milestone review flow.
- Revision, change order, and dispute actions.
- Auto-approval simulation for expired review windows.
- Contract audit trail.
- Demo reset.
- Polished Arabic-first UI.

Do not build these features:

- Real authentication.
- Real payment gateway integration.
- Real escrow.
- Real legal contract generation.
- Marketplace/discovery.
- Chat.
- Complex admin arbitration.
- Real KYC/AML.
- Real file storage.
- Forgot password.
- Complex user settings.
- Full production security.

Use predefined demo users. The hackathon sandbox assumptions allow us to treat users as verified and the database as the source of truth for the demo wallet/payment state.

## Technical Direction

Use the current T3 Stack project as the base:

- Next.js App Router for pages.
- tRPC for app queries and mutations.
- Prisma with SQLite for demo persistence.
- Tailwind CSS v4 for styling.
- shadcn/ui for UI primitives.
- React Hook Form and Zod for forms.
- Sonner for feedback toasts.
- date-fns for deadlines and timeline copy.
- Recharts only if a dashboard visualization becomes useful after the core flow works.

Use Bun consistently because this repo already has `bun.lock`.

Recommended commands:

```bash
bun install
bun run dev
bun run typecheck
bun run lint
```

Initialize shadcn/ui:

```bash
bunx --bun shadcn@latest init
```

Add the initial component set:

```bash
bunx --bun shadcn@latest add button card badge table dialog sheet tabs form input textarea select checkbox radio-group separator skeleton empty alert progress dropdown-menu tooltip popover sonner
```

Add small supporting dependencies:

```bash
bun add @hookform/resolvers
```

The selected shadcn preset uses Hugeicons. Follow `components.json` for aliases, style, RTL behavior, and icon library.

## Data Model

Replace the sample `Post` model with the Ahd domain model. Keep the schema simple enough for a hackathon demo, but strict enough that workflow rules are server-enforced.

The key modeling rule is:

> Contract creator is not a business role. `creatorId` only means who authored the contract record. Contract business behavior comes from the party roles: provider and payer/reviewer.

This lets Ahd support both demo shapes without separate products:

| Scenario | Creator | Provider | Payer / Reviewer |
| --- | --- | --- | --- |
| Freelancer creates contract for client | Sara | Sara | Ahmed |
| Company creates contract for agency | Ahmed Company | Agency | Ahmed Company |
| Agency creates contract for subcontractor | Agency | Subcontractor | Agency |

For the MVP, every contract has exactly one provider and one payer/reviewer. The payer is also the reviewer. Later, reviewer can become a separate role for companies with procurement teams.

Primary models:

- `DemoUser`
- `Contract`
- `ContractParty`
- `Milestone`
- `MilestoneDeliverable`
- `AcceptanceCriterion`
- `MilestoneSubmission`
- `AuditLog`
- `ChangeOrder`
- `Dispute`

Suggested enums:

```ts
type ContractStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "in_progress"
  | "completed"
  | "disputed"
  | "cancelled";

type MilestoneStatus =
  | "awaiting_funding"
  | "funded"
  | "in_progress"
  | "completion_submitted"
  | "under_review"
  | "revision_requested"
  | "change_requested"
  | "disputed"
  | "approved"
  | "auto_approved";

type PaymentStatus =
  | "unfunded"
  | "funded"
  | "release_paused"
  | "released"
  | "refunded";

type ContractPartyRole =
  | "provider"
  | "payer";
```

Important contract fields:

- `title`
- `description`
- `creatorId`
- `totalAmount`
- `currency` fixed to `SAR` for the MVP
- `status`
- `inviteToken`: a random, non-guessable demo token used in `/contracts/invite/[token]` to load the pending invitation without real authentication. It identifies the contract invite tied to the invited party email and is sufficient for the hackathon MVP, not a production auth mechanism.
- `sentAt`
- `acceptedAt`
- `createdAt`
- `updatedAt`

Important contract party fields:

- `contractId`
- `userId` nullable for invited demo users
- `name`
- `email`
- `phone`
- `role` as `provider` or `payer`
- `acceptedAt`

Rules:

- `creatorId` must match one of the contract parties.
- If the creator selects "I will provide the work", the creator is the provider and the invited party is the payer/reviewer.
- If the creator selects "I will fund and review the work", the creator is the payer/reviewer and the invited party is the provider.
- The invite link is tied to the invited party email and `inviteToken`.

Important milestone fields:

- `contractId`
- `title`
- `description`
- `amount`
- `revisionsAllowed`
- `revisionsUsed`
- `reviewWindowHours`
- `reviewDeadline`
- `status`
- `paymentStatus`
- `submittedAt`
- `approvedAt`
- `releasedAt`

Milestone deliverables and acceptance criteria must be normalized child records for the MVP, not JSON fields. Criteria need stable IDs because revision requests and disputes must reference specific criteria.

Important milestone deliverable fields:

- `milestoneId`
- `title`
- `description`

Important acceptance criterion fields:

- `milestoneId`
- `text`

Important milestone submission fields:

- `milestoneId`
- `submittedByUserId`
- `message`
- `deliverableUrl` optional
- `mockFileName` optional
- `submittedAt`
- `status` as `submitted`, `revision_requested`, `approved`, `disputed`, or `superseded`

Important audit log fields:

- `contractId`
- `milestoneId`
- `actorUserId`
- `action`
- `message`
- `createdAt`

Cancellation rule for MVP:

- A contract can be cancelled only before any milestone is funded.
- The creator can cancel a draft or sent contract.
- After funding, the flow must use revision, change order, dispute, refund, or completion states instead of cancellation.

## Server Workflow Rules

Workflow rules must live on the server, not inside React components. The UI can explain and preview state, but the tRPC mutations should enforce valid transitions.

Core flow:

```text
Draft Contract
→ Sent to Invited Party
→ Accepted
→ Milestone Funded
→ In Progress
→ Milestone Completion Request Submitted
→ Under Review
→ Approved / Revision Requested / Change Requested / Disputed / Auto-Approved
→ Payment Released
→ Next Milestone
→ Contract Completed
```

Payment release rule:

```text
Do not release payment unless:
- the milestone payment status is funded,
- the milestone is approved or auto-approved,
- the milestone is not disputed,
- the payment is not already released.
```

Revision rule:

```text
If revisionsUsed < revisionsAllowed:
  allow revision request and increment revisionsUsed.
Else:
  block normal revision and suggest approve, change order, or dispute.
```

Auto-approval rule:

```text
If the milestone is under_review and the review window has expired:
  auto-approve and release payment.
```

For the MVP, the "Simulate 72 hours passed" action can bypass real time and execute this transition directly when the milestone is eligible.

Role rules:

```text
Provider:
- submits milestone completion requests
- responds to revision feedback
- sees release status and payout history

Payer / Reviewer:
- accepts invited contracts
- funds milestones
- reviews completion requests
- approves, requests revision, requests change order, or opens dispute

Creator:
- edits draft before sending
- sends or resends invite
- cancels only before funding
```

## tRPC API Shape

Start with one router, `contractRouter`, and extract workflow logic into `src/server/services/contract-workflow.ts`.

Suggested procedures:

- `list`
- `getById`
- `createAndSend`
- `acceptInvite`
- `fundMilestone`
- `submitCompletionRequest`
- `approveMilestone`
- `requestRevision`
- `requestChangeOrder`
- `openDispute`
- `simulateAutoApprove`
- `resetDemo`

Avoid splitting into many routers until the domain grows. For the MVP, one router keeps the demo flow easier to build and verify.

## Recommended Project Structure

```text
src/app/
  layout.tsx
  page.tsx
  dashboard/
    page.tsx
    contracts/
      new/page.tsx
      [id]/page.tsx
      [id]/milestones/[milestoneId]/submit/page.tsx
      [id]/milestones/[milestoneId]/review/page.tsx
  contracts/
    invite/[token]/page.tsx

src/components/
  ui/
  app/
    app-shell.tsx
    page-header.tsx
    status-badge.tsx
    money.tsx
    audit-timeline.tsx
    milestone-card.tsx
    demo-user-switcher.tsx

src/features/contracts/
  constants.ts
  copy.ts
  schemas.ts
  status.ts
  roles.ts
  utils.ts
  components/
    contract-form.tsx
    review-actions.tsx
    submit-completion-request-dialog.tsx
    payment-panel.tsx
    contract-summary.tsx

src/server/api/routers/
  contract.ts

src/server/services/
  contract-workflow.ts
  demo-seed.ts
```

Keep app route files thin. Page files should assemble data and layout. Domain components should live under `src/features/contracts/components`. Generic reusable UI helpers should live under `src/components/app`.

## Pages

The MVP uses unified, role-aware pages instead of separate freelancer and client route trees. A contract detail page should render different actions based on the current user's role in that contract.

### Pages Summary

| Page | Audience | Intended function |
| --- | --- | --- |
| `/dashboard` | Any demo user | Operational overview of all contracts involving the user, grouped by action needed and role. |
| `/dashboard/contracts/new` | Any demo user | Create and send a contract after selecting whether the creator is the provider or the payer/reviewer. |
| `/dashboard/contracts/[id]` | Any contract party | Role-aware contract workspace showing milestones, funding, next action, and audit trail. |
| `/dashboard/contracts/[id]/milestones/[milestoneId]/submit` | Provider | Submit a milestone completion request with message and deliverable link. Can be implemented as a route or dialog. |
| `/dashboard/contracts/[id]/milestones/[milestoneId]/review` | Payer / reviewer | Review a submitted completion request and approve, request revision, request change order, or open dispute. |
| `/contracts/invite/[token]` | Invited party | Full contract acceptance page where the invited party reviews all terms, confirms acceptance, then enters the unified dashboard flow. |

### Dashboard: `/dashboard`

Purpose: orient the judge/user immediately and answer "what needs my action now?"

Content:

- Action-needed section: contracts where this user must accept, fund, submit, review, or respond.
- Waiting-on-other-party section: contracts blocked on the other party.
- Summary cards for funded amount, awaiting review amount, released amount, and active contracts.
- Tabs or segmented filters:
  - `كل العقود`
  - `أنشأتها`
  - `أحتاج إجراء مني`
  - `كمقدم خدمة`
  - `كممول / مراجع`
- Contracts table on desktop and stacked contract cards on mobile.
- Each row/card must show title, other party, this user's role, status, total amount, current milestone, payment state, and next action.
- Primary CTA: `إنشاء عقد`.

The dashboard should be the first useful screen, not a marketing landing page. Ahd's value should be visible through the working product surface.

### Create Contract: `/dashboard/contracts/new`

Purpose: turn an informal deal into a structured contract.

First step:

```text
ما دورك في هذا العقد؟
```

Offer two clear cards:

- `سأقدم العمل وأستلم الدفعات`: current user is the provider, invited party is the payer/reviewer.
- `سأمول العمل وأراجعه`: current user is the payer/reviewer, invited party is the provider.

Fields:

- Contract title.
- Description.
- Other party name.
- Other party email.
- Other party phone.
- Milestone title.
- Milestone amount.
- Deliverables.
- Acceptance criteria.
- Revisions allowed.
- Review window.

Currency is fixed to SAR for the MVP and should not be a form choice.

For the MVP, support two milestones because the official demo script uses two. Dynamic milestones are nice, but not required before the golden path works.

Primary CTA:

```text
إنشاء وإرسال العقد
Create & Send Contract
```

After creation:

- Contract status becomes `sent`.
- Audit log records creation and sending.
- Redirect to `/dashboard/contracts/[id]`.

### Contract Detail: `/dashboard/contracts/[id]`

Purpose: role-aware contract workspace for any party.

Show:

- Contract title.
- Parties.
- Whether this user created the contract or received it.
- This user's role: provider or payer/reviewer.
- Contract status.
- Total amount.
- Milestone list.
- Funding status.
- Revision counts.
- Review deadline.
- Audit trail.
- Next action panel.

Provider actions:

- Submit milestone completion request.
- View revision feedback.
- View release status.

Payer/reviewer actions:

- Accept contract if invited and not accepted.
- Fund milestone.
- Review completion request.
- Approve, request revision, request change order, or open dispute.

Creator-only actions:

- Edit draft before sending.
- Send or resend invite.
- Cancel only before funding.
- Simulate 72 hours passed for demo.
- Reset demo, if useful.

### Contract Acceptance: `/contracts/invite/[token]`

Purpose: full contract review and acceptance page for the invited party after they open the email/share link.

Show:

- Contract summary.
- Their invited role: provider or payer/reviewer.
- Parties.
- Milestones.
- Amounts.
- Deliverables.
- Acceptance criteria.
- Revision rules.
- Review window.
- Audit-style preview of what acceptance means: after acceptance, the contract becomes active and the next payment/workflow action becomes available.

Actions:

- Primary CTA: `قبول العقد`.
- Clicking `قبول العقد` opens a confirmation dialog.
- The confirmation dialog explains that acceptance means the invited party agrees to the contract terms, milestones, acceptance criteria, revision limit, review window, and payment workflow.
- The dialog includes a text input. The invited party must type exactly `أقبل هذا العقد`.
- The final accept button stays disabled until the typed text matches `أقبل هذا العقد`.
- After acceptance, redirect to `/dashboard/contracts/[id]`.
- If the invited party is payer/reviewer, the contract detail page shows the next action: fund the first milestone.

Acceptance transition:

```text
contractParty.acceptedAt = now
contract.status = accepted
audit: invited party accepted contract
```

Funding transition:

```text
paymentStatus = funded
milestoneStatus = funded
contractStatus = in_progress
```

Add an audit log event.

### Submit Milestone Completion Request

This can be a modal inside `/dashboard/contracts/[id]` first. A separate route can be added later if needed.

Fields:

- Submission message.
- Deliverable link.
- Optional file name/mock upload label.

On submit:

- Create a `MilestoneSubmission`.
- Milestone status becomes `completion_submitted`, then `under_review`.
- `submittedAt` is set.
- `reviewDeadline` is calculated.
- Audit log updates.

### Review Milestone: `/dashboard/contracts/[id]/milestones/[milestoneId]/review`

Purpose: structured payer/reviewer review of a submitted completion request.

Show:

- Submitted completion request.
- Acceptance criteria checklist.
- Revision count.
- Review deadline.
- Review actions.

Actions:

- Approve.
- Request revision.
- Request change order.
- Open dispute.

Revision form:

- Select related acceptance criterion.
- Feedback text.

Change order form:

- Requested change.
- Proposed amount.

Dispute form:

- Select unmet criterion.
- Dispute reason.

This is the most important UX page in the product. It is where Ahd proves that review is criteria-based, revisions are bounded, and out-of-scope requests become paid change orders.

## UX Direction

The product should feel serious, modern, trustworthy, fintech-like, Arabic-first, and clean. It should not feel like a generic SaaS template or marketplace.

Set the app shell to Arabic-first:

```tsx
<html lang="ar" dir="rtl">
```

Use an Arabic-capable font through `next/font`, such as Cairo or IBM Plex Sans Arabic. Keep English helper copy only when it improves demo clarity.

Important Arabic product terms:

- Ahd: `عهد`
- Contract: `عقد`
- Contracts: `عقود`
- Milestone: `مرحلة`
- Funded: `ممولة`
- Under review: `قيد المراجعة`
- Revision requested: `طلب تعديل`
- Change order: `طلب تغيير مدفوع`
- Dispute: `نزاع`
- Released: `تم الصرف`
- Audit trail: `سجل العقد`
- Provider: `مقدم الخدمة`
- Payer / Reviewer: `الممول / المراجع`
- Creator: `منشئ العقد`
- Other party: `الطرف الآخر`

UX principles:

- Make state obvious through badges, timelines, and next-action labels.
- Keep payment state and contract state visually connected.
- Show revision counters prominently, for example `1 / 2`.
- Force disputes to reference criteria.
- Make change orders feel like a paid path, not a failure state.
- Use timeline events as proof of execution.
- Make demo controls visible but clearly labeled as demo controls.
- Avoid clutter. This demo wins by clarity, not by having many screens.

Use shadcn/ui components first:

- `Card` for individual milestones and focused panels.
- `Badge` for statuses.
- `Table` for the dashboard contract list.
- `Dialog` or `Sheet` for submit/review forms.
- `Tabs` where a detail page needs structured sections.
- `Alert` for revision limit and auto-approval messages.
- `Empty` for dashboard empty state.
- `Skeleton` for loading states.
- `Sonner` for action feedback.
- `Tooltip` or `Popover` for compact explanatory details.

Do not build custom UI primitives when shadcn has a component that fits.

## Visual Layout Notes

Dashboard:

- Use a dense but calm operational layout.
- Top stats should answer: funded, awaiting review, released.
- Contract table should include title, other party, current user's role, status, total, current milestone, and next action.

Contract detail:

- Place the contract summary and payment state near the top.
- Milestone cards should be scannable.
- Audit trail should be visible on the same page, preferably in a side column on desktop and below the milestones on mobile.

Review page:

- Left/primary area: submitted completion request and acceptance criteria.
- Right/action area: approve, revision, change order, dispute.
- Use clear action hierarchy. Approve is primary only when the milestone is eligible.

Mobile:

- Avoid horizontal tables where possible.
- Use stacked cards for contract rows on small screens.
- Keep critical actions reachable without scrolling through long audit logs first.

## Demo Script To Support

The app must support this path:

1. Open dashboard.
2. Click `Create Contract`.
3. Create contract:
   - Role: Sara selects `سأقدم العمل وأستلم الدفعات`.
   - Title: Brand Identity Package.
   - Other party: Ahmed Khalid.
   - Total: 3,000 SAR.
   - Milestone 1: Logo Concepts, 1,500 SAR.
   - Milestone 2: Final Brand Kit, 1,500 SAR.
   - Revisions: 2.
   - Review window: 72 hours.
4. Open invite link.
5. Ahmed accepts contract.
6. Ahmed funds Milestone 1.
7. Creator dashboard shows funded state.
8. Sara submits a milestone completion request with a Figma link.
9. Ahmed opens review page.
10. Acceptance criteria and revision count are visible.
11. Ahmed approves.
12. Payment releases.
13. Audit trail updates.

Optional edge demos:

- Create a second contract where the creator selects `سأمول العمل وأراجعه`, showing that a company can create a contract for an agency and still be the payer/reviewer.
- Ahmed asks for extra dashboard or brand-guide work, and Ahd treats it as a change order.
- Sara submits another milestone, the reviewer takes no action, and "Simulate 72 hours passed" auto-approves and releases payment.
- Ahmed exhausts included revisions and the UI blocks another free revision.

## Implementation Phases

### Phase 1: Foundation

- Initialize shadcn/ui.
- Replace default metadata and homepage copy.
- Set Arabic-first layout with `lang="ar"` and `dir="rtl"`.
- Add Arabic-capable font.
- Add Prisma models and enums.
- Create demo users and seed/reset helper.
- Remove sample `Post` usage when the contract router is ready.

### Phase 2: Workflow API

- Build `contractRouter`.
- Build `contract-workflow.ts`.
- Add audit log creation to every major mutation.
- Enforce funding, approval, revision, dispute, and auto-approval rules server-side.

### Phase 3: Dashboard and Contract Detail

- Build dashboard stats.
- Build contracts table.
- Build contract detail shell.
- Build status badges, money formatter, milestone cards, and audit timeline.

### Phase 4: Create Contract

- Build the contract form with React Hook Form and Zod.
- Start with role selection: creator is provider or creator is payer/reviewer.
- Support two milestones.
- Add good helper copy around fulfillment, acceptance criteria, revisions, and review window.
- Redirect to detail after creation.

### Phase 5: Invite and Funding Flow

- Build contract acceptance page with full contract details.
- Add typed Arabic confirmation dialog requiring `أقبل هذا العقد`.
- Add accept invite mutation.
- Add mock funding mutation.
- Show clear funded and in-progress state changes.

### Phase 6: Submission and Review

- Add submit completion request dialog.
- Add review milestone page.
- Add approve/release flow.
- Add revision request flow with criterion selection.
- Add change order flow.
- Add dispute flow with criterion selection.

### Phase 7: Demo Polish

- Add auto-approval simulation.
- Add revision exhaustion alert.
- Add demo reset action.
- Polish audit timeline messages.
- Add loading, empty, and error states.
- Verify mobile layout.
- Run typecheck, lint, and a manual golden-path demo.

## Build Order Recommendation

Start with:

1. shadcn init.
2. Prisma schema.
3. Seed/reset demo data.
4. Contract workflow service.
5. Dashboard.
6. Contract detail page.

This creates the center of gravity for the app. After that, invite, submission, and review flows can plug into the same state machine without scattering role-specific logic across separate UI trees.

## Success Criteria

The MVP is ready for the hackathon demo when:

- The dashboard communicates Ahd's purpose without explanation.
- A judge can create and send a contract.
- An invited party can accept a contract.
- A payer/reviewer can fund and review a milestone.
- A provider can submit a milestone completion request.
- A payer/reviewer can approve, request revision, request change order, or open dispute.
- Payment releases only through valid state.
- Revision exhaustion is clearly handled.
- Auto-approval can be demonstrated.
- The audit trail proves each step.
- The UI feels intentionally Arabic-first and trustworthy.
