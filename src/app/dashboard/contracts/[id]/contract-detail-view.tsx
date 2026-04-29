"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowLeft02Icon,
  ArrowUp01Icon,
  Calendar02Icon,
  FileViewIcon,
  LegalDocument01Icon,
  LockIcon,
  MoneySecurityIcon,
  Shield01Icon,
  Task01Icon,
  TransactionHistoryIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { CopyableText } from "@/components/app/copyable-text";
import { CopyInviteLinkButton } from "@/components/app/copy-invite-link";
import { DismissibleNotice } from "@/components/app/dismissible-notice";
import { HelpTooltip } from "@/components/app/help";
import {
  AnimatePresence,
  fadeUp,
  heightReveal,
  motion,
  pageStagger,
  softScale,
  subtleListItem,
} from "@/components/app/motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ContractStatusBadge,
  formatSar,
  getContractStatusDescription,
  getMilestoneStatusDescription,
  getPaymentStatusDescription,
  MilestoneStatusBadge,
  PaymentStatusBadge,
  roleDisplay,
} from "@/features/contracts/display";
import {
  getPrimaryMilestone,
  type ContractDetailItem,
} from "@/features/contracts/view-models";
import { cn } from "@/lib/utils";
import type { ContractParty, DemoUser } from "../../../../../generated/prisma";

type ContractDetailViewProps = {
  contract: ContractDetailItem;
  currentUser: DemoUser;
};

export function ContractDetailView({
  contract,
  currentUser,
}: ContractDetailViewProps) {
  const currentParty = contract.parties.find(
    (party) =>
      party.userId === currentUser.id || party.email === currentUser.email,
  );
  const provider = contract.parties.find((party) => party.role === "PROVIDER");
  const payer = contract.parties.find((party) => party.role === "PAYER");
  const currentMilestone = getPrimaryMilestone(contract);
  const canCopyInvite =
    contract.status === "SENT" &&
    !contract.acceptedAt &&
    !!contract.inviteToken;
  const roleKey =
    currentParty?.role === "PAYER" ? "PAYER_REVIEWER" : "PROVIDER";
  const role = roleDisplay[roleKey];

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={pageStagger}
      className="mx-auto flex w-full max-w-7xl flex-col gap-8"
    >
      <motion.div variants={fadeUp}>
        <DismissibleNotice
          id="contract-detail-color-guide"
          title="دليل ألوان العقد"
          className="border-primary/25 bg-primary/5 [&>svg]:text-primary"
        >
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm leading-7">
            <ColorMeaning
              className="bg-brand-navy"
              label="لون الصفحة يوضح دورك في هذا العقد"
            />
            <ColorMeaning
              className="bg-brand-teal"
              label="التيل يعني تمويل أو إنجاز مكتمل"
            />
            <ColorMeaning
              className="bg-brand-gold"
              label="الذهبي يعني خطوة تحتاج انتباه"
            />
            <ColorMeaning
              className="bg-destructive"
              label="الأحمر يعني توقف أو نزاع"
            />
          </div>
        </DismissibleNotice>
      </motion.div>

      <motion.section
        variants={softScale}
        className={`relative overflow-hidden rounded-3xl border border-t-4 p-6 md:p-8 ${role.heroClassName} ${role.borderClassName}`}
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-end">
          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={role.accentClassName}>
                  {role.shortLabel}
                </Badge>
                <StatusHint
                  title="حالة العقد"
                  description={getContractStatusDescription(contract.status)}
                >
                  <ContractStatusBadge status={contract.status} />
                </StatusHint>
                {currentMilestone ? (
                  <StatusHint
                    title="حالة الدفعة"
                    description={getPaymentStatusDescription(
                      currentMilestone.paymentStatus,
                    )}
                  >
                    <PaymentStatusBadge
                      status={currentMilestone.paymentStatus}
                    />
                  </StatusHint>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {canCopyInvite && contract.inviteToken ? (
                  <CopyInviteLinkButton inviteToken={contract.inviteToken} />
                ) : null}
                <HistorySheet contract={contract} />
              </div>
            </div>

            <div className="flex max-w-4xl flex-col gap-3">
              <div className="flex items-start gap-3">
                <h1 className="min-w-0 text-3xl font-semibold tracking-normal text-balance md:text-5xl">
                  {contract.title}
                </h1>
                <HelpTooltip
                  title="عقد مقفل"
                  content="بعد إرسال العقد لا يتم تعديل الشروط الأصلية مباشرة. أي تغيير لاحق يجب أن يكون عبر إجراء واضح مثل طلب تغيير مدفوع."
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className="bg-background/80 mt-1 shrink-0 rounded-full"
                    aria-label="العقد مقفل"
                  >
                    <HugeiconsIcon icon={LockIcon} />
                  </Button>
                </HelpTooltip>
              </div>
              <p className="text-muted-foreground max-w-3xl text-sm leading-7 md:text-base">
                {contract.description}
              </p>
            </div>
          </div>

          <div className="grid gap-4 text-sm">
            <HeroFact
              icon={MoneySecurityIcon}
              label="إجمالي العقد"
              value={formatSar(contract.totalAmount)}
            />
            <HeroFact
              icon={Task01Icon}
              label="المراحل"
              value={`${contract.milestones.length}`}
            />
            <HeroFact
              icon={LegalDocument01Icon}
              label="العملة"
              value={contract.currency}
            />
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={fadeUp}
        className="grid gap-10 lg:grid-cols-[1fr_20rem]"
      >
        <motion.div layout className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-semibold">المراحل</h2>
              {currentMilestone ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    المرحلة الحالية: {currentMilestone.title}
                  </span>
                  <StatusHint
                    title="حالة المرحلة"
                    description={getMilestoneStatusDescription(
                      currentMilestone.status,
                    )}
                  >
                    <MilestoneStatusBadge status={currentMilestone.status} />
                  </StatusHint>
                </div>
              ) : null}
            </div>
          </div>

          <motion.div layout variants={pageStagger} className="flex flex-col gap-3">
            {contract.milestones.map((milestone, index) => (
              <MilestonePanel
                key={milestone.id}
                contract={contract}
                milestone={milestone}
                index={index}
                currentUser={currentUser}
                provider={provider}
                payer={payer}
                defaultOpen={milestone.id === currentMilestone?.id}
                isCurrent={milestone.id === currentMilestone?.id}
                isLast={index === contract.milestones.length - 1}
              />
            ))}
          </motion.div>
        </motion.div>

        <motion.aside
          variants={fadeUp}
          className="flex flex-col gap-7 lg:border-s lg:ps-6"
        >
          <motion.div variants={subtleListItem}>
            <PartiesPanel
              provider={provider}
              payer={payer}
              currentUser={currentUser}
            />
          </motion.div>
          <motion.div variants={subtleListItem}>
            <ContractRules contract={contract} />
          </motion.div>
        </motion.aside>
      </motion.section>
    </motion.main>
  );
}

