import Link from "next/link";

import { Button } from "@/components/ui/button";
import { requireCurrentDemoUser } from "@/server/demo-session";
import { listContractsForUser } from "@/server/services/contract-workflow";
import { ContractsTable } from "./contracts-table";

export default async function ContractsIndexPage() {
  const currentUser = await requireCurrentDemoUser();
  const contracts = await listContractsForUser(currentUser);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-3xl flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-normal">العقود</h1>
          <p className="text-muted-foreground text-sm leading-7">
            عقودك الحالية وحالتها.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/contracts/new">إنشاء عقد جديد</Link>
        </Button>
      </header>

      <ContractsTable data={contracts} currentUser={currentUser} />
    </div>
  );
}
