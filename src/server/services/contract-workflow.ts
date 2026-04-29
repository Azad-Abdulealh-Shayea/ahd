import { randomBytes } from "node:crypto";

import { TRPCError } from "@trpc/server";

import {
  ChangeOrderStatus,
  ContractPartyRole,
  ContractStatus,
  DisputeStatus,
  MilestoneStatus,
  PaymentStatus,
  SubmissionStatus,
} from "../../../generated/prisma";
import type { DemoUser, Prisma } from "../../../generated/prisma";
import {
  type CreateAndSendContractInput,
  type MilestoneActionInput,
  type OpenDisputeInput,
  type RequestChangeOrderInput,
  type RequestRevisionInput,
  type SubmitCompletionRequestInput,
} from "@/features/contracts/schemas";
import { db } from "@/server/db";

const contractInclude = {
  creator: true,
  parties: {
    include: {
      user: true,
    },
    orderBy: {
      role: "asc",
    },
  },
  milestones: {
    include: {
      deliverables: true,
      acceptanceCriteria: true,
      submissions: {
        orderBy: {
          submittedAt: "desc",
        },
      },
      changeOrders: {
        orderBy: {
          createdAt: "desc",
        },
      },
      disputes: {
        include: {
          acceptanceCriterion: true,
          openedBy: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  },
  changeOrders: {
    orderBy: {
      createdAt: "desc",
    },
  },
  disputes: {
    include: {
      acceptanceCriterion: true,
      openedBy: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  },
  auditLogs: {
    include: {
      actor: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  },
} satisfies Prisma.ContractInclude;

type Transaction = Prisma.TransactionClient;

const submittableMilestoneStatuses: MilestoneStatus[] = [
  MilestoneStatus.FUNDED,
  MilestoneStatus.IN_PROGRESS,
  MilestoneStatus.REVISION_REQUESTED,
];

const changeOrderMilestoneStatuses: MilestoneStatus[] = [
  MilestoneStatus.UNDER_REVIEW,
  MilestoneStatus.REVISION_REQUESTED,
  MilestoneStatus.CHANGE_REQUESTED,
];

function workflowError(
  message: string,
  code: TRPCError["code"] = "BAD_REQUEST",
) {
  return new TRPCError({ code, message });
}

function generateInviteToken() {
  return randomBytes(24).toString("base64url");
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

async function writeAudit(
  tx: Transaction,
  input: {
    contractId: string;
    milestoneId?: string;
    actorUserId?: string;
    action: string;
    message: string;
  },
) {
  return tx.auditLog.create({
    data: {
      contractId: input.contractId,
      milestoneId: input.milestoneId,
      actorUserId: input.actorUserId,
      action: input.action,
      message: input.message,
    },
  });
}

async function findAuthorizedContract(
  tx: Transaction,
  contractId: string,
  user: DemoUser,
) {
  const contract = await tx.contract.findUnique({
    where: { id: contractId },
    include: contractInclude,
  });

  if (!contract) {
    throw workflowError("العقد غير موجود.", "NOT_FOUND");
  }

  const isCreator = contract.creatorId === user.id;
  const isParty = contract.parties.some(
    (party) => party.userId === user.id || party.email === user.email,
  );

  if (!isCreator && !isParty) {
    throw workflowError("لا تملك صلاحية الوصول لهذا العقد.", "FORBIDDEN");
  }

  return contract;
}

async function findDemoCounterparty(tx: Transaction, user: DemoUser) {
  const counterparty = await tx.demoUser.findFirst({
    where: {
      id: {
        not: user.id,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!counterparty) {
    throw workflowError("لا يوجد مستخدم عرض آخر لإنشاء العقد معه.", "NOT_FOUND");
  }

  return counterparty;
}

function getCurrentUserParty(
  contract: Awaited<ReturnType<typeof findAuthorizedContract>>,
  user: DemoUser,
) {
  return (
    contract.parties.find(
      (party) => party.userId === user.id || party.email === user.email,
    ) ?? null
  );
}

function requirePartyRole(
  contract: Awaited<ReturnType<typeof findAuthorizedContract>>,
  user: DemoUser,
  role: ContractPartyRole,
) {
  const party = getCurrentUserParty(contract, user);

  if (party?.role !== role) {
    throw workflowError("هذا الإجراء غير متاح لدورك في العقد.", "FORBIDDEN");
  }

  return party;
}

function findMilestone(
  contract: Awaited<ReturnType<typeof findAuthorizedContract>>,
  milestoneId: string,
) {
  const milestone = contract.milestones.find((item) => item.id === milestoneId);

  if (!milestone) {
    throw workflowError("المرحلة غير موجودة في هذا العقد.", "NOT_FOUND");
  }

  return milestone;
}

function requireCriterionOnMilestone(
  milestone: ReturnType<typeof findMilestone>,
  acceptanceCriterionId: string,
) {
  const criterion = milestone.acceptanceCriteria.find(
    (item) => item.id === acceptanceCriterionId,
  );

  if (!criterion) {
    throw workflowError("يجب اختيار معيار قبول تابع لهذه المرحلة.");
  }

  return criterion;
}

function ensurePaymentCanRelease(milestone: ReturnType<typeof findMilestone>) {
  if (milestone.paymentStatus !== PaymentStatus.FUNDED) {
    throw workflowError("لا يمكن الصرف قبل تمويل المرحلة.");
  }

  if (
    milestone.status !== MilestoneStatus.APPROVED &&
    milestone.status !== MilestoneStatus.AUTO_APPROVED
  ) {
    throw workflowError("لا يمكن الصرف قبل اعتماد المرحلة.");
  }

  if (milestone.disputes.some((dispute) => dispute.status === "OPEN")) {
    throw workflowError("لا يمكن الصرف أثناء وجود نزاع مفتوح.");
  }

  if (milestone.releasedAt) {
    throw workflowError("تم صرف هذه المرحلة مسبقاً.");
  }
}

function latestSubmittedSubmission(
  milestone: ReturnType<typeof findMilestone>,
) {
  return milestone.submissions.find(
    (submission) => submission.status === SubmissionStatus.SUBMITTED,
  );
}

async function completeMilestoneIfContractDone(
  tx: Transaction,
  contractId: string,
) {
  const remaining = await tx.milestone.count({
    where: {
      contractId,
      paymentStatus: {
        not: PaymentStatus.RELEASED,
      },
    },
  });

  if (remaining === 0) {
    await tx.contract.update({
      where: { id: contractId },
      data: { status: ContractStatus.COMPLETED },
    });
  }
}

export async function listContractsForUser(user: DemoUser) {
  return db.contract.findMany({
    where: {
      OR: [
        { creatorId: user.id },
        { parties: { some: { userId: user.id } } },
        { parties: { some: { email: user.email } } },
      ],
    },
    include: {
      creator: true,
      parties: true,
      milestones: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getContractById(contractId: string, user: DemoUser) {
  return db.$transaction((tx) => findAuthorizedContract(tx, contractId, user));
}

export async function getContractInviteByToken(inviteToken: string) {
  return db.contract.findUnique({
    where: { inviteToken },
    include: contractInclude,
  });
}

export async function createAndSendContract(
  input: CreateAndSendContractInput,
  user: DemoUser,
) {
  const now = new Date();
  const inviteToken = generateInviteToken();

  const creatorIsProvider = input.creatorRole === "PROVIDER";

  return db.$transaction(async (tx) => {
    const invitedUser = await findDemoCounterparty(tx, user);
    const providerParty = creatorIsProvider
      ? {
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: null,
          role: ContractPartyRole.PROVIDER,
          acceptedAt: now,
        }
      : {
          userId: invitedUser.id,
          name: invitedUser.name,
          email: invitedUser.email,
          phone: null,
          role: ContractPartyRole.PROVIDER,
        };
    const payerParty = creatorIsProvider
      ? {
          userId: invitedUser.id,
          name: invitedUser.name,
          email: invitedUser.email,
          phone: null,
          role: ContractPartyRole.PAYER,
        }
      : {
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: null,
          role: ContractPartyRole.PAYER,
          acceptedAt: now,
        };

    const contract = await tx.contract.create({
      data: {
        title: input.title,
        description: input.description,
        creatorId: user.id,
        totalAmount: input.totalAmount,
        currency: "SAR",
        status: ContractStatus.SENT,
        inviteToken,
        sentAt: now,
        parties: {
          create: [providerParty, payerParty],
        },
        milestones: {
          create: input.milestones.map((milestone) => ({
            title: milestone.title,
            description: milestone.description,
            amount: milestone.amount,
            revisionsAllowed: milestone.revisionsAllowed,
            reviewWindowHours: milestone.reviewWindowHours,
            status: MilestoneStatus.AWAITING_FUNDING,
            paymentStatus: PaymentStatus.UNFUNDED,
            deliverables: {
              create: milestone.deliverables,
            },
            acceptanceCriteria: {
              create: milestone.acceptanceCriteria.map((criterion) => ({
                text: criterion,
              })),
            },
          })),
        },
      },
    });

    await writeAudit(tx, {
      contractId: contract.id,
      actorUserId: user.id,
      action: "CONTRACT_CREATED",
      message: `تم إنشاء العقد "${contract.title}".`,
    });
    await writeAudit(tx, {
      contractId: contract.id,
      actorUserId: user.id,
      action: "CONTRACT_SENT",
      message: `تم إرسال العقد إلى ${invitedUser.name}.`,
    });

    return findAuthorizedContract(tx, contract.id, user);
  });
}

export async function acceptInvite(inviteToken: string, user: DemoUser) {
  return db.$transaction(async (tx) => {
    const contract = await tx.contract.findUnique({
      where: { inviteToken },
      include: contractInclude,
    });

    if (!contract) {
      throw workflowError("رابط الدعوة غير صحيح أو منتهي.", "NOT_FOUND");
    }

    const invitedParty = contract.parties.find(
      (party) => party.email === user.email || party.userId === user.id,
    );

    if (!invitedParty) {
      throw workflowError("هذه الدعوة ليست لهذا المستخدم.", "FORBIDDEN");
    }

    if (invitedParty.acceptedAt) {
      return contract;
    }

    const now = new Date();
    await tx.contractParty.update({
      where: { id: invitedParty.id },
      data: {
        userId: user.id,
        acceptedAt: now,
      },
    });
    await tx.contract.update({
      where: { id: contract.id },
      data: {
        status: ContractStatus.ACCEPTED,
        acceptedAt: now,
      },
    });
    await writeAudit(tx, {
      contractId: contract.id,
      actorUserId: user.id,
      action: "CONTRACT_ACCEPTED",
      message: `قبل ${user.name} شروط العقد.`,
    });

    return findAuthorizedContract(tx, contract.id, user);
  });
}

export async function fundMilestone(
  input: MilestoneActionInput,
  user: DemoUser,
) {
  return db.$transaction(async (tx) => {
    const contract = await findAuthorizedContract(tx, input.contractId, user);
    requirePartyRole(contract, user, ContractPartyRole.PAYER);
    const milestone = findMilestone(contract, input.milestoneId);

    if (
      contract.status !== ContractStatus.ACCEPTED &&
      contract.status !== ContractStatus.IN_PROGRESS
    ) {
      throw workflowError("لا يمكن تمويل المرحلة قبل قبول العقد.");
    }

    if (milestone.paymentStatus !== PaymentStatus.UNFUNDED) {
      throw workflowError("هذه المرحلة ليست بانتظار التمويل.");
    }

    await tx.milestone.update({
      where: { id: milestone.id },
      data: {
        status: MilestoneStatus.FUNDED,
        paymentStatus: PaymentStatus.FUNDED,
      },
    });
    await tx.contract.update({
      where: { id: contract.id },
      data: { status: ContractStatus.IN_PROGRESS },
    });
    await writeAudit(tx, {
      contractId: contract.id,
      milestoneId: milestone.id,
      actorUserId: user.id,
      action: "MILESTONE_FUNDED",
      message: `تم تمويل مرحلة "${milestone.title}".`,
    });

    return findAuthorizedContract(tx, contract.id, user);
  });
}

export async function submitCompletionRequest(
  input: SubmitCompletionRequestInput,
  user: DemoUser,
) {
  return db.$transaction(async (tx) => {
    const contract = await findAuthorizedContract(tx, input.contractId, user);
    requirePartyRole(contract, user, ContractPartyRole.PROVIDER);
    const milestone = findMilestone(contract, input.milestoneId);

    if (
      milestone.paymentStatus !== PaymentStatus.FUNDED ||
      !submittableMilestoneStatuses.includes(milestone.status)
    ) {
      throw workflowError("لا يمكن إرسال تسليم لهذه المرحلة حالياً.");
    }

    await tx.milestoneSubmission.updateMany({
      where: {
        milestoneId: milestone.id,
        status: SubmissionStatus.SUBMITTED,
      },
      data: {
        status: SubmissionStatus.SUPERSEDED,
      },
    });

    const now = new Date();
    await tx.milestoneSubmission.create({
      data: {
        milestoneId: milestone.id,
        submittedByUserId: user.id,
        message: input.message,
        deliverableUrl: input.deliverableUrl,
        fileName: input.fileName,
        submittedAt: now,
        status: SubmissionStatus.SUBMITTED,
      },
    });
    await tx.milestone.update({
      where: { id: milestone.id },
      data: {
        status: MilestoneStatus.UNDER_REVIEW,
        submittedAt: now,
        reviewDeadline: addHours(now, milestone.reviewWindowHours),
      },
    });
    await writeAudit(tx, {
      contractId: contract.id,
      milestoneId: milestone.id,
      actorUserId: user.id,
      action: "COMPLETION_SUBMITTED",
      message: `تم إرسال تسليم مرحلة "${milestone.title}" للمراجعة.`,
    });

    return findAuthorizedContract(tx, contract.id, user);
  });
}

export async function approveMilestone(
  input: MilestoneActionInput,
  user: DemoUser,
) {
  return db.$transaction(async (tx) => {
    const contract = await findAuthorizedContract(tx, input.contractId, user);
    requirePartyRole(contract, user, ContractPartyRole.PAYER);
    const milestone = findMilestone(contract, input.milestoneId);

    if (milestone.status !== MilestoneStatus.UNDER_REVIEW) {
      throw workflowError("هذه المرحلة ليست قيد المراجعة.");
    }

    const approvedMilestone = {
      ...milestone,
      status: MilestoneStatus.APPROVED,
    };
    ensurePaymentCanRelease(approvedMilestone);

    const now = new Date();
    await tx.milestone.update({
      where: { id: milestone.id },
      data: {
        status: MilestoneStatus.APPROVED,
        paymentStatus: PaymentStatus.RELEASED,
        approvedAt: now,
        releasedAt: now,
      },
    });
    await tx.milestoneSubmission.updateMany({
      where: {
        milestoneId: milestone.id,
        status: SubmissionStatus.SUBMITTED,
      },
      data: { status: SubmissionStatus.APPROVED },
    });
    await writeAudit(tx, {
      contractId: contract.id,
      milestoneId: milestone.id,
      actorUserId: user.id,
      action: "MILESTONE_APPROVED",
      message: `تم اعتماد مرحلة "${milestone.title}".`,
    });
    await writeAudit(tx, {
      contractId: contract.id,
      milestoneId: milestone.id,
      actorUserId: user.id,
      action: "PAYMENT_RELEASED",
      message: `تم صرف ${milestone.amount} SAR لمرحلة "${milestone.title}".`,
    });
    await completeMilestoneIfContractDone(tx, contract.id);

    return findAuthorizedContract(tx, contract.id, user);
  });
}

export async function requestRevision(
  input: RequestRevisionInput,
  user: DemoUser,
) {
  return db.$transaction(async (tx) => {
    const contract = await findAuthorizedContract(tx, input.contractId, user);
    requirePartyRole(contract, user, ContractPartyRole.PAYER);
    const milestone = findMilestone(contract, input.milestoneId);
    const criterion = requireCriterionOnMilestone(
      milestone,
      input.acceptanceCriterionId,
    );

    if (milestone.status !== MilestoneStatus.UNDER_REVIEW) {
      throw workflowError("لا يمكن طلب تعديل إلا أثناء المراجعة.");
    }

    if (milestone.revisionsUsed >= milestone.revisionsAllowed) {
      throw workflowError(
        "تم استهلاك المراجعات المتاحة. اختر الاعتماد أو طلب تغيير مدفوع أو فتح نزاع.",
      );
    }

    const submission = latestSubmittedSubmission(milestone);
    await tx.milestone.update({
      where: { id: milestone.id },
      data: {
        status: MilestoneStatus.REVISION_REQUESTED,
        revisionsUsed: { increment: 1 },
      },
    });
    if (submission) {
      await tx.milestoneSubmission.update({
        where: { id: submission.id },
        data: { status: SubmissionStatus.REVISION_REQUESTED },
      });
    }
    await writeAudit(tx, {
      contractId: contract.id,
      milestoneId: milestone.id,
      actorUserId: user.id,
      action: "REVISION_REQUESTED",
      message: `طلب تعديل على معيار "${criterion.text}": ${input.feedback}`,
    });

    return findAuthorizedContract(tx, contract.id, user);
  });
}

export async function requestChangeOrder(
  input: RequestChangeOrderInput,
  user: DemoUser,
) {
  return db.$transaction(async (tx) => {
    const contract = await findAuthorizedContract(tx, input.contractId, user);
    requirePartyRole(contract, user, ContractPartyRole.PAYER);
    const milestone = findMilestone(contract, input.milestoneId);

    if (!changeOrderMilestoneStatuses.includes(milestone.status)) {
      throw workflowError("لا يمكن طلب تغيير مدفوع لهذه المرحلة حالياً.");
    }

    await tx.changeOrder.create({
      data: {
        contractId: contract.id,
        milestoneId: milestone.id,
        requestedById: user.id,
        title: input.title,
        description: input.description,
        amount: input.amount,
        currency: "SAR",
        status: ChangeOrderStatus.REQUESTED,
      },
    });
    await tx.milestone.update({
      where: { id: milestone.id },
      data: { status: MilestoneStatus.CHANGE_REQUESTED },
    });
    await writeAudit(tx, {
      contractId: contract.id,
      milestoneId: milestone.id,
      actorUserId: user.id,
      action: "CHANGE_ORDER_REQUESTED",
      message: `تم طلب تغيير مدفوع "${input.title}" بقيمة ${input.amount} SAR.`,
    });

    return findAuthorizedContract(tx, contract.id, user);
  });
}

export async function openDispute(input: OpenDisputeInput, user: DemoUser) {
  return db.$transaction(async (tx) => {
    const contract = await findAuthorizedContract(tx, input.contractId, user);
    requirePartyRole(contract, user, ContractPartyRole.PAYER);
    const milestone = findMilestone(contract, input.milestoneId);
    const criterion = requireCriterionOnMilestone(
      milestone,
      input.acceptanceCriterionId,
    );

    await tx.dispute.create({
      data: {
        contractId: contract.id,
        milestoneId: milestone.id,
        acceptanceCriterionId: criterion.id,
        openedById: user.id,
        reason: input.reason,
      },
    });
    await tx.milestone.update({
      where: { id: milestone.id },
      data: {
        status: MilestoneStatus.DISPUTED,
        paymentStatus:
          milestone.paymentStatus === PaymentStatus.RELEASED
            ? PaymentStatus.RELEASED
            : PaymentStatus.RELEASE_PAUSED,
      },
    });
    await tx.contract.update({
      where: { id: contract.id },
      data: { status: ContractStatus.DISPUTED },
    });
    await tx.milestoneSubmission.updateMany({
      where: {
        milestoneId: milestone.id,
        status: SubmissionStatus.SUBMITTED,
      },
      data: { status: SubmissionStatus.DISPUTED },
    });
    await writeAudit(tx, {
      contractId: contract.id,
      milestoneId: milestone.id,
      actorUserId: user.id,
      action: "DISPUTE_OPENED",
      message: `تم فتح نزاع على معيار "${criterion.text}": ${input.reason}`,
    });

    return findAuthorizedContract(tx, contract.id, user);
  });
}

async function closeDispute(
  input: MilestoneActionInput,
  user: DemoUser,
  status: "RESOLVED" | "CANCELLED",
) {
  return db.$transaction(async (tx) => {
    const contract = await findAuthorizedContract(tx, input.contractId, user);
    const party = getCurrentUserParty(contract, user);

    if (!party && contract.creatorId !== user.id) {
      throw workflowError("لا تملك صلاحية إدارة النزاع.", "FORBIDDEN");
    }

    const milestone = findMilestone(contract, input.milestoneId);
    const openDispute = milestone.disputes.find(
      (dispute) => dispute.status === DisputeStatus.OPEN,
    );

    if (!openDispute) {
      throw workflowError("لا يوجد نزاع مفتوح على هذه المرحلة.");
    }

    await tx.dispute.update({
      where: { id: openDispute.id },
      data: { status },
    });
    await tx.milestone.update({
      where: { id: milestone.id },
      data: {
        status: MilestoneStatus.UNDER_REVIEW,
        paymentStatus: PaymentStatus.FUNDED,
      },
    });
    await tx.contract.update({
      where: { id: contract.id },
      data: { status: ContractStatus.IN_PROGRESS },
    });
    await tx.milestoneSubmission.updateMany({
      where: {
        milestoneId: milestone.id,
        status: SubmissionStatus.DISPUTED,
      },
      data: { status: SubmissionStatus.SUBMITTED },
    });
    await writeAudit(tx, {
      contractId: contract.id,
      milestoneId: milestone.id,
      actorUserId: user.id,
      action:
        status === DisputeStatus.RESOLVED
          ? "DISPUTE_RESOLVED"
          : "DISPUTE_CANCELLED",
      message:
        status === DisputeStatus.RESOLVED
          ? `تم حل النزاع على مرحلة "${milestone.title}" وإرجاعها للمراجعة.`
          : `تم إلغاء النزاع على مرحلة "${milestone.title}" وإرجاعها للمراجعة.`,
    });

    return findAuthorizedContract(tx, contract.id, user);
  });
}

export async function resolveDispute(
  input: MilestoneActionInput,
  user: DemoUser,
) {
  return closeDispute(input, user, DisputeStatus.RESOLVED);
}

export async function cancelDispute(
  input: MilestoneActionInput,
  user: DemoUser,
) {
  return closeDispute(input, user, DisputeStatus.CANCELLED);
}

export async function simulateAutoApprove(
  input: MilestoneActionInput,
  user: DemoUser,
) {
  return db.$transaction(async (tx) => {
    const contract = await findAuthorizedContract(tx, input.contractId, user);
    const party = getCurrentUserParty(contract, user);
    const isCreator = contract.creatorId === user.id;
    if (!isCreator && party?.role !== ContractPartyRole.PAYER) {
      throw workflowError("هذا التحكم متاح للمنشئ أو المراجع فقط.");
    }
    const milestone = findMilestone(contract, input.milestoneId);

    if (milestone.status !== MilestoneStatus.UNDER_REVIEW) {
      throw workflowError("الاعتماد التلقائي متاح فقط للمرحلة قيد المراجعة.");
    }

    const autoApprovedMilestone = {
      ...milestone,
      status: MilestoneStatus.AUTO_APPROVED,
    };
    ensurePaymentCanRelease(autoApprovedMilestone);

    const now = new Date();
    await tx.milestone.update({
      where: { id: milestone.id },
      data: {
        status: MilestoneStatus.AUTO_APPROVED,
        paymentStatus: PaymentStatus.RELEASED,
        approvedAt: now,
        releasedAt: now,
        reviewDeadline: now,
      },
    });
    await tx.milestoneSubmission.updateMany({
      where: {
        milestoneId: milestone.id,
        status: SubmissionStatus.SUBMITTED,
      },
      data: { status: SubmissionStatus.APPROVED },
    });
    await writeAudit(tx, {
      contractId: contract.id,
      milestoneId: milestone.id,
      actorUserId: user.id,
      action: "AUTO_APPROVED",
      message: `تم اعتماد مرحلة "${milestone.title}" تلقائياً.`,
    });
    await writeAudit(tx, {
      contractId: contract.id,
      milestoneId: milestone.id,
      actorUserId: user.id,
      action: "PAYMENT_RELEASED",
      message: `تم صرف ${milestone.amount} SAR بعد الاعتماد التلقائي.`,
    });
    await completeMilestoneIfContractDone(tx, contract.id);

    return findAuthorizedContract(tx, contract.id, user);
  });
}
