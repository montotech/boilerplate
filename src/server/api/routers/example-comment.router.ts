import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import {
  validationSchemaForCreateExampleComment,
  validationSchemaForListExampleComments,
  validationSchemaForUpdateExampleComment,
} from "@/server/api/validation-schemas/example-comment.schema";
import ExampleCommentEntity from "@/server/business-logic/example-comment.entity";
import { z } from "zod";

export const exampleCommentRouter = createTRPCRouter({
  show: privateProcedure.input(z.string()).query(async ({ input }) => {
    return new ExampleCommentEntity().find(input);
  }),
  list: privateProcedure
    .input(validationSchemaForListExampleComments)
    .query(async ({ input }) => {
      return new ExampleCommentEntity().list(input);
    }),
  create: privateProcedure
    .input(validationSchemaForCreateExampleComment)
    .mutation(async ({ ctx, input }) => {
      return new ExampleCommentEntity().create(ctx.userId, input);
    }),
  update: privateProcedure
    .input(validationSchemaForUpdateExampleComment)
    .mutation(async ({ ctx, input }) => {
      return new ExampleCommentEntity().update(ctx.userId, input);
    }),
  delete: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return new ExampleCommentEntity().delete(ctx.userId, input);
    }),
});
