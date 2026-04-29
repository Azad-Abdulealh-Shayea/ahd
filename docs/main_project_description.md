IMPORTANT NOTE: THIS IS THE MAIN PROJECT DESCRIPTION, IT EXPLAIN THE FULL OVERVIEW OF
THE FINAL PRODUCT AND THE IMPLEMENATION DIRECTION AND GUIDELINES.
USE IT AS THE MAIN REFERNECE AND CONTEXT FOR WORKING IN THIS PROJECT,
BUT IT IS NOT A BIBLE, IT CAN BE UPDATED AND IMPROVED IN SPECIFIC AREAS WHEN NEEDED.

# Project Brief for Codex Agent: **Ahd — عهد**

## 1. Project name

**Ahd — عهد**

Arabic positioning:

> **عهد — من اتفاق غير رسمي إلى عقد ممول قابل للتنفيذ.**

English positioning:

> **Ahd turns informal agreements into funded, enforceable milestone contracts.**

Important naming rule:

* Platform name: **Ahd / عهد**
* Core object users create: **Contract / عقد**
* Users do **not** create “agreements” in the UI.
* Use “contract” in code and “عقد / عقود” in Arabic UI labels.

---

# 2. What we are building

Ahd is a **contract-to-payment workflow platform**.

It helps two parties turn an informal agreement into a structured contract with:

* parties,
* milestones,
* deliverables,
* acceptance criteria,
* revision limits,
* review windows,
* funding/payment status,
* submission flow,
* approval flow,
* change-order flow,
* dispute flow,
* audit trail.

Ahd is **not** a freelancer marketplace.

It is not Upwork/Fiverr.

It does not help users find clients.

It helps users who already have a deal turn that deal into a structured, funded, milestone-based contract.

The demo use case will be a freelancer/client contract because it is easy to understand, but the underlying product should be designed as a general contract engine that can later support agencies, vendors, suppliers, creators, consultants, and B2B service contracts.

---

# 3. The problem

Many contracts start informally through:

* WhatsApp,
* Instagram DMs,
* phone calls,
* verbal promises,
* simple PDFs,
* bank transfer screenshots.

This creates serious problems:

1. **Unclear scope**
   Nobody clearly defines what “done” means.

2. **Payment risk**
   One side fears paying before receiving value.
   The other side fears working without payment commitment.

3. **Client ghosting / counterparty silence**
   Work is submitted, but the reviewing party disappears.

4. **Infinite revisions / scope creep**
   One party keeps asking for changes forever without paying more.

5. **Vague disputes**
   Disagreements become subjective: “I do not like it,” “this is not what I wanted,” etc.

6. **No audit trail**
   When something goes wrong, there is no clean record of contract terms, submissions, approvals, revisions, or payments.

---

# 4. The MVP goal

The MVP should prove one thing:

> **Ahd can turn an informal deal into a structured, funded milestone contract where payment follows contract state.**

The MVP is **not** a fully production-ready product.

It should be a polished hackathon prototype that demonstrates the golden path and a few important edge cases.

The MVP should show:

1. Create a contract.
2. Add milestones with acceptance criteria.
3. Send/share the contract to the counterparty.
4. Counterparty accepts the contract.
5. Counterparty funds the first milestone through a mocked payment flow.
6. Contract creator submits evidence/deliverable.
7. Counterparty reviews the milestone.
8. Counterparty can approve, request revision, request change order, or open dispute.
9. If approved, payment is released through a mocked payout flow.
10. Audit trail updates throughout the process.

---

# 5. Important MVP constraints

This is a hackathon MVP. Do **not** build full production infrastructure.

## Do build

* Contract creation
* Milestone creation
* Acceptance criteria
* Revision counter
* Review window
* Mock payment/funding
* Mock payout/release
* Contract timeline/audit trail
* Client/counterparty review page
* Demo controls for fast-forwarding time
* Clean UI

## Do not build

