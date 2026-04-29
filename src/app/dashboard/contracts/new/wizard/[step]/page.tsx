import { redirect } from "next/navigation";

import { WizardCreateContractPage } from "@/features/contracts/components/wizard-create-contract-page";
import { isCreateContractStep } from "@/features/contracts/create-contract-defaults";

export default async function NewContractWizardStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;

  if (!isCreateContractStep(step)) {
    redirect("/dashboard/contracts/new/wizard/role");
  }

  return <WizardCreateContractPage step={step} />;
}
