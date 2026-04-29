import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertCircleIcon,
  ArrowRight02Icon,
  FileAttachmentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MotionMain, MotionSection } from "@/components/app/motion";
import { Separator } from "@/components/ui/separator";
import {
  formatSar,
  MilestoneStatusBadge,
  PaymentStatusBadge,
} from "@/features/contracts/display";
import { requireCurrentDemoUser } from "@/server/demo-session";
import { getContractById } from "@/server/services/contract-workflow";
import { ReviewWorkflowActions } from "./review-workflow-actions";

export default async function ReviewMilestonePage({
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

  if (!contract || !milestone) notFound();

  const revisionsExhausted =
    milestone.revisionsUsed >= milestone.revisionsAllowed;

  return (
    <MotionMain className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <Button variant="ghost" size="sm" className="w-fit" asChild>
        <Link href={`/dashboard/contracts/${id}`}>
          <HugeiconsIcon icon={ArrowRight02Icon} data-icon="inline-start" />
          العودة للعقد
        </Link>
      </Button>

      <MotionSection className="flex max-w-4xl flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <MilestoneStatusBadge status={milestone.status} />
          <PaymentStatusBadge status={milestone.paymentStatus} />
          <span className="text-muted-foreground text-sm">
            {contract.title}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-normal">
          مراجعة طلب الإنجاز
        </h1>
        <p className="text-muted-foreground text-sm leading-7">
          القرار هنا يجب أن يرتبط بمعايير القبول.
        </p>
      </MotionSection>

      <MotionSection className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-7">
          <section className="flex flex-col gap-4 border-b pb-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">المرحلة</span>
                <h2 className="text-2xl font-semibold">{milestone.title}</h2>
              </div>
              <span className="text-xl font-semibold">
                {formatSar(milestone.amount)}
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-7">
              {milestone.submissions[0]?.message ?? "لا توجد رسالة تسليم."}
            </p>
            {milestone.submissions[0]?.deliverableUrl ? (
              <Button variant="outline" className="w-fit" asChild>
                <a href={milestone.submissions[0].deliverableUrl}>
                  <HugeiconsIcon
                    icon={FileAttachmentIcon}
                    data-icon="inline-start"
                  />
                  فتح رابط التسليم
                </a>
              </Button>
            ) : null}
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">معايير القبول</h2>
            <div className="grid gap-3">
              {milestone.acceptanceCriteria.map((criterion, index) => (
                <div
                  key={criterion.id}
                  className="bg-card flex gap-3 rounded-2xl border p-4"
                >
                  <span className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-7">{criterion.text}</span>
                </div>
              ))}
            </div>
          </section>

          {revisionsExhausted ? (
            <Alert>
              <HugeiconsIcon icon={AlertCircleIcon} />
              <AlertTitle>استنفدت التعديلات المتضمنة</AlertTitle>
              <AlertDescription>
                يمكنك الاعتماد، طلب تغيير مدفوع، أو فتح نزاع مبني على معيار قبول
                محدد. لا يظهر خيار التعديل المجاني كتدفق أساسي.
              </AlertDescription>
            </Alert>
          ) : null}
        </div>

        <aside className="flex flex-col gap-6 lg:border-s lg:ps-6">
          <ReviewWorkflowActions
            contractId={contract.id}
            milestoneId={milestone.id}
            criteria={milestone.acceptanceCriteria.map((criterion) => ({
              id: criterion.id,
              text: criterion.text,
            }))}
            revisionsExhausted={revisionsExhausted}
          />

          <Separator />

          <div className="grid gap-3 text-sm">
            <Fact
              label="التعديلات"
              value={`${milestone.revisionsUsed} / ${milestone.revisionsAllowed}`}
            />
            <Fact
              label="نافذة المراجعة"
              value={`${milestone.reviewWindowHours} ساعة`}
            />
            <Fact
              label="الموعد"
              value={milestone.reviewDeadline?.toLocaleString("ar-SA") ?? "-"}
            />
          </div>
        </aside>
      </MotionSection>
    </MotionMain>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