* Real authentication
* Real payment gateway integration
* Real escrow
* Real legal contract generation
* Marketplace/discovery
* Chat system
* Complex admin arbitration
* Real KYC/AML
* Real file storage
* Forgot password
* Complex user settings
* Full production security

Use predefined demo users.

---

# 6. Recommended MVP stack
we use T3 stack

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)

The priority is a smooth working demo, not architectural perfection.

---

# 7. Demo users

Use predefined accounts. No login needed.

# 8. Core product concepts

## A. Contract / عقد

The main object.

A contract contains:

* title,
* description,
* parties,
* total amount,
* currency,
* milestones,
* status,
* audit trail.

Example:

```ts
Contract {
  id: string
  title: string
  description: string
  creatorId: string
  counterpartyId: string
  totalAmount: number
  currency: "SAR" | "AED" | "USD"
  status: ContractStatus
  createdAt: Date
  updatedAt: Date
}
```

Suggested statuses:

```ts
type ContractStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "partially_funded"
  | "in_progress"
  | "completed"
  | "disputed"
  | "cancelled";
```

---

## B. Milestone / مرحلة

Each contract has one or more milestones.

A milestone contains:

* title,
* amount,
* deliverables,
* acceptance criteria,
* revision limit,
* review window,
* funding status,
* submission status,
* approval status.

Example:

```ts
Milestone {
  id: string
  contractId: string
  title: string
  description: string
  amount: number
  currency: string
  deliverables: string[]
  acceptanceCriteria: string[]
  revisionsAllowed: number // default 2
  revisionsUsed: number
  reviewWindowHours: number // default 72
  reviewDeadline: Date | null
  status: MilestoneStatus
  paymentStatus: PaymentStatus
  submittedAt: Date | null
  approvedAt: Date | null
  releasedAt: Date | null
}
```

Suggested milestone statuses:

```ts
type MilestoneStatus =
  | "awaiting_funding"
  | "funded"
  | "in_progress"
  | "submitted"
  | "under_review"
  | "revision_requested"
  | "change_requested"
  | "disputed"
  | "approved"
  | "auto_approved"
  | "released";
```

Suggested payment statuses:

```ts
type PaymentStatus =
  | "unpaid"
  | "funded"
  | "release_paused"
  | "released"
  | "refunded";
```

---

## C. Definition of Fulfillment

This is the core product idea.

Every milestone must define what “done” means.

For each milestone, collect:

* deliverables,
* acceptance criteria,
* revision limit,
* review window,
* release rule.

Example milestone:

```text
Milestone: Landing Page Design
Amount: 1,500 SAR

Deliverables:
- Figma design file
- Mobile layout
- Desktop layout
- Arabic and English versions

Acceptance criteria:
- Includes hero section
- Includes pricing section
- Includes contact form design
- Source file is accessible
- Supports RTL Arabic layout

Revision limit:
- 2 included revisions

Review window:
- 72 hours
```

---

# 9. Core contract state machine

The MVP should follow this flow:

```text
Draft Contract
→ Sent to Counterparty
→ Accepted
→ Milestone Funded
→ In Progress
→ Evidence Submitted
→ Under Review
→ Approved / Revision Requested / Change Requested / Disputed / Auto-Approved
→ Payment Released
→ Next Milestone
→ Contract Completed
```

Payment should follow milestone state.

Do not release payment unless:

* reviewer approves,
* or review window expires with no action,
* and milestone is funded,
* and milestone is not disputed.

---

# 10. Review actions

After a milestone is submitted, the counterparty/reviewer has four possible actions.

## 1. Approve

Meaning:

> The milestone satisfies the agreed criteria.

Result:

* milestone status becomes `approved`,
* payment release is triggered,
* payment status becomes `released`,
* audit log records approval and release.

---

## 2. Request revision

Meaning:

> The work needs correction within the original scope.

Rules:

* Allowed only if `revisionsUsed < revisionsAllowed`.
* Must include written feedback.
* Ideally must reference one or more acceptance criteria.
* Increment `revisionsUsed`.
* Status becomes `revision_requested`.

If revision limit is reached, block normal revision and show:

> “Included revisions are exhausted. You can approve, request a paid change order, or open a criteria-based dispute.”

Default revision limit:

```ts
revisionsAllowed = 2
```

But it must be customizable during contract creation.

---

## 3. Request change order

Meaning:

> The reviewer wants something outside the original contract scope.

Example:

Original milestone:

> Design 1 landing page.

Reviewer asks:

> Also design a dashboard page.

That should not be a free revision. It should become a new paid change order.

For MVP:

* Create a `ChangeOrder` object.
* Show status as `proposed`.
* Do not block original milestone release by default unless parties choose to attach it.
* Add audit log event.

Example:

```ts
ChangeOrder {
  id: string
  contractId: string
  milestoneId: string
  requestedByUserId: string
  title: string
  description: string
  proposedAmount: number
  status: "proposed" | "accepted" | "rejected"
}
```

---

## 4. Open dispute

Meaning:

> The reviewer claims the submitted work does not satisfy the agreed acceptance criteria.

Important:

A dispute is not just “I do not like it.”

A dispute must reference:

* which acceptance criterion was not met,
* reason,
* optional evidence/comment.

For MVP:

* Mark milestone as `disputed`.
* Mark payment status as `release_paused`.
* Show a dispute details panel.
* Add audit log event.
* No need to build full admin arbitration.

Example:

```ts
Dispute {
  id: string
  contractId: string
  milestoneId: string
  openedByUserId: string
  reason: string
  relatedCriteria: string[]
  status: "open" | "resolved" | "cancelled"
  createdAt: Date
}
```

---

# 11. Ghosting protection

Every milestone has a review window.

Default:

```ts
reviewWindowHours = 72
```

When creator submits a milestone:

* set status to `under_review`,
* set `submittedAt`,
* calculate `reviewDeadline = submittedAt + reviewWindowHours`.

If the reviewer takes no action before `reviewDeadline`, the milestone can be auto-approved.

For MVP, add a demo button:

> “Simulate 72 hours passed”

When clicked:

* if milestone is `under_review`,
* and no revision/dispute/change request exists,
* status becomes `auto_approved`,
* payment is released,
* audit log records auto-approval.

---

# 12. Infinite revision protection

The core rule:

> Revision requests are limited. Out-of-scope requests become paid change orders. Disputes must reference acceptance criteria.

Logic:

```ts
if (action === "request_revision") {
  if (revisionsUsed < revisionsAllowed) {
    allowRevision();
  } else {
    blockRevision();
    suggest(["approve", "request_change_order", "open_dispute"]);
  }
}
```

This is one of the most important MVP features.

Show revision count clearly in UI:

```text
Revisions used: 1 / 2
```

---

# 13. AI helper scope

AI must not make final decisions.

AI can assist UX only.

For MVP, AI can be mocked.

Possible function:

```ts
classifyReviewFeedback({
  feedback,
  acceptanceCriteria,
  deliverables
})
```

Return:

```ts
{
  classification: "likely_revision" | "likely_change_order" | "likely_dispute",
  confidence: number,
  explanation: string
}
```

Example:

Feedback:

> “Can you also add a dashboard page?”

AI suggestion:

```text
This appears to be outside the original milestone scope. Suggested action: create a paid change order.
```

Important:

* AI suggestion is non-binding.
* User still chooses the final action.
* The platform enforces deterministic rules only.

For MVP, this can be hardcoded or simple keyword-based logic.

---

# 14. Audit trail

Every major action should create an audit log event.

Example:

```ts
AuditLog {
  id: string
  contractId: string
  milestoneId?: string
  actorUserId: string
  action: string
  message: string
  createdAt: Date
}
```

Example events:

