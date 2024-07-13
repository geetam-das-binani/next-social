import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import FriendRequestsList from "./FriendRequestsList";

const FriendRequests = async () => {
  const { userId } = auth();
  if (!userId) return null;

  const requests = await prisma.followRequest.findMany({
    where: {
      receiverId: userId,
    },
    include: {
      sender: true
    },
    orderBy:{
      createdAt:"desc"
    }

  });
  if(!requests.length) return null

  return (
    <div className="flex flex-col gap-4 p-4 bg-white shadow-md text-sm rounded-lg">
      {/* top */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Friend Requests</span>
        <Link href={"/"} className="text-blue-600 text-xs">
          See all
        </Link>
      </div>
      {/* bottom  */}
      {/* user */}
      <FriendRequestsList requests={requests} />


    </div>
  );
};

export default FriendRequests;
