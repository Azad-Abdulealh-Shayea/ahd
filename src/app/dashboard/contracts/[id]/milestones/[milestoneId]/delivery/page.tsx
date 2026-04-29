import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight02Icon,
  Calendar02Icon,
  FileAttachmentIcon,
  FileViewIcon,
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

const submissionStatusCopy = {
  SUBMITTED: "بانتظار المراجعة",
  REVISION_REQUESTED: "طلب تعديل",
  APPROVED: "معتمد",
  DISPUTED: "ضمن نزاع",
  SUPERSEDED: "استبدل بتسليم أحدث",
} as const;

export default async function DeliveryPage({
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
  const latestSubmission = milestone?.submissions[0];

  if (!contract || !milestone || !latestSubmission) notFound();

  const outcome = getOutcome(milestone.status, milestone.paymentStatus);

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
          <MilestoneStatusBadge status={milestone.status} />
          <PaymentStatusBadge status={milestone.paymentStatus} />
          <Badge variant="outline">
            {submissionStatusCopy[latestSubmission.status]}
          </Badge>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <span className="text-muted-foreground text-sm">
              {contract.title}
            </span>
            <h1 className="text-3xl font-semibold tracking-normal">
              {milestone.title}
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
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={FileViewIcon}
                className="text-muted-foreground"
              />
              <h2 className="font-semibold">التسليم الأخير</h2>
            </div>
            <p className="text-muted-foreground max-w-3xl text-sm leading-7">
              {latestSubmission.message}
            </p>

            <div className="flex flex-wrap gap-3">
              {latestSubmission.deliverableUrl ? (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={latestSubmission.deliverableUrl}
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
              {latestSubmission.fileName ? (
                <Badge variant="secondary">
                  <HugeiconsIcon
                    icon={FileAttachmentIcon}
                    data-icon="inline-start"
                  />
                  {latestSubmission.fileName}
                </Badge>
              ) : null}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-semibold">معايير القبول</h2>
            <ul className="flex flex-col gap-2">
              {milestone.acceptanceCriteria.map((criterion, index) => (
                <li key={criterion.id} className="flex gap-3 text-sm leading-7">
                  <span className="bg-primary text-primary-foreground mt-1 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums">
                    {index + 1}
                  </span>
                  <span>{criterion.text}</span>
                </li>
              ))}
            </ul>
          </section>

          {outcome ? (
            <section className="border-contract-verified/40 bg-contract-verified/10 flex flex-col gap-2 rounded-2xl border p-4">
              <span className="font-semibold">{outcome.title}</span>
              <span className="text-muted-foreground text-sm leading-7">
                {outcome.description}
              </span>
            </section>
          ) : null}
        </div>

        <aside className="flex flex-col gap-5 lg:border-s lg:ps-6">
          <Fact
            label="تاريخ التسليم"
            value={new Intl.DateTimeFormat("ar-SA", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(latestSubmission.submittedAt)}
            icon={Calendar02Icon}
          />
          <Fact
            label="نافذة المراجعة"
            value={`${milestone.reviewWindowHours} ساعة`}
          />
          <Fact
            label="التعديلات"
            value={`${milestone.revisionsUsed} / ${milestone.revisionsAllowed}`}
          />
          <Fact
            label="موعد المراجعة"
            value={
              milestone.reviewDeadline
                ? new Intl.DateTimeFormat("ar-SA", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(milestone.reviewDeadline)
                : "-"
            }
          />
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

function getOutcome(milestoneStatus: string, paymentStatus: string) {
  if (paymentStatus === "RELEASED") {
    return {
      title: "تم اعتماد التسليم وصرف الدفعة",
      description: "هذه نسخة قراءة فقط من التسليم الذي بُني عليه الصرف.",
    };
  }

  if (milestoneStatus === "REVISION_REQUESTED") {
    return {
      title: "التسليم يحتاج تعديلاً",
      description: "تم حفظ هذا التسليم كمرجع، وينتظر النظام نسخة معدلة.",
    };
  }

  if (milestoneStatus === "DISPUTED") {
    return {
      title: "التسليم مرتبط بنزاع",
      description: "يمكن متابعة النزاع من صفحة النزاع الخاصة بهذه المرحلة.",
    };
  }

  if (milestoneStatus === "UNDER_REVIEW") {
    return {
      title: "التسليم قيد المراجعة",
      description: "ينتظر قرار المراجع ضمن نافذة المراجعة المحددة.",
    };
  }

  return null;
}
