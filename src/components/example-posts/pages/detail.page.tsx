import { Layout } from "@/components/layout/layout";
import { api } from "@/lib/api";
import { LoadingPage } from "@/components/ui/loading";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { ActionsTopbar } from "@/components/layout/actions-topbar";
import Link from "next/link";

import { ActionsDropdown } from "@/components/example-posts/components/actions-dropdown";
import { useUser } from "@clerk/clerk-react";
import CommentSection from "@/components/example-comments/components/comment-section";

const ExamplePostDetailPage = ({ id }: { id: string }) => {
  const query = api.examplePost.show.useQuery(id);
  const post = query.data;
  const { user } = useUser();

  if (!post)
    return (
      <Layout noPadding fullScreenOnMobile>
        <LoadingPage />
      </Layout>
    );

  const canEdit = user && user.id === post.author.id;

  return (
    <Layout noPadding fullScreenOnMobile>
      <div>
        <ActionsTopbar>
          <Link href={`/example-posts/#${post.post.id}`}>
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          {canEdit && (
            <ActionsDropdown postId={id}>
              <Button variant="ghost" asChild>
                <div>
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              </Button>
            </ActionsDropdown>
          )}
        </ActionsTopbar>
        <div className="max-w-2xl p-3 md:px-8 md:py-6">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            {post.post.title}
          </h2>
          <div>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              {post.post.content}
            </p>
          </div>
          <div className="pt-16"></div>
          <div className="flex items-center gap-2">
            <Image
              src={post.author.profileImageUrl}
              alt="Author"
              width={24}
              height={24}
              className="rounded-full"
            />
            <p className="text-sm text-muted-foreground ">
              {post.author.firstName}
            </p>
          </div>
          <CommentSection postId={id} />
        </div>
      </div>
    </Layout>
  );
};

export default ExamplePostDetailPage;
