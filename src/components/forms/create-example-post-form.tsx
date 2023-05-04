import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { handlePromise } from "@/lib/promise";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useZodForm } from "@/hooks/use-zod-form";
import { toast } from "@/components/ui/use-toast";
import {
  type ValidationSchemaForCreateExamplePost,
  validationSchemaForCreateExamplePost,
} from "@/validation-schemas/example-post.schema";

const CreateExamplePostForm = () => {
  const ctx = api.useContext();
  const mutation = api.examplePost.create.useMutation({
    onSuccess: async () => {
      toast({
        description: "Your post has been saved.",
      });
      await ctx.examplePost.list.invalidate();
    },
  });

  const form = useZodForm({
    schema: validationSchemaForCreateExamplePost,
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = (data: ValidationSchemaForCreateExamplePost) => {
    mutation.mutate(data);
    form.reset();
  };

  return (
    <form
      onSubmit={handlePromise(form.handleSubmit(onSubmit))}
      className="max-w-2xl space-y-4"
    >
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" defaultValue="test" {...form.register("title")} />
        {form.formState.errors.title?.message && (
          <p className="text-red-600">{form.formState.errors.title?.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" {...form.register("content")} />
        {form.formState.errors.content?.message && (
          <p className="text-red-600">
            {form.formState.errors.content?.message}
          </p>
        )}
      </div>

      <div>
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Submitting" : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export { CreateExamplePostForm };
