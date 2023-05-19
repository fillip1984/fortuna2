import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const WeighInRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ date: z.date(), weight: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.weighIn.create({
        data: {
          date: input.date,
          weight: input.weight,
          weightProgress: 0,
          weightTotalChange: 0,
          weightToGoal: 0,
          previousWeighInId: "111",
        },
      });
    }),
  readAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.weighIn.findMany({
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        date: true,
        weight: true,
        weightProgress: true,
        weightTotalChange: true,
        weightToGoal: true,
      },
    });
  }),
  readOne: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.weighIn.findUnique({ where: { id: input.id } });
    }),
  update: publicProcedure
    .input(z.object({ id: z.string().cuid(), weight: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.weighIn.update({
        data: {
          weight: input.weight,
        },
        where: {
          id: input.id,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.weighIn.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
