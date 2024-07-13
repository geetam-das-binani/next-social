import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import UserInfoCardInteraction from "./UserInfoCardInteraction";
import UpdateUser from "@/components/UpdateUser";
const UserInfoCard = async ({ user }: { user: User }) => {
  const { userId: currentUserId } = auth();
  const createdAtDate = new Date(user?.createdAt);
  const formattedDate = createdAtDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  let isUserBlocked = false;
  let isFollowing = false;
  let isFollowingRequestSent = false;
  if (currentUserId) {
    const blockRes = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: user.id,
      },
    });
    blockRes ? (isUserBlocked = true) : (isUserBlocked = false);

    const followRes = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });
    followRes ? (isFollowing = true) : (isFollowing = false);

    const followReqRes = await prisma.followRequest.findFirst({
      where: {
        senderId: currentUserId,
        receiverId: user.id,
      },
    });
    followReqRes
      ? (isFollowingRequestSent = true)
      : (isFollowingRequestSent = false);
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-white shadow-md text-sm rounded-lg">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User Information</span>
       {currentUserId===user.id? (<UpdateUser user={user}/>):<Link href={"/"} className="text-blue-600 text-xs">
          See all
        </Link>}
      </div>
      {/* bottom  */}
      <div className="flex flex-col gap-4 text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-xl text-black">{user?.username}</span>
          <span className="text-sm">@{user?.username}</span>
        </div>
        {user.description && <p>{user.description}</p>}
        {user.city && (
          <div className="flex items-center gap-2">
            <Image
              alt=""
              src={"/map.png"}
              width={16}
              height={16}
              className="rounded-full"
            />
            <span>
              Living in <b>{user.city}</b>
            </span>
          </div>
        )}
        {user.school && (
          <div className="flex items-center gap-2">
            <Image
              alt=""
              src={"/school.png"}
              width={16}
              height={16}
              className="rounded-full"
            />
            <span>
              Went to <b>{user.school}</b>
            </span>
          </div>
        )}
        {user.work && (
          <div className="flex items-center gap-2">
            <Image
              alt=""
              src={"/work.png"}
              width={16}
              height={16}
              className="rounded-full"
            />
            <span>
              Works at <b>{user.work}</b>
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          {user.website && (
            <div className="flex gap-1 items-center">
              <Image alt="" src={"/link.png"} width={16} height={16} />
              <Link href={user.website} className="text-blue-500 font-medium">
                {user.website}
              </Link>
            </div>
          )}
          <div className="flex gap-1 items-center">
            <Image alt="" src={"/date.png"} width={16} height={16} />
            <span>{formattedDate}</span>
          </div>
        </div>
        {currentUserId !== user.id && (
          <UserInfoCardInteraction
            userId={user.id}
           
            isUserBlocked={isUserBlocked}
            isFollowing={isFollowing}
            isFollowingRequestSent={isFollowingRequestSent}
          />
        )}
      </div>
    </div>
  );
};

export default UserInfoCard;
