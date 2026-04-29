import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { MotionMain, MotionSection } from "@/components/app/motion";
import { formatSar, PaymentStatusBadge } from "@/features/contracts/display";
import { requireCurrentDemoUser } from "@/server/demo-session";
import { getContractById } from "@/server/services/contract-workflow";
import { FundingCheckout } from "./funding-checkout";

export default async function FundMilestonePage({
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
  const provider = contract?.parties.find((party) => party.role === "PROVIDER");
  const payer = contract?.parties.find((party) => party.role === "PAYER");

  if (!contract || !milestone) notFound();

  return (
    <MotionMain className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-10">
      <Button variant="ghost" size="sm" className="w-fit" asChild>
        <Link href={`/dashboard/contracts/${contract.id}`}>
          <HugeiconsIcon icon={ArrowRight02Icon} data-icon="inline-start" />
          العودة للعقد
        </Link>
      </Button>

      <MotionSection className="grid gap-8 border-b pb-8 lg:grid-cols-[1fr_22rem] lg:items-end">
        <div className="flex max-w-3xl flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <PaymentStatusBadge status={milestone.paymentStatus} />
            <span className="text-muted-foreground text-sm">{contract.id}</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-normal md:text-5xl">
            تمويل {milestone.title}
          </h1>
        </div>
        <div className="flex flex-col gap-1 border-s ps-5">
          <span className="text-muted-foreground text-sm">المبلغ</span>
          <span className="text-4xl font-semibold tabular-nums">
            {formatSar(milestone.amount)}
          </span>
        </div>
      </MotionSection>

      <FundingCheckout
        contractId={contract.id}
        contractTitle={contract.title}
        milestoneId={milestone.id}
        milestoneTitle={milestone.title}
        amount={milestone.amount}
        providerName={provider?.name ?? "-"}
        payerName={payer?.name ?? "-"}
      />
    </MotionMain>
  );
}
