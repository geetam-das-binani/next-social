import Image from "next/image";
import Comments from "./Comments";
import { PostType } from "@/types/types";
import PostInteraction from "./PostInteraction";
import { Suspense } from "react";
import PostInfo from "./PostInfo";
import { auth } from "@clerk/nextjs/server";

const Posts = ({ post }: { post: PostType }) => {
  const { userId } = auth();
  if (!userId) return null
  const isMyPost = post.userId === userId;
  return (
    <div className="flex flex-col gap-4">
      {/* user */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src={post.user.avatar ?? "/noAvatar.png"}
            width={48}
            height={48}
            alt=""
            className="w-10 h-10  rounded-full"
          />
          <span>
            {post.user.name && post.user.surname
              ? post.user.name + " " + post.user.surname
              : post.user?.username}
          </span>
        </div>

        <PostInfo userId={userId} postId={post.id} isMyPost={isMyPost} />
      </div>
      {/* description and image */}
      <div className="flex flex-col gap-4">
        {post.img && (
          <div className="relative w-full min-h-96">
            <Image
              src={post.img}
              fill
              alt=""
              className="object-cover rounded-md"
            />

          </div>
        )}
        <p>{post.desc}</p>
      </div>

      {/* interaction */}
      <PostInteraction
        postId={post.id}
        likes={post.likes}
        comments={post._count.comments}
      />

      {/* comments */}
      <Suspense fallback="Loading">
        {" "}
        <Comments postId={post.id} />
      </Suspense>
    </div>
  );
};

export default Posts;
