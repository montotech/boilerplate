import React from "react";
import { LoadingPage } from "@/components/ui/loading";
import { api, type RouterOutputs } from "@/lib/api";
import { type UserResource } from "@clerk/types";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ExampleCommentActionsDropdown } from "@/components/example-comments/components/actions-dropdown";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal } from "lucide-react";
import CommentInput from "@/components/example-comments/components/comment-input";

dayjs.extend(relativeTime);

interface Props {
  postId: string;
}

const CommentList = ({ postId }: Props) => {
  const { user } = useUser();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    api.exampleComment.list.useInfiniteQuery(
      {
        limit: 10,
        postId: postId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  if (!data || !user) return <LoadingPage />;

  const comments = data?.pages.flatMap((page) => page.items);

  return (
    <div>
      {comments.map((item) => (
        <CommentItem item={item} user={user} key={item.comment.id} />
      ))}
      <div className="mt-5 w-full text-center">
        {hasNextPage && (
          <Button
            onClick={() => void fetchNextPage().catch(console.error)}
            variant="ghost"
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Load more
          </Button>
        )}
      </div>
    </div>
  );
};

type ExampleComment = RouterOutputs["exampleComment"]["list"]["items"][number];

const CommentItem = ({
  item,
  user,
}: {
  item: ExampleComment;
  user: UserResource;
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const canEdit = item.author.id === user.id;

  return (
    <div className="border-gray mt-8 flex items-start justify-between border-t ">
      <div className="flex w-full gap-x-3 pt-5">
        <div>
          <Image
            src={user.profileImageUrl}
            alt={`${user.firstName ?? "user"}'s profile picture`}
            width={42}
            height={42}
            className="rounded-full"
          />
        </div>

        {!isEditing ? (
          <div className="flex flex-1 flex-col">
            <div className="flex flex-col ">
              <p className="font-semibold">
                {user.fullName} ·{" "}
                <span className="text-sm font-thin">
                  {dayjs(item.comment.createdAt).fromNow()}
                </span>
              </p>
              <div>
                <p>{item.comment.content}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <CommentInput
              postId={item.comment.postId}
              commentId={item.comment.id}
              isUpdate
              setIsEditing={setIsEditing}
            />
          </div>
        )}
      </div>
      <div>
        {canEdit && (
          <ExampleCommentActionsDropdown
            commentId={item.comment.id}
            setIsEditing={setIsEditing}
          >
            <Button variant="ghost" asChild>
              <div>
                <MoreHorizontal className="h-4 w-4" />
              </div>
            </Button>
          </ExampleCommentActionsDropdown>
        )}
      </div>
    </div>
  );
};

export default CommentList;
