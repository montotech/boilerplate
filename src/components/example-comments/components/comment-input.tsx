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
}

const CommentInput = ({ postId }: Props) => {
  const ctx = api.useContext();
  const { mutate, isLoading } = api.exampleComment.create.useMutation({
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

  const form = useZodForm({
    schema: validationSchemaForCreateExampleComment,
  });

  return (
    <div>
      <form onSubmit={handlePromise(form.handleSubmit((data) => mutate(data)))}>
        <div className="flex gap-x-2">
          <input type="hidden" value={postId} {...form.register("postId")} />
          <Input
            type="text"
            placeholder="Your reply"
            {...form.register("content")}
          />
          <Button disabled={isLoading} className="disabled:bg-gray-800">
            {isLoading ? <Loader2 /> : "Reply"}
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
