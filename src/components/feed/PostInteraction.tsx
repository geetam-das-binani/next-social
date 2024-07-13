"use client";
import { switchLike } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useOptimistic, useState } from "react";

const PostInteraction = ({
    postId,
    likes,
    comments,
}: {
    postId: number;
    likes: Array<{ userId: string }>;
    comments: number;
}) => {
    const { userId: currentUserId } = useAuth();
    if (!currentUserId) return null;
    const mappedLikes = likes.map((like) => like.userId);

    const [likesState, setLikeState] = useState({
        likeCount: likes.length,
        isLiked: mappedLikes.includes(currentUserId) ? true : false,
    });
    const [optimisticLikes, setOptimisticLikes] = useOptimistic(
        likesState,
        (state, value: boolean) => {
            return {
                likeCount: state.likeCount + (value ? 1 : -1),
                isLiked: value,
            };
        }
    );

    const likeAction = async () => {
        setOptimisticLikes(!optimisticLikes.isLiked);
        try {
            await switchLike(postId);
            
            
            setLikeState(state => ({
                likeCount: !optimisticLikes.isLiked ? optimisticLikes.likeCount+1: optimisticLikes.likeCount-1,

                
                isLiked: !optimisticLikes.isLiked,
            }));
           
            
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex items-center text-sm justify-between my-4">
            <div className="flex gap-8">
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl">
                    <form action={likeAction}>
                        <button>
                            <Image
                                alt=""
                                src={optimisticLikes.isLiked ? "/liked.png" : "/like.png"}
                                width={16}
                                height={16}
                                className="cursor-pointer"
                            />
                        </button>
                    </form>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">
                        {optimisticLikes.likeCount}
                        <span className="hidden md:inline"> Likes</span>
                    </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl">
                    <Image
                        alt=""
                        src={"/comment.png"}
                        width={16}
                        height={16}
                        className="cursor-pointer"
                    />
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">
                        {comments}
                        <span className="hidden md:inline"> Comments</span>
                    </span>
                </div>
            </div>
            <div className="">
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl">
                    <Image
                        alt=""
                        src={"/share.png"}
                        width={16}
                        height={16}
                        className="cursor-pointer"
                    />
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">
                        <span className="hidden md:inline"> Share</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PostInteraction;
