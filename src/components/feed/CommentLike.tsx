"use client";
import { addReplyOnComment, toggleLikeOnComment } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { Reply } from "@prisma/client";
import Image from "next/image";
import { useOptimistic, useState } from "react";

import { Input } from "@/components/ui/input";

import ReplyOnComment from "./ReplyIOnComment";

const CommentLike = ({
  isMyLikeOnComment,
  commentId,
  userId,
  likesCount,
  replies,
}: {
  isMyLikeOnComment: Array<string>;
  commentId: number;
  userId: string;
  likesCount: number;
  replies: Reply[];
}) => {
  const [like, setLike] = useState({
    like: isMyLikeOnComment.includes(userId.toString()),
    likesCount: likesCount,
  });
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    like,
    (state) => ({
      like: !state.like,
      likesCount: state.like ? state.likesCount - 1 : state.likesCount + 1,
    })
  );

  const commentLikeAction = async () => {
    setOptimisticLikes("");

    try {
      await toggleLikeOnComment(commentId);
      setLike((prev) => ({
        like: !prev.like,
        likesCount: prev.like ? prev.likesCount - 1 : prev.likesCount + 1,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [allReplies, setReplies] = useState(replies);
  const [desc, setDesc] = useState("");
  const [optimisticReplies, setOptimisticReplies] = useOptimistic(
    allReplies,
    (state, value: Reply) => [value, ...state]
  );

  const handleReply = async () => {
    if (!desc) {
      setIsOpen(false);
      return;
    }
    setOptimisticReplies({
      id: Math.floor(Math.random() * 1000000),

      commentId,
      desc,
      createdAt: new Date(),
    });
    try {
      setIsOpen(false);
      const response = await addReplyOnComment(commentId, desc);

      setReplies((prev) => [response, ...prev]);
      setDesc("");
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsOpen(false);
    }
  };
  return (
    <>
      <div className="">
        <div className="flex items-center gap-4">
          <form action={commentLikeAction}>
            <button>
              <Image
                alt=""
                src={optimisticLikes.like ? "/liked.png" : "/like.png"}
                className="w-8 h-8 rounded-full"
                width={12}
                height={12}
              />
            </button>
          </form>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {optimisticLikes.likesCount} Likes
          </span>
          <button onClick={() => setIsOpen((prev) => !prev)} className="">
            Reply
          </button>
        </div>
        {isOpen && (
          <form className="flex gap-2" action={handleReply}>
            <Input
              placeholder="post your reply"
              value={desc}
              onChange={({ target }) => setDesc(target.value)}
            />
            <button>✅</button>
          </form>
        )}
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {optimisticReplies?.length > 0 &&
          optimisticReplies?.map((reply) => (
            <ReplyOnComment key={reply.id} reply={reply} />
          ))}
      </div>
    </>
  );
};

export default CommentLike;
