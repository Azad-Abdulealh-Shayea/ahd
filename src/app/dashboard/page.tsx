import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  MoneySecurityIcon,
  Payment02Icon,
  Task01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  MotionListItem,
  MotionMain,
  MotionSection,
} from "@/components/app/motion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ContractStatusBadge,
  formatSar,
  PaymentStatusBadge,
} from "@/features/contracts/display";
import {
  getNextAction,
  getOtherParty,
  getPrimaryMilestone,
  type ContractListItem,
} from "@/features/contracts/view-models";
import { cn } from "@/lib/utils";
import { requireCurrentDemoUser } from "@/server/demo-session";
import { listContractsForUser } from "@/server/services/contract-workflow";
import type { DemoUser, Milestone } from "../../../generated/prisma";

import { DashboardStatusPie, DashboardTrendChart } from "./dashboard-charts";

export default async function DashboardPage() {
  const currentUser = await requireCurrentDemoUser();
  const contracts = await listContractsForUser(currentUser);
  const summary = getDashboardSummary(contracts, currentUser);

  return (
    <TooltipProvider delayDuration={250}>
      <MotionMain className="mx-auto flex w-full max-w-6xl flex-col gap-9">
        <StatsSection summary={summary} />
        <ChartsSection summary={summary} />
        <ContractsSection summary={summary} currentUser={currentUser} />
      </MotionMain>
    </TooltipProvider>
  );
}

function StatsSection({ summary }: { summary: DashboardSummary }) {
  const stats = [
    {
      label: "العقود النشطة",
      value: summary.activeContracts.toLocaleString("ar-SA"),
      hint: "العقود غير المكتملة أو الملغاة.",
      icon: CheckmarkCircle02Icon,
      accentClassName: "border-t-success",
      dotClassName: "bg-success",
    },
    {
      label: "إجمالي الممول",
      value: formatSar(summary.totalFundedAmount),
      hint: "كل ما تم تمويله، سواء كان محجوزاً أو مصروفاً.",
      icon: MoneySecurityIcon,
      accentClassName: "border-t-primary",
      dotClassName: "bg-primary",
    },
    {
      label: "الأموال المحجوزة",
      value: formatSar(summary.heldAmount),
      hint: "مبالغ ممولة ولم تُصرف بعد.",
      icon: Task01Icon,
      accentClassName: "border-t-warning",
      dotClassName: "bg-warning",
    },
    {
      label: "الإيراد المحقق",
      value: formatSar(summary.releasedAmount),
      hint: "مدفوعات مراحل تم اعتمادها وصرفها.",
      icon: Payment02Icon,
      accentClassName: "border-t-contract-completed",
      dotClassName: "bg-contract-completed",
    },
  ];

  return (
    <MotionSection className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-sm">
            {summary.currentRoleLabel}
          </span>
          <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
            لوحة القيادة
          </h1>
        </div>
        <Button asChild>
          <Link href="/dashboard/contracts/new">
            إنشاء عقد
            <HugeiconsIcon icon={ArrowLeft02Icon} data-icon="inline-end" />
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-4">
        {stats.map((stat) => (
          <MotionListItem
            key={stat.label}
            className={cn(
              "flex min-w-0 flex-col gap-4 border-t-2 border-b py-5 md:border-e md:border-b-0 md:px-5 md:first:pe-0 md:last:border-e-0 md:last:ps-0",
              stat.accentClassName,
            )}
          >
            <div className="text-muted-foreground flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2">
                <span
                  className={cn("size-2 rounded-full", stat.dotClassName)}
                />
                <HugeiconsIcon icon={stat.icon} />
                {stat.label}
              </span>
              <InfoTooltip text={stat.hint} />
            </div>
            <span className="truncate text-2xl font-semibold tabular-nums">
              {stat.value}
            </span>
          </MotionListItem>
        ))}
      </div>
    </MotionSection>
  );
}

