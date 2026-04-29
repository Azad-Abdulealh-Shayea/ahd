import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { MotionMain, MotionSection } from "@/components/app/motion";
import { Separator } from "@/components/ui/separator";
import { formatSar, PaymentStatusBadge } from "@/features/contracts/display";
import { requireCurrentDemoUser } from "@/server/demo-session";
import { getContractById } from "@/server/services/contract-workflow";
import { SubmitCompletionForm } from "./submit-completion-form";

export default async function SubmitMilestonePage({
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
  const payer = contract?.parties.find((party) => party.role === "PAYER");

  if (!contract || !milestone) notFound();

  return (
    <MotionMain className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <Button variant="ghost" size="sm" className="w-fit" asChild>
        <Link href={`/dashboard/contracts/${id}`}>
          <HugeiconsIcon icon={ArrowRight02Icon} data-icon="inline-start" />
          العودة للعقد
        </Link>
      </Button>

      <MotionSection className="flex max-w-3xl flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <PaymentStatusBadge status={milestone.paymentStatus} />
          <span className="text-muted-foreground text-sm">
            {contract.title}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-normal">
          إرسال طلب الإنجاز
        </h1>
        <p className="text-muted-foreground text-sm leading-7">
          أرسل ما يثبت إنجاز المرحلة ليبدأ عداد المراجعة. سيُراجع الطرف الآخر
          الطلب بناءً على معايير القبول المكتوبة هنا.
        </p>
      </MotionSection>

      <MotionSection className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-3 border-b pb-5">
            <span className="text-muted-foreground text-sm">المرحلة</span>
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold">{milestone.title}</h2>
                <p className="text-muted-foreground max-w-2xl text-sm leading-7">
                  {milestone.description}
                </p>
              </div>
              <span className="text-xl font-semibold">
                {formatSar(milestone.amount)}
              </span>
            </div>
          </div>

          <SubmitCompletionForm
            contractId={contract.id}
            milestoneId={milestone.id}
          />
        </div>

        <aside className="flex flex-col gap-6 lg:border-s lg:ps-6">
          <TermsBlock title="التسليمات" items={milestone.deliverables} />
          <Separator />
          <TermsBlock
            title="معايير القبول"
            items={milestone.acceptanceCriteria}
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
            <Fact label="الممول / المراجع" value={payer?.name ?? "-"} />
          </div>
        </aside>
      </MotionSection>
    </MotionMain>
  );
}

function TermsBlock({
  title,
  items,
}: {
  title: string;
  items: Array<{ id: string; title?: string; text?: string }>;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-semibold">{title}</h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id} className="flex gap-2 text-sm leading-6">
            <span className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
            <span>{item.title ?? item.text}</span>
          </li>
        ))}
      </ul>
    </section>
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
