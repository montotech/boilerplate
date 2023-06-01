import React from "react";
import { Layout } from "@/components/layout/layout";
import { LoadingPage } from "@/components/ui/loading";
import { api, type RouterOutputs } from "@/lib/api";
import { type UserResource } from "@clerk/types";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ActionsTopbar } from "@/components/layout/actions-topbar";
import { ExampleCommentActionsDropdown } from "@/components/example-comments/components/actions-dropdown";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import CommentInput from "@/components/example-comments/components/comment-input";

dayjs.extend(relativeTime);

interface Props {
  postId: string;
}

const CommentList = ({ postId }: Props) => {
  const { user } = useUser();
  const { data } = api.exampleComment.list.useInfiniteQuery(
    {
      limit: 10,
      postId: postId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (!data || !user)
    return (
      <Layout noPadding fullScreenOnMobile>
        <LoadingPage />
      </Layout>
    );

  const comments = data?.pages.flatMap((page) => page.items);

  return (
    <div>
      {comments.map((item) => (
        <CommentItem item={item} user={user} key={item.comment.id} />
      ))}
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
          <div className="flex flex-col ">
            <div className="flex flex-col ">
              <p className="font-semibold">
                {user.fullName} ·{" "}
                <span className="text-sm font-thin">
                  {dayjs(item.comment.createdAt).fromNow()}
                </span>
              </p>
              <p>{item.comment.content}</p>
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