function ChartsSection({ summary }: { summary: DashboardSummary }) {
  return (
    <MotionSection className="grid gap-6 py-5 lg:grid-cols-[3fr_1fr]">
      <section className="flex min-w-0 flex-col gap-4 lg:pe-6">
        <SectionTitle
          title="حركة العقود"
          hint="أعمدة تقارن قيمة العقود والتمويل والحجز والصرف."
        />
        {summary.trendData.length ? (
          <DashboardTrendChart data={summary.trendData} />
        ) : (
          <EmptyChart>لا توجد بيانات كافية للرسم.</EmptyChart>
        )}
      </section>

      <section className="flex min-w-0 flex-col gap-4 pt-5 lg:ps-6 lg:pt-0">
        <SectionTitle
          title="حالة العقود"
          hint="توزيع سريع للعقود حسب الحالة الحالية."
        />
        {summary.pieData.length ? (
          <>
            <DashboardStatusPie
              data={summary.pieData}
              total={summary.totalContracts}
            />
            <div className="flex flex-col gap-2 text-sm">
              {summary.pieData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-muted-foreground flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    {item.name}
                  </span>
                  <span className="font-medium tabular-nums">
                    {item.value.toLocaleString("ar-SA")}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyChart>لا توجد عقود بعد.</EmptyChart>
        )}
      </section>
    </MotionSection>
  );
}

function ContractsSection({
  summary,
  currentUser,
}: {
  summary: DashboardSummary;
  currentUser: DemoUser;
}) {
  const rows = summary.tableRows;
  const title = summary.actionRows.length ? "يتطلب إجراء" : "آخر العقود";

  return (
    <MotionSection className="flex flex-col gap-4 py-5">
      <div className="flex items-center justify-between gap-4">
        <SectionTitle
          title={title}
          hint="أقرب عقود تحتاج انتباهك، أو أحدث العقود عند غياب الإجراءات."
        />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/contracts">عرض الكل</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>العقد</TableHead>
            <TableHead>الطرف</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>المرحلة</TableHead>
            <TableHead>المبلغ</TableHead>
            <TableHead className="text-end">الإجراء</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ contract, action }) => {
            const milestone = getPrimaryMilestone(contract);
            const otherParty = getOtherParty(contract, currentUser);

            return (
              <TableRow key={contract.id}>
                <TableCell className="max-w-64">
                  <Link
                    href={`/dashboard/contracts/${contract.id}`}
                    className="hover:text-primary block truncate font-medium"
                  >
                    {contract.title}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {otherParty?.name ?? "—"}
                </TableCell>
                <TableCell>
                  <ContractStatusBadge status={contract.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="max-w-40 truncate">
                      {milestone?.title ?? "—"}
                    </span>
                    {milestone ? (
                      <PaymentStatusBadge status={milestone.paymentStatus} />
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="font-medium tabular-nums">
                  {formatSar(milestone?.amount ?? contract.totalAmount)}
                </TableCell>
                <TableCell className="text-end">
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={action.href}>
                      {action.label}
                      <HugeiconsIcon
                        icon={ArrowLeft02Icon}
                        data-icon="inline-end"
                      />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {!rows.length ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-muted-foreground h-32 text-center"
              >
                لا توجد عقود بعد.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </MotionSection>
  );
}

function SectionTitle({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex items-center gap-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <InfoTooltip text={hint} />
    </div>
  );
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-full outline-none focus-visible:ring-3"
          aria-label="معلومة"
        >
          <HugeiconsIcon icon={InformationCircleIcon} />
        </button>
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
}

function EmptyChart({ children }: { children: ReactNode }) {
  return (
    <div className="text-muted-foreground flex h-56 items-center justify-center text-sm">
      {children}
    </div>
  );
}

type DashboardSummary = ReturnType<typeof getDashboardSummary>;

function getDashboardSummary(
  contracts: ContractListItem[],
  currentUser: DemoUser,
) {
  const milestones = contracts.flatMap((contract) => contract.milestones);
  const activeContracts = contracts.filter(
    (contract) =>
      contract.status !== "COMPLETED" && contract.status !== "CANCELLED",
  ).length;
  const totalFundedAmount = sumMilestones(
    milestones.filter((milestone) => milestone.paymentStatus !== "UNFUNDED"),
  );
  const heldAmount = sumMilestones(
    milestones.filter((milestone) =>
      ["FUNDED", "RELEASE_PAUSED"].includes(milestone.paymentStatus),
    ),
  );
  const releasedAmount = sumMilestones(
    milestones.filter((milestone) => milestone.paymentStatus === "RELEASED"),
  );
  const rowCandidates = contracts.map((contract) => ({
    contract,
    action: getNextAction(contract, currentUser),
  }));
  const actionRows = rowCandidates.filter(({ action }) =>
    ["fund", "review", "submit"].includes(action.group),
  );

  return {
    currentRoleLabel: currentUser.roleLabel,
    totalContracts: contracts.length,
    activeContracts,
    totalFundedAmount,
    heldAmount,
    releasedAmount,
    trendData: getTrendData(contracts),
    pieData: getPieData(contracts),
    actionRows,
    tableRows: (actionRows.length ? actionRows : rowCandidates).slice(0, 5),
  };
}

function getTrendData(contracts: ContractListItem[]) {
  return contracts
    .slice(0, 6)
    .reverse()
    .map((contract, index) => {
      const milestones = contract.milestones;
      const funded = sumMilestones(
        milestones.filter(
          (milestone) => milestone.paymentStatus !== "UNFUNDED",
        ),
      );
      const held = sumMilestones(
        milestones.filter((milestone) =>
          ["FUNDED", "RELEASE_PAUSED"].includes(milestone.paymentStatus),
        ),
      );
      const released = sumMilestones(
        milestones.filter(
          (milestone) => milestone.paymentStatus === "RELEASED",
        ),
      );

      return {
        label: `عقد ${new Intl.NumberFormat("ar-SA").format(index + 1)}`,
        total: contract.totalAmount,
        funded,
        held,
        released,
      };
    });
}

function getPieData(contracts: ContractListItem[]) {
  const groups = [
    {
      name: "نشط",
      value: contracts.filter((contract) =>
        ["ACCEPTED", "IN_PROGRESS"].includes(contract.status),
      ).length,
      fill: "var(--success)",
    },
    {
      name: "ينتظر",
      value: contracts.filter((contract) => contract.status === "SENT").length,
      fill: "var(--warning)",
    },
    {
      name: "مكتمل",
      value: contracts.filter((contract) => contract.status === "COMPLETED")
        .length,
      fill: "var(--brand-navy)",
    },
    {
      name: "متوقف",
      value: contracts.filter((contract) =>
        ["DISPUTED", "CANCELLED"].includes(contract.status),
      ).length,
      fill: "var(--destructive)",
    },
  ];

  return groups.filter((group) => group.value > 0);
}

function sumMilestones(milestones: Milestone[]) {
  return milestones.reduce((total, milestone) => total + milestone.amount, 0);
}
