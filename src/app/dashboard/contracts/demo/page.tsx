import { redirect } from "next/navigation";

import { requireCurrentDemoUser } from "@/server/demo-session";
import { listContractsForUser } from "@/server/services/contract-workflow";

export default async function LegacyDemoContractPage() {
  const currentUser = await requireCurrentDemoUser();
  const [contract] = await listContractsForUser(currentUser);

  redirect(
    contract ? `/dashboard/contracts/${contract.id}` : "/dashboard/contracts",
  );
}
