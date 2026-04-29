"use client";

import { motion, pageStagger } from "@/components/app/motion";
import {
  ContractBasicsFields,
  ContractReviewSummary,
  CreateContractSection,
  CreateContractSummary,
  MilestoneBuilder,
  OtherPartyFields,
  RoleFields,
  SubmitCreateContractButton,
} from "@/features/contracts/components/create-contract-fields";
import { useCreateContractFlow } from "@/features/contracts/components/create-contract-provider";

export function ManualCreateContractPage() {
  const { submitContract, isSubmitting } = useCreateContractFlow();

  return (
    <motion.form
      initial="hidden"
      animate="visible"
      variants={pageStagger}
      className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1fr_18rem] lg:items-start"
      onSubmit={(event) => {
        event.preventDefault();
        submitContract();
      }}
    >
      <main className="flex min-w-0 flex-col gap-8">
        <header className="flex max-w-3xl flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-normal">
            إنشاء عقد يدوي
          </h1>
          <p className="text-muted-foreground text-sm leading-7">
            أدخل بيانات العقد، الطرف الآخر، ومراحل التنفيذ بوضوح.
          </p>
        </header>

        <CreateContractSection title="الدور">
          <RoleFields />
        </CreateContractSection>
        <CreateContractSection title="العقد">
          <ContractBasicsFields />
        </CreateContractSection>
        <CreateContractSection title="الطرف الآخر">
          <OtherPartyFields />
        </CreateContractSection>
        <CreateContractSection
          title="المراحل"
          description="قسّم العقد إلى مراحل تمويل ومراجعة واضحة. يمكنك إضافة أو إدراج حتى ست مراحل."
        >
          <MilestoneBuilder />
        </CreateContractSection>
        <CreateContractSection title="المراجعة والإرسال">
          <ContractReviewSummary />
          <div className="flex justify-end">
            <SubmitCreateContractButton isSubmitting={isSubmitting} />
          </div>
        </CreateContractSection>
      </main>
      <CreateContractSummary />
    </motion.form>
  );
}
