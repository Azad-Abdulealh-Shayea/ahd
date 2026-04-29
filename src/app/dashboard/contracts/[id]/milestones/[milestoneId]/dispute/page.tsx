import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertCircleIcon,
  ArrowRight02Icon,
  Calendar02Icon,
  FileAttachmentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MotionMain, MotionSection } from "@/components/app/motion";
import {
  formatSar,
  MilestoneStatusBadge,
  PaymentStatusBadge,
} from "@/features/contracts/display";
import { requireCurrentDemoUser } from "@/server/demo-session";
import { getContractById } from "@/server/services/contract-workflow";
import { DisputeActions } from "./dispute-actions";

const disputeStatusCopy = {
  OPEN: "مفتوح",
  RESOLVED: "محلول",
  CANCELLED: "ملغي",
} as const;

export default async function DisputePage({
  params,
}: {
  params: Promise<{ id: string; milestoneId: string }>;
}) {
  const { id, milestoneId } = await params;
  const currentUser = await requireCurrentDemoUser();
  const contract = await getContractById(id, currentUser).catch(() => null);
  const milestone = contract?.milestones.find(
    (item) => item.id === milestoneId,
  );
  const dispute =
    milestone?.disputes.find((item) => item.status === "OPEN") ??
    milestone?.disputes[0];
  const submission = milestone?.submissions[0];

  if (!contract || !milestone || !dispute) notFound();

  return (
    <MotionMain className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <Button variant="ghost" size="sm" className="w-fit" asChild>
        <Link href={`/dashboard/contracts/${contract.id}`}>
          <HugeiconsIcon icon={ArrowRight02Icon} data-icon="inline-start" />
          العودة للعقد
        </Link>
      </Button>

      <MotionSection className="flex max-w-4xl flex-col gap-4 border-b pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={dispute.status === "OPEN" ? "destructive" : "outline"}>
            {disputeStatusCopy[dispute.status]}
          </Badge>
          <MilestoneStatusBadge status={milestone.status} />
          <PaymentStatusBadge status={milestone.paymentStatus} />
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <span className="text-muted-foreground text-sm">
              {contract.title}
            </span>
            <h1 className="text-3xl font-semibold tracking-normal">
              نزاع على {milestone.title}
            </h1>
          </div>
          <span className="text-3xl font-semibold tabular-nums">
            {formatSar(milestone.amount)}
          </span>
        </div>
      </MotionSection>

      <MotionSection className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <div className="text-destructive flex items-center gap-2">
              <HugeiconsIcon icon={AlertCircleIcon} />
              <h2 className="font-semibold">سبب النزاع</h2>
            </div>
            <p className="text-muted-foreground max-w-3xl text-sm leading-7">
              {dispute.reason}
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-semibold">المعيار المرتبط</h2>
            <div className="flex gap-3 text-sm leading-7">
              <span className="bg-destructive/10 text-destructive mt-1 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                !
              </span>
              <span>{dispute.acceptanceCriterion.text}</span>
            </div>
          </section>

          {submission ? (
            <section className="flex flex-col gap-4 border-t pt-6">
              <h2 className="font-semibold">التسليم المرتبط</h2>
              <p className="text-muted-foreground text-sm leading-7">
                {submission.message}
              </p>
              <div className="flex flex-wrap gap-3">
                {submission.deliverableUrl ? (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={submission.deliverableUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <HugeiconsIcon
                        icon={FileAttachmentIcon}
                        data-icon="inline-start"
                      />
                      فتح رابط التسليم
                    </a>
                  </Button>
                ) : null}
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href={`/dashboard/contracts/${contract.id}/milestones/${milestone.id}/delivery`}
                  >
                    عرض صفحة التسليم
                  </Link>
                </Button>
              </div>
            </section>
          ) : null}
        </div>

        <aside className="flex flex-col gap-6 lg:border-s lg:ps-6">
          <div className="flex flex-col gap-3">
            <Fact label="فتح النزاع بواسطة" value={dispute.openedBy.name} />
            <Fact
              label="تاريخ الفتح"
              value={new Intl.DateTimeFormat("ar-SA", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(dispute.createdAt)}
              icon={Calendar02Icon}
            />
            <Fact
              label="حالة النزاع"
              value={disputeStatusCopy[dispute.status]}
            />
            <Fact label="حالة الدفعة" value={milestone.paymentStatus} />
          </div>

          {dispute.status === "OPEN" ? (
            <DisputeActions
              contractId={contract.id}
              milestoneId={milestone.id}
            />
          ) : null}
        </aside>
      </MotionSection>
    </MotionMain>
  );
}

function Fact({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: Parameters<typeof HugeiconsIcon>[0]["icon"];
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b pb-3 text-sm">
      <span className="text-muted-foreground flex items-center gap-1.5">
        {icon ? <HugeiconsIcon icon={icon} /> : null}
        {label}
      </span>
      <span className="text-end font-medium tabular-nums">{value}</span>
    </div>
  );
}
