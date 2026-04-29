# Ahd Page Prototype Brief

This brief describes every page and major workflow that design agents should prototype for Ahd / عهد. Use `docs/DESIGN.md` for visual system rules and this file for page content, flows, data, and forms.

## Global Prototype Context

Ahd is a unified role-aware contract workflow. Do not design separate products for freelancers and clients. A user may create a contract as the provider or as the payer/reviewer.

Demo users:

- `سارة الناصر` / Sara Al-Nasser: provider-oriented demo user.
- `أحمد خالد` / Ahmed Khalid: payer/reviewer-oriented demo user.

Contract roles:

- `منشئ العقد`: the user who authored the contract.
- `مقدم الخدمة`: the party who performs work and submits milestone completion requests.
- `الممول / المراجع`: the party who funds milestones and reviews completion requests.

Important demo contract:

- Title: Brand Identity Package.
- Arabic title option: حزمة الهوية البصرية.
- Total: 3,000 SAR.
- Provider: Sara.
- Payer/reviewer: Ahmed.
- Milestone 1: Logo Concepts, 1,500 SAR.
- Milestone 2: Final Brand Kit, 1,500 SAR.
- Revisions: 2.
- Review window: 72 hours.

## Prototype Data Model

Design agents should use these objects consistently across pages.

Contract:

- ID: `contract-brand-identity`.
- Title: حزمة الهوية البصرية.
- Description: تصميم هوية بصرية أولية تشمل اتجاهين للشعار، ألوان، خط عربي/لاتيني، وتسليم ملفات المصدر.
- Status: draft, sent, accepted, active, completed, disputed, cancelled.
- Total amount: 3,000 SAR.
- Created by: Sara or Ahmed depending on scenario.
- Provider: Sara.
- Payer/reviewer: Ahmed.
- Created date.
- Invite status: not sent, sent, accepted, expired.

Milestone:

- Title.
- Description.
- Amount in SAR.
- Deliverables list.
- Acceptance criteria list.
- Revisions allowed.
- Revisions used.
- Review window hours.
- Work status: not submitted, under review, revision requested, approved, disputed.
- Payment status: not funded, funded, released, paused.
- Review deadline.

Party:

- Name.
- Email.
- Phone.
- Contract role: creator, provider, payer/reviewer.
- Display hint for current user role.

Audit event:

- Event label.
- Actor.
- Timestamp.
- Short description.

Payment record:

- Milestone.
- Amount.
- Funding state.
- Release state.
- Related action if any.

## Page Map

| Page | Route | Primary user |
| --- | --- | --- |
| Mock Login | `/login` | Any demo visitor |
| Dashboard | `/dashboard` | Logged-in demo user |
| Contracts Index | `/dashboard/contracts` | Logged-in demo user |
| Action Required | `/dashboard/actions` | Logged-in demo user |
| Payments | `/dashboard/payments` | Logged-in demo user |
| Create Contract | `/dashboard/contracts/new` | Logged-in demo user |
| Contract Detail | `/dashboard/contracts/[id]` | Any contract party |
| Fund Milestone Dialog | Dialog from contract detail/payments | Payer/reviewer |
| Contract Acceptance | `/contracts/invite/[token]` | Invited party |
| Submit Completion Request | `/dashboard/contracts/[id]/milestones/[milestoneId]/submit` or dialog | Provider |
| Review Completion Request | `/dashboard/contracts/[id]/milestones/[milestoneId]/review` | Payer/reviewer |
| Sidebar Settings Action | Popover/dialog | Logged-in demo user |
| Sidebar Help Action | Popover/dialog | Logged-in demo user |

## 1. Mock Login

Route: `/login`

Purpose: allow the hackathon demo to switch between two predefined users without real authentication.

Layout:

- Centered page with calm mist background.
- Product mark and name at top: `عهد`.
- One short explanation: "اختر حساباً تجريبياً للمتابعة."
- Two large account cards side by side on desktop, stacked on mobile.

Account card data:

- Sara card:
  - Name: سارة الناصر.
  - Role hint: مقدمة خدمة.
  - Description: تنشئ العقود وتقدم العمل وتطلب صرف المراحل.
  - CTA: الدخول باسم سارة.
- Ahmed card:
  - Name: أحمد خالد.
  - Role hint: ممول / مراجع.
  - Description: يقبل العقود ويمول المراحل ويراجع طلبات الإنجاز.
  - CTA: الدخول كأحمد.

Interactions:

- Clicking a card logs in as that user and redirects to `/dashboard`.
- No password fields.
- No forgot password.
- No account creation.

