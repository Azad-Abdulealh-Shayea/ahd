import { ActionsTable } from "./actions-table";
import { requireCurrentDemoUser } from "@/server/demo-session";
import { listContractsForUser } from "@/server/services/contract-workflow";

export default async function ActionsPage() {
  const currentUser = await requireCurrentDemoUser();
  const contracts = await listContractsForUser(currentUser);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-10">
      <header className="flex max-w-3xl flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-normal">إجراء مطلوب</h1>
        <p className="text-muted-foreground text-sm leading-7">
          القرارات التي تنتظر منك خطوة واضحة.
        </p>
      </header>

      <ActionsTable data={contracts} currentUser={currentUser} />
    </div>
  );
}
