import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { getSchema, putSchema } from "@/types/category.type";

type MyPayload = {
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export const categoryRouter = createTRPCRouter({
  get: protectedProcedure.input(getSchema).mutation(({input, ctx}) => {
    console.log(ctx.user);
    return {
      category: "get category",
    };
  }),
  put: protectedProcedure.input(putSchema).mutation(({input, ctx}) => {
    console.log(ctx.user);
    return {
      category: "put category",
    };
  }),
});