function ColorMeaning({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn("size-2.5 rounded-full shadow-sm", className)}
        aria-hidden
      />
      <span>{label}</span>
    </span>
  );
}

function HeroFact({
  icon,
  label,
  value,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"];
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b pb-3">
      <span className="bg-background/80 text-muted-foreground flex size-9 items-center justify-center rounded-full">
        <HugeiconsIcon icon={icon} />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-muted-foreground text-xs">{label}</span>
        <span className="font-semibold tabular-nums">{value}</span>
      </div>
    </div>
  );
}

function MilestonePanel({
  contract,
  milestone,
  index,
  currentUser,
  provider,
  payer,
  defaultOpen,
  isCurrent,
  isLast,
}: {
  contract: ContractDetailItem;
  milestone: ContractDetailItem["milestones"][number];
  index: number;
  currentUser: DemoUser;
  provider?: ContractParty | null;
  payer?: ContractParty | null;
  defaultOpen: boolean;
  isCurrent: boolean;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const isCompleted =
    milestone.paymentStatus === "RELEASED" ||
    ["APPROVED", "AUTO_APPROVED"].includes(milestone.status);
  const isDisputed =
    milestone.status === "DISPUTED" ||
    milestone.paymentStatus === "RELEASE_PAUSED";

  return (
    <motion.div layout variants={subtleListItem}>
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="data-[state=open]:bg-muted/25 grid grid-cols-[2.75rem_1fr] gap-4 rounded-2xl px-2 transition-colors"
    >
      <div className="relative flex justify-center">
        {!isLast ? (
          <motion.span
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 0.12 + index * 0.04, duration: 0.36 }}
            className="bg-border/70 absolute top-[3.75rem] bottom-[-0.75rem] w-px"
            aria-hidden
          />
        ) : null}
        <CollapsibleTrigger asChild>
          <motion.button
            type="button"
            layout
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "focus-visible:ring-ring relative z-10 mt-5 flex size-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              isDisputed &&
                "border-destructive bg-destructive/10 text-destructive hover:bg-destructive/15",
              !isDisputed &&
                isCurrent &&
                !isCompleted &&
                "border-success bg-success text-success-foreground hover:bg-success/90 shadow-sm",
              !isDisputed &&
                isCompleted &&
                "border-contract-verified bg-contract-verified/10 text-contract-verified hover:bg-contract-verified/15 shadow-[0_0_0_3px_hsl(var(--contract-verified)/0.14)]",
              !isDisputed &&
                !isCurrent &&
                !isCompleted &&
                "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
            aria-label={`فتح أو طي ${milestone.title}`}
          >
            {index + 1}
          </motion.button>
        </CollapsibleTrigger>
      </div>

      <div>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="group focus-visible:ring-ring grid w-full gap-4 py-5 text-start focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
          >
            <span className="flex min-w-0 flex-col gap-2">
              <span className="flex flex-wrap items-center gap-2">
                <span className="min-w-0 truncate text-lg font-semibold">
                  {milestone.title}
                </span>
                {isCurrent && (
                  <>
                    <MilestoneStatusBadge status={milestone.status} />
                    <PaymentStatusBadge status={milestone.paymentStatus} />
                  </>
                )}
              </span>
              <span className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span>{milestone.reviewWindowHours} ساعة مراجعة</span>
                <span>
                  {milestone.revisionsUsed} / {milestone.revisionsAllowed}{" "}
                  تعديلات
                </span>
              </span>
            </span>

            <span className="flex items-center justify-between gap-3 md:justify-end">
              <span className="text-foreground text-xl font-semibold tabular-nums md:text-2xl">
                {formatSar(milestone.amount)}
              </span>
              <span className="text-muted-foreground bg-background/80 group-hover:text-foreground border-border/70 flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors">
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  className="group-data-[state=open]:hidden"
                />
                <HugeiconsIcon
                  icon={ArrowUp01Icon}
                  className="hidden group-data-[state=open]:block"
                />
              </span>
            </span>
          </button>
        </CollapsibleTrigger>

        <AnimatePresence initial={false}>
          {open ? (
            <CollapsibleContent forceMount asChild>
              <motion.div
                key="milestone-content"
                {...heightReveal}
                className="overflow-hidden"
              >
                <motion.div
                  variants={pageStagger}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-6 pb-6"
                >
                  <motion.p
                    variants={subtleListItem}
                    className="text-muted-foreground max-w-3xl text-sm leading-7"
                  >
                    {milestone.description}
                  </motion.p>
                  <motion.div
                    variants={subtleListItem}
                    className="grid gap-6 md:grid-cols-2"
                  >
                    <TermsBlock
                      title="التسليمات"
                      items={milestone.deliverables.map((item) => ({
                        id: item.id,
                        text: item.title,
                      }))}
                    />
                    <TermsBlock
                      title="معايير القبول"
                      items={milestone.acceptanceCriteria.map((item) => ({
                        id: item.id,
                        text: item.text,
                      }))}
                    />
                  </motion.div>
                  <motion.div variants={subtleListItem}>
                    <MilestoneAction
                      contractId={contract.id}
                      status={contract.status}
                      milestone={milestone}
                      payerUserId={payer?.userId}
                      providerUserId={provider?.userId}
                      currentUserId={currentUser.id}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </CollapsibleContent>
          ) : null}
        </AnimatePresence>
      </div>
      </Collapsible>
    </motion.div>
  );
}