* Contract created
* Contract sent
* Contract accepted
* Milestone funded
* Milestone submitted
* Revision requested
* Change order requested
* Dispute opened
* Milestone approved
* Payment released
* Milestone auto-approved

The audit trail should be visible on the contract detail page.

---

# 15. Pages to build

## 1. Dashboard

Path:

```text
/
```

Purpose:

Show contract overview.

Content:

* active contracts,
* total funded amount,
* amount awaiting review,
* amount released,
* contracts table.

Contracts table columns:

* title,
* counterparty,
* status,
* total amount,
* current milestone,
* next action.

Primary CTA:

```text
Create Contract
```

---

## 2. Create Contract

Path:

```text
/contracts/new
```

Purpose:

Create a new contract with milestones.

Fields:

* contract title,
* description,
* counterparty name,
* counterparty email/phone,
* currency,
* milestone title,
* milestone amount,
* deliverables,
* acceptance criteria,
* revisions allowed,
* review window.

For MVP, support one or two milestones. Dynamic multiple milestones is nice but not required if time is limited.

Primary CTA:

```text
Create & Send Contract
```

After creation:

* contract status becomes `sent`,
* redirect to contract detail page.

---

## 3. Contract Detail

Path:

```text
/contracts/[id]
```

Purpose:

Main contract management page for creator.

Show:

* contract title,
* parties,
* contract status,
* total amount,
* milestone list,
* funding status,
* revision counts,
* review deadline,
* audit trail.

Actions depending on state:

* Submit milestone
* View counterparty link
* Simulate payment webhook
* Simulate 72 hours passed
* Release payment if approved

---

## 4. Counterparty Contract View

Path:

```text
/client/contracts/[id]
```

Purpose:

What the other party sees when they receive the contract link.

Show:

* contract summary,
* parties,
* milestones,
* amounts,
* deliverables,
* acceptance criteria,
* revision rules,
* review window.

Actions:

* Accept contract
* Fund first milestone with mocked payment

Mock payment button:

```text
Fund Milestone — 1,500 SAR
```

When clicked:

* payment status becomes `funded`,
* milestone status becomes `funded`,
* contract status becomes `in_progress`,
* audit log updates.

---

## 5. Submit Milestone

Can be a modal inside contract detail or page:

```text
/contracts/[id]/milestones/[milestoneId]/submit
```

Fields:

* submission message,
* deliverable link,
* optional file name/mock upload.

On submit:

* milestone status becomes `under_review`,
* `submittedAt` set,
* `reviewDeadline` set,
* audit log updates.

---

## 6. Review Milestone

Path:

```text
/client/contracts/[id]/milestones/[milestoneId]/review
```

Purpose:

Counterparty reviews submitted milestone.

Show:

* deliverables submitted,
* acceptance criteria checklist,
* revision count,
* review deadline,
* four actions:

  * Approve
  * Request Revision
  * Request Change Order
  * Open Dispute

Revision form:

* select related acceptance criterion,
* feedback text.

Change order form:

* requested change,
* proposed amount.

Dispute form:

* select unmet criterion,
* dispute reason.

---

# 16. Mock payment behavior

No real PSP integration.

Implement mock payment events.

## Mock fund milestone

When counterparty clicks “Fund Milestone”:

```ts
paymentStatus = "funded"
milestoneStatus = "funded"
```

Audit:

```text
Ahmed funded Milestone 1 for 1,500 SAR.
```

## Mock release payment

When milestone is approved or auto-approved:

```ts
paymentStatus = "released"
milestoneStatus = "released"
releasedAt = now
```

Audit:

```text
Payment of 1,500 SAR released to Sara.
```

Use clear UI badges:

* Unfunded
* Funded
* Under Review
* Revision Requested
* Disputed
* Released

---

# 17. Suggested API endpoints

Use REST endpoints or server actions. REST example:

