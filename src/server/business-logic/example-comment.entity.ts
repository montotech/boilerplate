import {
  type ValidationSchemaForUpdateExampleComment,
  type ValidationSchemaForCreateExampleComment,
  type ValidationSchemaForListExampleComments,
} from "@/server/api/validation-schemas/example-comment.schema";
import ClerkUserEntity from "@/server/business-logic/clerk-user.entity";
import { prisma } from "@/server/db";
import { type ExampleComment } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { type AsyncReturnType } from "type-fest";

export default class ExampleCommentEntity {
  async create(userId: string, input: ValidationSchemaForCreateExampleComment) {
    const comment = await prisma.exampleComment.create({
      data: {
        authorId: userId,
        postId: input.postId,
        content: input.postId,
      },
    });

    return comment;
  }

  async update(userId: string, input: ValidationSchemaForUpdateExampleComment) {
    const comment = await prisma.exampleComment.findUnique({
      where: {
        id: input.id,
      },
    });

    this.validateAccess(comment, userId);

    const updatedComment = await prisma.exampleComment.update({
      where: {
        id: input.id,
      },
      data: {
        authorId: userId,
        content: input.content,
      },
    });

    return updatedComment;
  }

  async delete(userId: string, commentId: string) {
    const comment = await prisma.exampleComment.findUnique({
      where: {
        id: commentId,
      },
    });

    this.validateAccess(comment, userId);

    await prisma.exampleComment.delete({
      where: {
        id: commentId,
      },
    });

    return true;
  }

  async find(commentId: string) {
    const comment = await prisma.exampleComment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Comment not found.",
      });
    }

    return comment;
  }

  async list(params: ValidationSchemaForListExampleComments) {
    const limit = params.limit ?? 10;
    const cursor = params.cursor;

    const comments = await prisma.exampleComment.findMany({
      take: limit + 1,
      where: {
        postId: params.postId,
      },
    });

    let nextCursor: typeof cursor;
    if (comments.length > limit) {
      const lastComment = comments[limit];
      nextCursor = lastComment?.id;
    }

    const userIdsFromComments = comments.map((comment) => comment.authorId);
    const users = await new ClerkUserEntity().listUsersForClient(
      userIdsFromComments
    );

    const items = comments.map((comment) =>
      this.mapAuthorToComment(comment, users)
    );

    return {
      items,
      nextCursor,
    };
  }

  private mapAuthorToComment(
    comment: ExampleComment,
    users: AsyncReturnType<typeof ClerkUserEntity.prototype.listUsersForClient>
  ) {
    const author = users.find((user) => user.id === comment.authorId);

    if (!author) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Author not found.",
      });
    }

    return {
      comment,
      author,
    };
  }

  private validateAccess(comment: ExampleComment | null, userId: string) {
    if (!comment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Comment not found.",
      });
    }

    if (comment.authorId !== userId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not the author of this comment.",
      });
    }
  }
}
