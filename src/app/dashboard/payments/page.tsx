import { MoneySecurityIcon, WalletIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { PaymentsTable } from "./payments-table";
import { formatSar } from "@/features/contracts/display";
import { requireCurrentDemoUser } from "@/server/demo-session";
import { listContractsForUser } from "@/server/services/contract-workflow";
import { cn } from "@/lib/utils";

export default async function PaymentsPage() {
  const currentUser = await requireCurrentDemoUser();
  const contracts = await listContractsForUser(currentUser);
  const totals = contracts.reduce(
    (sum, contract) => {
      for (const milestone of contract.milestones) {
        if (milestone.paymentStatus === "FUNDED")
          sum.funded += milestone.amount;
        if (milestone.paymentStatus === "RELEASED") {
          sum.released += milestone.amount;
        }
      }
      return sum;
    },
    { funded: 0, released: 0 },
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-10">
      <header className="flex max-w-3xl flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-normal">المدفوعات</h1>
        <p className="text-muted-foreground text-sm leading-7">
          سجل المبالغ الممولة عبر جميع عقودك، والمراحل التي تم صرفها.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-2">
        <PaymentMetric
          label="المبلغ الممول"
          value={formatSar(totals.funded)}
          icon={MoneySecurityIcon}
          accentColor="bg-primary/10 text-primary"
        />
        <PaymentMetric
          label="المبلغ المصروف"
          value={formatSar(totals.released)}
          icon={WalletIcon}
          accentColor="bg-success/10 text-success"
        />
      </section>

      <PaymentsTable data={contracts} currentUser={currentUser} />
    </div>
  );
}

function PaymentMetric({
  label,
  value,
  icon,
  accentColor,
}: {
  label: string;
  value: string;
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"];
  accentColor: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b pb-4">
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-2xl",
          accentColor,
        )}
      >
        <HugeiconsIcon icon={icon} className="size-5" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-muted-foreground text-sm">{label}</span>
        <span className="text-2xl font-semibold tabular-nums">{value}</span>
      </div>
    </div>
  );
}