Prototype states:

- Default state.
- Hover/selected card state.
- Mobile stacked state.

## 2. Dashboard Shell

Route wrapper: `/dashboard/*`

Purpose: persistent operational shell for all authenticated pages.

Sidebar:

- Right-side RTL sidebar.
- Icon-collapsible.
- Brand mark using Hugeicons legal document icon and text `عهد`.
- Main navigation:
  - الرئيسية
  - العقود
  - إجراء مطلوب
  - المدفوعات
- Bottom action buttons:
  - الإعدادات
  - المساعدة
- Footer:
  - Current user avatar/initial.
  - User name.
  - Role hint.
  - Switch/logout action.

Header:

- Sidebar trigger.
- Page title.
- Current role context, for example: "تعمل الآن باسم سارة الناصر · مقدمة خدمة".
- Primary CTA: `إنشاء عقد`.

Important: settings/help are actions, not pages. In prototypes, show them as small popovers or dialogs.

## 3. Dashboard Home

Route: `/dashboard`

Purpose: show current work and make next actions obvious.

Primary UX question: "ما الذي يحتاج إجراء مني الآن؟"

Top section:

- Page title: لوحة القيادة.
- Subtitle: نظرة واضحة على العقود والمراحل والدفعات.
- CTA: إنشاء عقد.

Summary cards:

- العقود النشطة.
- المبلغ الممول.
- بانتظار المراجعة.
- تم صرفه.

Main sections:

- `إجراء مطلوب مني`
  - Cards/rows for contracts where current user must act.
  - Examples:
    - Ahmed must fund Logo Concepts.
    - Ahmed must review Sara's completion request.
    - Sara must respond to revision feedback.
- `بانتظار الطرف الآخر`
  - Contracts blocked on the other party.
- `كل العقود`
  - Table on desktop, stacked cards on mobile.

Filters/tabs:

- كل العقود.
- أنشأتها.
- أحتاج إجراء مني.
- كمقدم خدمة.
- كممول / مراجع.

Contract row/card data:

- Contract title.
- Other party.
- Current user's role.
- Contract status badge.
- Total amount.
- Current milestone.
- Milestone payment state.
- Review deadline if relevant.
- Next action label.
- Open details action.

Empty states:

- No contracts: "أنشئ أول عقد وحدد متى يتم صرف الدفعات."
- No action needed: "لا توجد إجراءات مطلوبة منك الآن."

## 4. Contracts Index

Route: `/dashboard/contracts`

Purpose: provide a complete, scannable view of contracts across all roles without splitting the product into separate client/freelancer areas.

Primary UX question: "أي عقود تخصني، وما دوري في كل عقد؟"

Header:

- Page title: العقود.
- Subtitle: كل العقود التي أنشأتها أو وقعتها أو تشارك فيها.
- Primary CTA: إنشاء عقد.

Tabs:

- الكل.
- أنشأتها.
- وقعتها.
- كمقدم خدمة.
- كممول / مراجع.

Filters:

- Search by contract title or other party.
- Contract status.
- Payment status.
- Role.

List/table columns:

- Contract title.
- Other party.
- Current user's role badge.
- Creator badge if useful.
- Contract status.
- Payment state.
- Current milestone.
- Total amount.
- Next action.
- Updated date.

Row/card actions:

- Open contract.
- Copy invite link when sent but not accepted.
- Fund next milestone when current user is payer/reviewer.
- Submit completion request when current user is provider and milestone is funded.

Empty states:

- No created contracts: "لم تنشئ أي عقود بعد."
- No signed contracts: "لا توجد عقود قبلتها حتى الآن."

## 5. Action Required

Route: `/dashboard/actions`

Purpose: a focused queue for actions the current user can take now.

Primary UX question: "ما الذي ينتظر قراري الآن؟"

Header:

- Page title: إجراء مطلوب.
- Subtitle: الإجراءات المرتبطة بالعقود والمراحل والدفعات.

Groups:

- يحتاج تمويل.
- يحتاج مراجعة.
- يحتاج رد على تعديل.
- نزاعات مفتوحة.
- دعوات بانتظار القبول.

Action item data:

- Contract title.
- Milestone title if relevant.
- Required action.
- Current user's role.
- Other party.
- Amount.
- Deadline or elapsed time.
- Status badge.
- Primary action.

Sorting:

- Most urgent first.
- Under-review deadlines before general waiting states.

Empty state:

- "لا توجد إجراءات مطلوبة منك الآن."

## 6. Payments

Route: `/dashboard/payments`

Purpose: show payment movement and funding state clearly for the demo.

