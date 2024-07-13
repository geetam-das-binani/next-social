"use client";

import { switchBlock, switchFollow } from "@/lib/actions";
import { useOptimistic, useState } from "react";

type Props = {
  userId: string;
 
  isUserBlocked: boolean;
  isFollowing: boolean;
  isFollowingRequestSent: boolean;
};
const UserInfoCardInteraction = ({
  userId,
 
  isUserBlocked,
  isFollowing,
  isFollowingRequestSent,
}: Props) => {
  const [userState, setUserState] = useState({
    isFollowing,
    isFollowingRequestSent,
    isUserBlocked,
  });
  const [optimisticState, switchoptimisticState] = useOptimistic(
    userState,
    (state, value: "follow" | "block") =>
      value === "follow"
        ? {
            ...state,
            isFollowing: state.isFollowing && false,
            isFollowingRequestSent:
              !state.isFollowingRequestSent && !state.isFollowing
                ? true
                : false,
          }
        : {
            ...state,
            isUserBlocked: !state.isUserBlocked,
          }
  );

  const follow = async () => {
    switchoptimisticState("follow");
    try {
      await switchFollow(userId);
      setUserState((prev) => ({
        ...prev,
        isFollowing: prev.isFollowing && false,
        isFollowingRequestSent:
          !prev.isFollowingRequestSent && !prev.isFollowing ? true : false,
      }));
    } catch (error) {
      console.log(error);
      
    }
  };

  const block = async () => {
    switchoptimisticState("block");
    try {
      await switchBlock(userId);
      setUserState((prev) => ({
        ...prev,
        isUserBlocked: !prev.isUserBlocked,
      }));
    } catch (error) { console.log(error);}
  };

  return (
    <>
      <form action={follow}>
        <button className="bg-blue-500 w-full text-white p-2 rounded-md text-sm">
          {optimisticState.isFollowing
            ? "Following"
            : optimisticState.isFollowingRequestSent
            ? "Friend Request sent"
            : "Follow"}
        </button>
      </form>

      <form action={block} className=" self-end">
        <button className="text-red-400  text-xs cursor-pointer">
          {optimisticState.isUserBlocked ? "User Blocked" : "Block User"}
        </button>
      </form>
    </>
  );
};

export default UserInfoCardInteraction;
