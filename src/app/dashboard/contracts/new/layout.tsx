import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { CreateContractProvider } from "@/features/contracts/components/create-contract-provider";
import { db } from "@/server/db";
import { requireCurrentDemoUser } from "@/server/demo-session";

export default async function NewContractLayout({
  children,
}: {
  children: ReactNode;
}) {
  const currentUser = await requireCurrentDemoUser();
  const fixedOtherParty = await db.demoUser.findFirst({
    where: {
      id: {
        not: currentUser.id,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!fixedOtherParty) notFound();

  const defaultCreatorRole =
    currentUser.role === "PROVIDER" ? "PROVIDER" : "PAYER_REVIEWER";

  return (
    <CreateContractProvider
      defaultCreatorRole={defaultCreatorRole}
      fixedOtherParty={{
        name: fixedOtherParty.name,
        email: fixedOtherParty.email,
      }}
    >
      {children}
    </CreateContractProvider>
  );
}
