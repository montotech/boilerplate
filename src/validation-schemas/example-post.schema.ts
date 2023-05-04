import { z } from "zod";

export const validationSchemaForCreateExamplePost = z.object({
  title: z.string().min(2),
  content: z.string().min(5),
});

export type ValidationSchemaForCreateExamplePost = z.TypeOf<
  typeof validationSchemaForCreateExamplePost
>;
