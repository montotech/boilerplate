import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading";
import { toast } from "@/components/ui/use-toast";
import { useZodForm } from "@/hooks/use-zod-form";
import { api } from "@/lib/api";
import { handlePromise } from "@/lib/utils";
import { validationSchemaForCreateExampleComment } from "@/server/api/validation-schemas/example-comment.schema";
import { Loader2 } from "lucide-react";
import React from "react";

interface Props {
  postId: string;
  commentId?: string;
  isUpdate?: boolean;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommentInput = ({ postId, commentId, isUpdate, setIsEditing }: Props) => {
  const ctx = api.useContext();

  const { data: comment, isLoading: isCommentLoading } =
    api.exampleComment.show.useQuery(commentId ?? "", {
      enabled: !!commentId && isUpdate,
    });

  const { mutate: createComment, isLoading: isLoadingCreateComment } =
    api.exampleComment.create.useMutation({
      onSuccess: async () => {
        toast({
          description: "Reply sent successfully!",
        });

        await ctx.exampleComment.invalidate();
        form.reset();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          toast({
            variant: "destructive",
            description: errorMessage[0],
          });
        } else {
          toast({
            variant: "destructive",
            description: "Error! Please try again later.",
          });
        }
      },
    });

  const { mutate: updateComment, isLoading: isLoadingUpdateComment } =
    api.exampleComment.update.useMutation({
      onSuccess: async () => {
        toast({
          description: "Reply updated successfully!",
        });

        await ctx.exampleComment.invalidate();
        setIsEditing && setIsEditing(false);
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          toast({
            variant: "destructive",
            description: errorMessage[0],
          });
        } else {
          toast({
            variant: "destructive",
            description: "Error! Please try again later.",
          });
        }
      },
    });

  const form = useZodForm({
    schema: validationSchemaForCreateExampleComment,
  });

  const onSubmit = (data: { content: string; postId: string }) => {
    if (isUpdate && !!commentId) {
      updateComment({
        id: commentId,
        content: data.content,
      });
    } else {
      createComment(data);
    }
  };

  return (
    <div>
      <form
        onSubmit={handlePromise(
          form.handleSubmit((data) => {
            onSubmit(data);
          })
        )}
      >
        <div className="flex gap-x-2">
          <input type="hidden" value={postId} {...form.register("postId")} />
          <Input
            type="text"
            placeholder="Your reply"
            defaultValue={isUpdate && !!comment ? comment.content : undefined}
            {...form.register("content")}
          />
          {isUpdate && (
            <Button
              disabled={isLoadingCreateComment}
              className="bg-gray-500"
              onClick={() => {
                !!setIsEditing && setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          )}

          <Button
            disabled={isLoadingCreateComment}
            className="disabled:bg-gray-800"
            type="submit"
          >
            {isLoadingCreateComment || isLoadingUpdateComment ? (
              <Loader2 className="animate-spin text-slate-300" />
            ) : (
              "Reply"
            )}
          </Button>
        </div>
        {form.formState.errors.content?.message && (
          <p className="text-red-600">
            {form.formState.errors.content?.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CommentInput;
