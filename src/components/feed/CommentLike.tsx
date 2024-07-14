"use client";
import { toggleLikeOnComment } from "@/lib/actions";
import { performServerHandshake } from "http2";
import Image from "next/image";
import { useState } from "react";

const CommentLike = ({
  isMyLikeOnComment,
  commentId,
  userId,
  likesCount,
}: {
  isMyLikeOnComment: Array<string>;
  commentId: number;
  userId: string;
  likesCount: number;
}) => {
  const [like, setLike] = useState({
    like: isMyLikeOnComment.includes(userId.toString()),
    likesCount: likesCount,
  });

  const commentLikeAction = async () => {
    setLike((prev) => ({
      like: !prev.like,
      likesCount: prev.like ? prev.likesCount - 1 : prev.likesCount + 1,
    }));

    try {
      await toggleLikeOnComment(commentId);
    } catch (error) {
      console.log(error);
      setLike((prev) => ({
        like: !prev.like,
        likesCount: like ? likesCount - 1 : likesCount + 1,
      }));
    }
  };
  console.log(like);

  return (
    <>
      <form action={commentLikeAction}>
        <button>
          <Image
            alt=""
            src={like.like ? "/liked.png" : "/like.png"}
            className="w-8 h-8 rounded-full"
            width={12}
            height={12}
          />
        </button>
      </form>
      <span className="text-gray-300">|</span>
      <span className="text-gray-500">{like.likesCount} Likes</span>
    </>
  );
};

export default CommentLike;