function TermsBlock({
  title,
  items,
}: {
  title: string;
  items: Array<{ id: string; text: string }>;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-semibold">{title}</h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id} className="flex gap-2 text-sm leading-6">
            <span className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MilestoneAction({
  contractId,
  status,
  milestone,
  payerUserId,
  providerUserId,
  currentUserId,
}: {
  contractId: string;
  status: string;
  milestone: ContractDetailItem["milestones"][number];
  payerUserId?: string | null;
  providerUserId?: string | null;
  currentUserId: string;
}) {
  const openDispute = milestone.disputes.find(
    (dispute) => dispute.status === "OPEN",
  );
  const hasSubmission = milestone.submissions.length > 0;
  const hasHistoricalDelivery =
    hasSubmission ||
    [
      "APPROVED",
      "AUTO_APPROVED",
      "REVISION_REQUESTED",
      "CHANGE_REQUESTED",
    ].includes(milestone.status) ||
    milestone.paymentStatus === "RELEASED";

  let href: string | null = null;
  let label = "";
  let icon = ArrowLeft02Icon;
  let variant: React.ComponentProps<typeof Button>["variant"] = "outline";

  if (
    (status === "ACCEPTED" || status === "IN_PROGRESS") &&
    milestone.paymentStatus === "UNFUNDED" &&
    payerUserId === currentUserId
  ) {
    href = `/dashboard/contracts/${contractId}/milestones/${milestone.id}/fund`;
    label = "تمويل المرحلة";
    variant = "action";
  } else if (
    milestone.status === "UNDER_REVIEW" &&
    payerUserId === currentUserId
  ) {
    href = `/dashboard/contracts/${contractId}/milestones/${milestone.id}/review`;
    label = "مراجعة التسليم";
  } else if (
    milestone.paymentStatus === "FUNDED" &&
    providerUserId === currentUserId &&
    ["FUNDED", "IN_PROGRESS", "REVISION_REQUESTED"].includes(milestone.status)
  ) {
    href = `/dashboard/contracts/${contractId}/milestones/${milestone.id}/submit`;
    label = "إرسال التسليم";
  } else if (openDispute) {
    href = `/dashboard/contracts/${contractId}/milestones/${milestone.id}/dispute`;
    label = "عرض النزاع";
    icon = AlertCircleIcon;
    variant = "destructive";
  } else if (hasHistoricalDelivery) {
    href = `/dashboard/contracts/${contractId}/milestones/${milestone.id}/delivery`;
    label = "عرض التسليم";
    icon = FileViewIcon;
  }

  if (!href) return null;

  return (
    <Button className="w-fit" size="sm" variant={variant} asChild>
      <Link href={href}>
        {label}
        <HugeiconsIcon icon={icon} data-icon="inline-end" />
      </Link>
    </Button>
  );
}

function StatusHint({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactElement;
}) {
  return (
    <HelpTooltip title={title} content={description}>
      <button
        type="button"
        className="focus-visible:ring-ring rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {children}
      </button>
    </HelpTooltip>
  );
}

function PartiesPanel({
  provider,
  payer,
  currentUser,
}: {
  provider?: ContractParty | null;
  payer?: ContractParty | null;
  currentUser: DemoUser;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          icon={UserCircleIcon}
          className="text-muted-foreground"
        />
        <h2 className="font-semibold">الأطراف</h2>
      </div>
      {provider ? (
        <PartyLine
          label="مقدم الخدمة"
          party={provider}
          isCurrent={provider.userId === currentUser.id}
        />
      ) : null}
      {payer ? (
        <PartyLine
          label="الممول والمراجع"
          party={payer}
          isCurrent={payer.userId === currentUser.id}
        />
      ) : null}
    </section>
  );
}

function PartyLine({
  label,
  party,
  isCurrent,
}: {
  label: string;
  party: ContractParty;
  isCurrent: boolean;
}) {
  return (
    <div className="flex gap-3 border-b pb-4">
      <Avatar>
        <AvatarFallback>{initials(party.name)}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">{label}</span>
          {isCurrent ? <Badge variant="outline">أنت</Badge> : null}
        </div>
        <CopyableText value={party.name} label={party.name} />
        <CopyableText value={party.email} label={party.email} />
        <span className="text-muted-foreground text-xs">
          {party.acceptedAt ? "قبل العقد" : "بانتظار القبول"}
        </span>
      </div>
    </div>
  );
}

function ContractRules({ contract }: { contract: ContractDetailItem }) {
  const totalFunded = contract.milestones.reduce(
    (sum, milestone) =>
      sum + (milestone.paymentStatus === "FUNDED" ? milestone.amount : 0),
    0,
  );
  const totalReleased = contract.milestones.reduce(
    (sum, milestone) =>
      sum + (milestone.paymentStatus === "RELEASED" ? milestone.amount : 0),
    0,
  );

  return (
    <section className="flex flex-col gap-4 border-t pt-5">
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={Shield01Icon} className="text-muted-foreground" />
        <h2 className="font-semibold">الحماية</h2>
      </div>
      <Fact label="ممول" value={formatSar(totalFunded)} />
      <Fact label="مصروف" value={formatSar(totalReleased)} />
      <Fact
        label="آخر تحديث"
        value={new Intl.DateTimeFormat("ar-SA", {
          dateStyle: "medium",
        }).format(contract.updatedAt)}
      />
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

function HistorySheet({ contract }: { contract: ContractDetailItem }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <HugeiconsIcon
            icon={TransactionHistoryIcon}
            data-icon="inline-start"
          />
          السجل
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>سجل العقد</SheetTitle>
          <SheetDescription>{contract.title}</SheetDescription>
        </SheetHeader>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={pageStagger}
          className="flex flex-col gap-5 overflow-y-auto px-6 pb-6"
        >
          {contract.auditLogs.map((event) => (
            <motion.div
              key={event.id}
              variants={subtleListItem}
              className="grid grid-cols-[1.5rem_1fr] gap-3"
            >
              <span className="bg-primary mt-1.5 size-2 rounded-full" />
              <div className="flex min-w-0 flex-col gap-1 border-b pb-4">
                <span className="font-medium">{event.action}</span>
                <span className="text-muted-foreground text-sm leading-6">
                  {event.message}
                </span>
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <HugeiconsIcon icon={Calendar02Icon} />
                  {new Intl.DateTimeFormat("ar-SA", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(event.createdAt)}
                </span>
              </div>
            </motion.div>
          ))}
          {!contract.auditLogs.length ? (
            <div className="text-muted-foreground py-10 text-center text-sm">
              لا توجد أحداث بعد.
            </div>
          ) : null}
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}
