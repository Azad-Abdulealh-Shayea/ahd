import {
  contractIdSchema,
  createAndSendContractSchema,
  inviteTokenSchema,
  milestoneActionSchema,
  openDisputeSchema,
  requestChangeOrderSchema,
  requestRevisionSchema,
  submitCompletionRequestSchema,
} from "@/features/contracts/schemas";
import { createTRPCRouter, demoProcedure } from "@/server/api/trpc";
import {
  acceptInvite,
  approveMilestone,
  cancelDispute,
  createAndSendContract,
  fundMilestone,
  getContractById,
  listContractsForUser,
  openDispute,
  requestChangeOrder,
  requestRevision,
  resolveDispute,
  simulateAutoApprove,
  submitCompletionRequest,
} from "@/server/services/contract-workflow";

export const contractRouter = createTRPCRouter({
  list: demoProcedure.query(({ ctx }) => listContractsForUser(ctx.demoUser)),

  getById: demoProcedure
    .input(contractIdSchema)
    .query(({ ctx, input }) => getContractById(input.contractId, ctx.demoUser)),

  createAndSend: demoProcedure
    .input(createAndSendContractSchema)
    .mutation(({ ctx, input }) => createAndSendContract(input, ctx.demoUser)),

  acceptInvite: demoProcedure
    .input(inviteTokenSchema)
    .mutation(({ ctx, input }) =>
      acceptInvite(input.inviteToken, ctx.demoUser),
    ),

  fundMilestone: demoProcedure
    .input(milestoneActionSchema)
    .mutation(({ ctx, input }) => fundMilestone(input, ctx.demoUser)),

  submitCompletionRequest: demoProcedure
    .input(submitCompletionRequestSchema)
    .mutation(({ ctx, input }) => submitCompletionRequest(input, ctx.demoUser)),

  approveMilestone: demoProcedure
    .input(milestoneActionSchema)
    .mutation(({ ctx, input }) => approveMilestone(input, ctx.demoUser)),

  requestRevision: demoProcedure
    .input(requestRevisionSchema)
    .mutation(({ ctx, input }) => requestRevision(input, ctx.demoUser)),

  requestChangeOrder: demoProcedure
    .input(requestChangeOrderSchema)
    .mutation(({ ctx, input }) => requestChangeOrder(input, ctx.demoUser)),

  openDispute: demoProcedure
    .input(openDisputeSchema)
    .mutation(({ ctx, input }) => openDispute(input, ctx.demoUser)),

  resolveDispute: demoProcedure
    .input(milestoneActionSchema)
    .mutation(({ ctx, input }) => resolveDispute(input, ctx.demoUser)),

  cancelDispute: demoProcedure
    .input(milestoneActionSchema)
    .mutation(({ ctx, input }) => cancelDispute(input, ctx.demoUser)),

  simulateAutoApprove: demoProcedure
    .input(milestoneActionSchema)
    .mutation(({ ctx, input }) => simulateAutoApprove(input, ctx.demoUser)),
});
