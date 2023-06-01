import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { type MouseEvent, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ExampleCommentActionsDropdown = ({
  children,
  commentId,
  withoutEdit,
}: {
  children: React.ReactNode;
  commentId: string;
  withoutEdit?: boolean;
}) => {
  const ctx = api.useContext();
  const router = useRouter();
  const deleteMutation = api.exampleComment.delete.useMutation({
    onSuccess: async () => {
      toast({
        description: "Your comment has been deleted.",
      });

      await ctx.exampleComment.list.invalidate();
      // await router.push("/example-posts");
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
  const [isOpen, setIsOpen] = useState(false);

  const onDeleteConfirmed = (e: MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(commentId);
    ctx.exampleComment.invalidate().catch(console.error);
    setIsOpen(false);
    // void router.push("/example-posts");
  };

  const DeleteConfirmationDialog = () => {
    return (
      <AlertDialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this Example Comment?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteConfirmed}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <>
      <DeleteConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent>
          {!withoutEdit && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                // void router.push(`/example-posts/${postId}/edit`);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-red-400"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { ExampleCommentActionsDropdown };
