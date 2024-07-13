"use client";
import { addComment } from "@/lib/actions";
import { CommentType } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Fragment, useOptimistic, useState } from "react";

const CommentsLists = ({
  comments,
  postId,
}: {
  comments: CommentType[];
  postId: number;
}) => {
  const { user } = useUser();
  const [commentState, setCommentState] = useState(comments);
  const [desc, setDesc] = useState("");
  const [optimisticComments, setOptimisicComments] = useOptimistic(
    commentState,
    (state, value: CommentType) => [value, ...state]
  );

  const commentAction = async () => {
    if (!user || !desc) return;
    setOptimisicComments({
      id: Math.floor(Math.random() * 1000000),
      desc,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      postId,
      user: {
        name: user.firstName,
        surname: user.lastName,
        username: user.username,
        avatar: user.imageUrl || "noAvatar.png",
      },
    });
    try {
      const newComment = await addComment(postId, desc);
      setCommentState((prev) => [newComment, ...prev]);
      setDesc("");
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Fragment>
      <div className="flex items-center gap-4">
        <Image
          alt=""
          src={user?.imageUrl ?? "/noAvatar.png"}
          className="w-8 h-8 rounded-full"
          width={32}
          height={32}
        />
        <form
          action={commentAction}
          className="flex flex-1 w-full  bg-slate-100 rounded-xl text-sm justify-between items-center px-6 py-2"
        >
          <input
            type="text"
            placeholder="Write a comment"
            className="bg-transparent outline-none flex-1 "
            onChange={({ target }) => setDesc(target.value)}
            value={desc}
          />
          <Image
            alt=""
            src={"/emoji.png"}
            className="cursor-pointer"
            width={32}
            height={32}
          />
        </form>
      </div>

      <div className="">
        {/* comments  */}
        {optimisticComments.map((comment) => (
          <div key={comment.id} className="flex  gap-4 justify-between mt-6">
            {/* avatar  */}
            <Image
              alt=""
              src={comment.user.avatar ?? "/noAvatar.png"}
              className="w-10 h-10 rounded-full"
              width={40}
              height={40}
            />
            {/* description  */}
            <div className="flex flex-col gap-2  flex-1">
              <span className="font-medium">
                {" "}
                {comment.user.name && comment.user.surname
                  ? comment.user.name + " " + comment.user.surname
                  : comment.user?.username}
              </span>

              <p>{comment.desc}</p>

              <div className="flex items-center gap-8 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <Image
                    alt=""
                    src={"/like.png"}
                    className="w-8 h-8 rounded-full"
                    width={12}
                    height={12}
                  />
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">0 Likes</span>
                </div>
                <div className="">Reply</div>
              </div>
            </div>

            {/* icon  */}
            <Image
              src={"/more.png"}
              width={16}
              height={16}
              alt={""}
              className="w-4 h-4 cursor-pointer"
            ></Image>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default CommentsLists;
