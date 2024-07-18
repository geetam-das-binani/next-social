"use client";
import { deletePost, rePost } from "@/lib/actions";
import { PostType } from "@/types/types";
import Image from "next/image";
import { useActionState, useState } from "react";
import RePostButton from "./RePostButton";
import ViewPostButton from "./ViewPostButton";

const PostInfo = ({
  post,
  postId,
  isMyPost,
}: {
  post: PostType;
  postId: number;
  isMyPost: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const deletePostWithId = () => {
    if (isMyPost) deletePost.bind(null, postId)();
  };
  const [_, formAction] = useActionState(rePost, {
    desc: post.desc,
    image: post.img ?? "",
    video: post.video ?? "",
  });
  const handleRePost = async () => {
    try {
      formAction({
        desc: post.desc,
        image: post.img ?? "",
        video: post.video ?? "",
      });
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
    }
  };
  return (
    <div className="relative">
      <Image
        src={"/more.png"}
        width={16}
        height={16}
        alt=""
        className="w-10 h-10  rounded-full"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="absolute top-4 right-0 w-40 bg-white  rounded-lg flex flex-col  shadow-md z-50 text-xs p-4 ">
          <ul>
            <ViewPostButton post={post} />

            <form action={handleRePost}>
              <RePostButton />
            </form>
          </ul>

          {isMyPost && (
            <form
              className="flex items-center hover:bg-gray-100 p-2 "
              action={deletePostWithId}
            >
              <button className="w-full  text-red-600 text-xs">Delete</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default PostInfo;
