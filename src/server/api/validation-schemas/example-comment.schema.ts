import { z } from "zod";

export const validationSchemaForCreateExampleComment = z.object({
  content: z.string().min(1),
  postId: z.string(),
});

export type ValidationSchemaForCreateExampleComment = z.TypeOf<
  typeof validationSchemaForCreateExampleComment
>;

export const validationSchemaForUpdateExampleComment =
  validationSchemaForCreateExampleComment
    .pick({
      content: true,
    })
    .extend({
      id: z.string(),
    });

export type ValidationSchemaForUpdateExampleComment = z.TypeOf<
  typeof validationSchemaForUpdateExampleComment
>;

export const validationSchemaForListExampleComments =
  validationSchemaForCreateExampleComment
    .pick({
      postId: true,
    })
    .extend({
      limit: z.number().min(1).max(20).nullish(),
      cursor: z.string().nullish(),
    });

export type ValidationSchemaForListExampleComments = z.TypeOf<
  typeof validationSchemaForListExampleComments
>;
