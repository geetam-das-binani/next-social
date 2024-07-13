import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";

import React from "react";
import StoryList from "./feed/StoryList";

const Stories = async () => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) {
    return null;
  }
  const following = await prisma.follower.findMany({
    where: {
      followerId: currentUserId
    },
    select: {
      followingId: true,

    }

  })
  const followingsIds = following.map(f => f.followingId)
 

  const stories = await prisma.stories.findMany({
    where: {
      expiresAt: {
        gt: new Date(),

      },
      userId: {
        in: [...followingsIds,currentUserId]
      }
    },


    //   OR: [
    //     {
    //       user: {
    //         followers: {
    //           some: {
    //            followerId : currentUserId,
    //           },
    //         },
    //       },
    //     },
    //     { userId: currentUserId },
    //   ],
    // },
    include: {
      user: {
        select:
        {
          avatar: true,
          name: true,
          username: true
        }
      }
    }
  });



  return (
    <div className="p-4 bg-white rounded-lg shadow-md overflow-scroll text-xs scrollbar-hide">
      <div className="flex gap-8 w-max">

        <StoryList stories={stories} />

      </div>
    </div>
  );
};

export default Stories;
