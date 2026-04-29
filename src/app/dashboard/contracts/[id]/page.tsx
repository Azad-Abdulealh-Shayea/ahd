import { notFound } from "next/navigation";

import { requireCurrentDemoUser } from "@/server/demo-session";
import { getContractById } from "@/server/services/contract-workflow";
import { ContractDetailView } from "./contract-detail-view";

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await requireCurrentDemoUser();
  const contract = await getContractById(id, currentUser).catch(() => null);

  if (!contract) notFound();

  return <ContractDetailView contract={contract} currentUser={currentUser} />;
}