```text
GET    /api/contracts
POST   /api/contracts
GET    /api/contracts/:id
POST   /api/contracts/:id/send
POST   /api/contracts/:id/accept

POST   /api/milestones/:id/fund
POST   /api/milestones/:id/submit
POST   /api/milestones/:id/approve
POST   /api/milestones/:id/request-revision
POST   /api/milestones/:id/request-change
POST   /api/milestones/:id/open-dispute
POST   /api/milestones/:id/simulate-auto-approve

GET    /api/demo/reset
```

Add a reset demo endpoint or button to restore seed data.

---

# 18. MVP demo script to support

The built app should support this demo:

1. Open dashboard.
2. Click “Create Contract.”
3. Create contract:

   * Title: Brand Identity Package
   * Counterparty: Ahmed Khalid
   * Total: 3,000 SAR
   * Milestone 1: Logo Concepts — 1,500 SAR
   * Milestone 2: Final Brand Kit — 1,500 SAR
   * Revisions: 2
   * Review window: 72 hours
4. Open counterparty link.
5. Ahmed accepts contract.
6. Ahmed funds Milestone 1.
7. Back on creator dashboard, status shows “Funded.”
8. Sara submits Figma link as evidence.
9. Ahmed opens review page.
10. Show acceptance criteria and revision count.
11. Ahmed approves.
12. Payment releases.
13. Audit trail updates.
14. Optional edge-case demo:

    * Ahmed requests extra dashboard/brand guide item.
    * Ahd flags it as change order, not free revision.
15. Optional ghosting demo:

    * submit another milestone,
    * click “simulate 72 hours passed,”
    * milestone auto-approves,
    * payment releases.

---

# 19. Visual/UI direction

Style should feel:

* serious,
* modern,
* trustworthy,
* Arabic-first but usable in English,
* fintech-like,
* clean.

Use cards, badges, timeline, and clear state changes.

Important UI components:

* status badges,
* milestone cards,
* contract timeline,
* payment summary card,
* review action panel,
* audit trail.

Avoid clutter.

This is a demo product, so polish matters more than many features.

---

# 20. Suggested copy

## Main headline

```text
Ahd turns informal agreements into funded milestone contracts.
```

Arabic:

```text
عهد يحوّل الاتفاقات غير الرسمية إلى عقود ممولة قابلة للتنفيذ.
```

## Dashboard empty state

```text
Create your first contract and define exactly when payment should be released.
```

## Contract creation helper

```text
Define what fulfillment means before money is committed.
```

## Milestone review helper

```text
Review the submitted evidence against the agreed acceptance criteria.
```

## Revision limit message

```text
Included revisions are exhausted. You can approve, request a paid change order, or open a criteria-based dispute.
```

## Auto-approval message

```text
The review window expired with no action. This milestone was auto-approved according to the contract terms.
```

---

# 21. Success criteria for the MVP

The MVP is successful if a judge/user can understand this within 2 minutes:

1. A contract was created.
2. The milestone was funded.
3. The work was submitted.
4. The reviewer had structured options.
5. Payment was released based on contract rules.
6. The system prevents ghosting and infinite revisions.
7. The audit trail shows what happened.

The product should clearly communicate:

> **Ahd is not just a contract document. It is a contract execution workflow connected to payment state.**

---

# 22. Final implementation priority

Build in this order:

1. Data models / seed data.
2. Dashboard.
3. Create contract form.
4. Contract detail page.
5. Counterparty accept/fund flow.
6. Submit milestone flow.
7. Review milestone flow.
8. Approve/release payment.
9. Revision limit logic.
10. Change order flow.
11. Dispute state.
12. Auto-approval simulation.
13. Audit trail polish.
14. UI polish and demo reset.

Do not spend time on real auth, real payments, or marketplace features.

---

# 23. One-sentence product summary for Codex

> **Build Ahd, a hackathon MVP for turning informal deals into structured, funded milestone contracts where payment release follows contract state: funded milestone, submitted evidence, review window, approval, bounded revisions, change orders, disputes, auto-approval, and audit trail.**

