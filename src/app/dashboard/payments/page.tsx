import { PaymentsTable } from "./payments-table";
import { formatSar } from "@/features/contracts/display";
import { requireCurrentDemoUser } from "@/server/demo-session";
import { listContractsForUser } from "@/server/services/contract-workflow";

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
      </header>

      <section className="grid gap-5 md:grid-cols-2">
        <PaymentMetric label="ممول" value={formatSar(totals.funded)} />
        <PaymentMetric label="مصروف" value={formatSar(totals.released)} />
      </section>

      <PaymentsTable data={contracts} currentUser={currentUser} />
    </div>
  );
}

function PaymentMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b pb-4">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
    </div>
  );
}
