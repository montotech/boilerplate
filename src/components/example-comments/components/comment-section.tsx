import CommentInput from "@/components/example-comments/components/comment-input";
import CommentList from "@/components/example-comments/components/comment-list";
import React from "react";

interface Props {
  postId: string;
}

const CommentSection = ({ postId }: Props) => {
  return (
    <div className="mt-5">
      <CommentInput postId={postId} />
      <CommentList postId={postId} />
    </div>
  );
};

export default CommentSection;