Primary UX question: "أين المال الآن؟"

Top summary:

- إجمالي العقود.
- المبلغ الممول.
- المبلغ المصروف.
- المبلغ الموقوف.

Sections:

- مراحل تحتاج تمويل.
- مراحل ممولة بانتظار الإنجاز.
- دفعات جاهزة للصرف أو صُرفت.
- دفعات موقوفة بسبب نزاع.

Payment row/card data:

- Contract title.
- Milestone title.
- Provider.
- Payer/reviewer.
- Amount.
- Funding state.
- Release state.
- Related deadline.
- Related action.

Actions:

- Fund milestone for payer/reviewer.
- Open contract detail.
- View dispute if release is paused.

MVP note:

- This is a mock/sandbox payment experience. Do not show bank integrations, wallet setup, or real KYC screens.

## 7. Create Contract

Route: `/dashboard/contracts/new`

Purpose: turn an informal deal into a funded milestone contract.

Step 1: role selection.

Question:

```text
ما دورك في هذا العقد؟
```

Options:

- `سأقدم العمل وأستلم الدفعات`
  - Current user is provider.
  - Other party is payer/reviewer.
- `سأمول العمل وأراجعه`
  - Current user is payer/reviewer.
  - Other party is provider.

Step 2: contract basics.

Fields:

- Contract title.
- Description.
- Other party name.
- Other party email.
- Other party phone.

Do not show currency selector. Currency is SAR.

Step 3: milestones.

For MVP, design two milestone sections.

Milestone fields:

- Milestone title.
- Description.
- Amount in SAR.
- Deliverables.
- Acceptance criteria.
- Revisions allowed, default 2.
- Review window, default 72 hours.

Deliverables input:

- Simple repeatable text rows or textarea chips.
- Example: Figma design file, mobile layout, desktop layout.

Acceptance criteria input:

- Simple repeatable text rows.
- Example: includes Arabic RTL layout, source file accessible, includes logo variations.

Review panel:

- Shows total amount.
- Shows provider and payer/reviewer.
- Shows what happens after sending.

Primary CTA:

- `إنشاء وإرسال العقد`.

Post-submit prototype:

- Redirect to contract detail with sent state.
- Show invite link/action.

## 8. Contract Detail

Route: `/dashboard/contracts/[id]`

Purpose: role-aware workspace for managing a contract.

Header:

- Contract title.
- Status badge.
- Total amount.
- Current user's relationship:
  - `أنشأته أنت`
  - `دورك: مقدم الخدمة`
  - `دورك: الممول / المراجع`
- Other party card.

Top panels:

- Payment summary:
  - Total amount.
  - Funded amount.
  - Released amount.
  - Paused amount.
- Next action panel:
  - Shows one dominant action based on current role and state.

Milestone list:

Each milestone card shows:

- Title.
- Amount.
- Deliverables.
- Acceptance criteria.
- Revision count: `0 / 2`.
- Review window.
- Payment status badge.
- Work/review status badge.
- Deadline if under review.
- Relevant action button.

Provider actions:

- Submit completion request.
- View revision feedback.
- View payment release status.

Payer/reviewer actions:

- Accept if invited.
- Fund milestone.
- Review submitted completion request.
- Approve/request revision/change order/dispute.

Creator-only actions:

- Send or resend invite.
- Cancel before funding.
- Demo action: simulate 72 hours passed.
- Demo reset.

Audit trail:

- Timeline on desktop side column or lower section on mobile.
- Events:
  - Contract created.
  - Contract sent.
  - Contract accepted.
  - Milestone funded.
  - Completion request submitted.
  - Revision requested.
  - Change order requested.
  - Dispute opened.
  - Approved.
  - Payment released.
  - Auto-approved.

## 9. Fund Milestone Dialog

Location: dialog from contract detail or payments page.

Purpose: payer/reviewer funds a milestone before provider can submit completion.

Trigger labels:

- `تمويل المرحلة`.
- `تمويل أول مرحلة`.

Show:

- Contract title.
- Milestone title.
- Amount.
- Provider name.
- Acceptance criteria summary.
- Explanation: funds are held in the MVP sandbox and released after approval or auto-approval.

Confirmation:

- Primary CTA: `تأكيد التمويل`.
- Secondary CTA: إلغاء.

After funding:

- Milestone payment status becomes funded.
- Provider next action becomes submit completion request.
- Audit event appears: Milestone funded.

## 10. Contract Acceptance

Route: `/contracts/invite/[token]`

Purpose: invited party reviews all contract terms before accepting.

Layout:

