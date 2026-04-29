import type {
  AcceptanceCriterion,
  AuditLog,
  ChangeOrder,
  Contract,
  ContractParty,
  DemoUser,
  Dispute,
  Milestone,
  MilestoneDeliverable,
  MilestoneSubmission,
} from "../../../generated/prisma";

type DisputeWithCriterion = Dispute & {
  acceptanceCriterion: AcceptanceCriterion;
  openedBy: DemoUser;
};

export type ContractListItem = Contract & {
  creator: DemoUser;
  parties: ContractParty[];
  milestones: Milestone[];
};

export type ContractDetailItem = Contract & {
  creator: DemoUser;
  parties: Array<ContractParty & { user: DemoUser | null }>;
  milestones: Array<
    Milestone & {
      deliverables: MilestoneDeliverable[];
      acceptanceCriteria: AcceptanceCriterion[];
      submissions: MilestoneSubmission[];
      changeOrders: ChangeOrder[];
      disputes: DisputeWithCriterion[];
    }
  >;
  changeOrders: ChangeOrder[];
  disputes: DisputeWithCriterion[];
  auditLogs: Array<AuditLog & { actor: DemoUser | null }>;
};

export function getParty(
  contract: Pick<ContractListItem, "parties">,
  role: "PROVIDER" | "PAYER",
) {
  return contract.parties.find((party) => party.role === role) ?? null;
}

export function getOtherParty(
  contract: Pick<ContractListItem, "parties">,
  user: Pick<DemoUser, "id" | "email">,
) {
  return (
    contract.parties.find(
      (party) => party.userId !== user.id && party.email !== user.email,
    ) ??
    contract.parties.find((party) => party.email !== user.email) ??
    contract.parties[0] ??
    null
  );
}

export function getCurrentUserParty(
  contract: Pick<ContractListItem, "parties">,
  user: Pick<DemoUser, "id" | "email">,
) {
  return (
    contract.parties.find(
      (party) => party.userId === user.id || party.email === user.email,
    ) ?? null
  );
}

export function getPrimaryMilestone(
  contract: Pick<ContractListItem, "milestones">,
) {
  return (
    contract.milestones.find(
      (milestone) => milestone.paymentStatus !== "RELEASED",
    ) ??
    contract.milestones[0] ??
    null
  );
}

export function getNextAction(
  contract: ContractListItem,
  user: Pick<DemoUser, "id" | "email">,
) {
  const party = getCurrentUserParty(contract, user);
  const milestone = getPrimaryMilestone(contract);

  if (!milestone) {
    return {
      label: "فتح العقد",
      href: `/dashboard/contracts/${contract.id}`,
      group: "view" as const,
    };
  }

  if (
    party?.role === "PAYER" &&
    (contract.status === "ACCEPTED" || contract.status === "IN_PROGRESS") &&
    milestone.paymentStatus === "UNFUNDED"
  ) {
    return {
      label: "تمويل المرحلة",
      href: `/dashboard/contracts/${contract.id}/milestones/${milestone.id}/fund`,
      group: "fund" as const,
    };
  }

  if (party?.role === "PAYER" && milestone.status === "UNDER_REVIEW") {
    return {
      label: "مراجعة التسليم",
      href: `/dashboard/contracts/${contract.id}/milestones/${milestone.id}/review`,
      group: "review" as const,
    };
  }

  if (
    party?.role === "PROVIDER" &&
    milestone.paymentStatus === "FUNDED" &&
    ["FUNDED", "IN_PROGRESS", "REVISION_REQUESTED"].includes(milestone.status)
  ) {
    return {
      label: "إرسال التسليم",
      href: `/dashboard/contracts/${contract.id}/milestones/${milestone.id}/submit`,
      group: "submit" as const,
    };
  }

  if (contract.status === "SENT") {
    return {
      label: "بانتظار القبول",
      href: `/dashboard/contracts/${contract.id}`,
      group: "waiting" as const,
    };
  }

  return {
    label: "فتح العقد",
    href: `/dashboard/contracts/${contract.id}`,
    group: "view" as const,
  };
}
