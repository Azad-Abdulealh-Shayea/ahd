import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const systemRouter = createTRPCRouter({
  readiness: publicProcedure.query(({ ctx }) => {
    return {
      name: "Ahd",
      arabicName: "عهد",
      status: "ready_for_implementation",
      demoUser: ctx.demoUser
        ? {
            id: ctx.demoUser.id,
            name: ctx.demoUser.name,
            roleLabel: ctx.demoUser.roleLabel,
          }
        : null,
    };
  }),
});