- Public-style page but still uses Ahd app design system.
- Full contract summary with strong readability.
- Sticky/visible acceptance action on desktop and mobile.

Show:

- Contract title.
- Description.
- Invited party role.
- Creator.
- Provider.
- Payer/reviewer.
- Total amount.
- Milestones with amount, deliverables, acceptance criteria, revision limit, review window.
- Payment workflow explanation.
- Audit-style note explaining acceptance.

Primary CTA:

- `قبول العقد`.

Confirmation dialog:

- Title: تأكيد قبول العقد.
- Body: acceptance means the invited party agrees to contract terms, milestones, acceptance criteria, revision limit, review window, and payment workflow.
- Text input label: اكتب العبارة التالية للتأكيد.
- Required phrase:

```text
أقبل هذا العقد
```

- Final accept button disabled until the exact phrase is typed.
- Secondary button: إلغاء.

After acceptance:

- Redirect to `/dashboard/contracts/[id]`.
- If invited party is payer/reviewer, next action is fund first milestone.

## 11. Submit Completion Request

Route: `/dashboard/contracts/[id]/milestones/[milestoneId]/submit`

Can also be designed as a dialog from contract detail.

Purpose: provider submits a milestone completion request.

Show:

- Milestone summary.
- Deliverables checklist/read-only list.
- Acceptance criteria read-only list.
- Revision count.
- Review window.

Form fields:

- Message, required.
- Deliverable URL, optional.
- Mock file name, optional.

Helper copy:

- "ارسل ما يثبت إنجاز المرحلة ليبدأ عداد المراجعة."

Submit CTA:

- `إرسال طلب الإنجاز`.

After submit:

- Status becomes under review.
- Review deadline appears.
- Audit trail updates.

## 12. Review Completion Request

Route: `/dashboard/contracts/[id]/milestones/[milestoneId]/review`

Purpose: payer/reviewer decides against the agreed criteria.

Layout:

- Primary area: submitted request and criteria.
- Action panel: approve, revision, change order, dispute.

Show:

- Submitted message.
- Optional deliverable link/file.
- Acceptance criteria checklist.
- Revision count.
- Review deadline.
- Payment status.

Actions:

### Approve

- Primary positive action.
- Shows confirmation that payment will be released.

### Request Revision

Fields:

- Related acceptance criterion, required.
- Feedback, required.

Rules:

- Enabled only if revisions used is less than revisions allowed.
- If exhausted, show alert:
  - "استنفدت التعديلات المتضمنة. يمكنك الاعتماد، طلب تغيير مدفوع، أو فتح نزاع مبني على المعايير."

### Request Change Order

Fields:

- Requested change title.
- Description.
- Proposed amount.

Meaning:

- Out-of-scope paid work.
- Should not feel like failure.

### Open Dispute

Fields:

- Unmet acceptance criterion, required.
- Reason, required.
- Optional evidence/comment.

Meaning:

- Release is paused.
- Must be criteria-based, not vague preference.

## 13. Settings Action

Location: bottom sidebar action, no route.

Prototype as popover/dialog.

Content:

- Title: الإعدادات.
- Message: إعدادات الحساب غير مطلوبة في نموذج الهاكاثون.
- Optional controls shown disabled:
  - اللغة.
  - الإشعارات.
  - بيانات الحساب.

Purpose:

- Makes the shell feel complete without adding implementation scope.

## 14. Help Action

Location: bottom sidebar action, no route.

Prototype as popover/dialog.

Content:

- Title: المساعدة.
- Short "How Ahd works" steps:
  1. أنشئ عقداً.
  2. حدد المراحل ومعايير القبول.
  3. يقبل الطرف الآخر ويمول المرحلة.
  4. يرسل مقدم الخدمة طلب الإنجاز.
  5. يراجع الممول الطلب ويتم صرف الدفعة عند الاعتماد.

Purpose:

- Helps judges understand the workflow quickly.

## Prototype States To Include

Design agents should include at least these states:

- Empty dashboard.
- Dashboard with action-needed items.
- Contract sent, waiting for invited party.
- Contract accepted, waiting for funding.
- Milestone funded, waiting for provider submission.
- Under review with deadline.
- Revision requested.
- Revision exhausted.
- Change order proposed.
- Disputed/release paused.
- Approved/payment released.
- Auto-approved after simulated 72 hours.

## Mobile Requirements

- Login cards stack.
- Sidebar becomes mobile sheet.
- Dashboard tables become cards.
- Contract detail becomes one-column.
- Sticky bottom action may be used for primary actions on acceptance/review pages.
- Text must not overflow Arabic labels.
