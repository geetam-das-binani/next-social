import Feed from "@/components/feed/Feed";
import LeftMenu from "@/components/leftmenu/LeftMenu";
import RightMenu from "@/components/rightmenu/RightMenu";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";

const page = async ({
  params,
}: {
  params: {
    username: string;
  };
}) => {
  const { userId: currentUserId } = auth();
  const user = await prisma.user.findFirst({
    where: {
      username: params.username,
    },
    include: {
      _count: {
        select: {
          posts: true,
          followers: true,
          followings: true,
        },
      },
    },
  });

  
  if (!user || !currentUserId) {
    return notFound();
  }
  let isBlocked;

  const res = await prisma.block.findFirst({
    where: {
      blockerId: user.id,
      blockedId: currentUserId,
    },
  });
  if (res) isBlocked = true;
  else isBlocked = false;

  if (isBlocked) {
    return notFound();
  }
  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="profile" />
      </div>
      <div className="lg:w-[70%] w-full xl:w-[50%] p-4">
        <div className="flex gap-6 flex-col">
          <div className="flex flex-col p-4 bg-white rounded-md shadow-md  items-center justify-center">
            <div className="w-full h-64 relative">
              <Image
                alt=""
                src={
                 user?.cover ??"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                }
                fill
                className="object-cover rounded-md"
              />
              <Image
                alt=""
                src={user?.avatar ?? "/noAvatar.png"}
                width={128}
                height={128}
                className="w-32 h-32 absolute left-0 right-0 m-auto
            -bottom-16  rounded-full ring-white text-white z-10 object-cover"
              />
            </div>
            <h1 className="mt-20 mb-4 text-2xl font-medium">
            {(user.name && user.surname) ? user.name + " " + user.surname : user?.username}
            </h1>
            <div className="flex justify-center items-center gap-12 mb-4">
              <div className="flex flex-col justify-center items-center ">
                <span className="font-medium">{user?._count.posts}</span>
                <span className="text-sm">Posts</span>
              </div>
              <div className="flex flex-col  justify-center items-center">
                <span className="font-medium">{user?._count.followers}</span>
                <span className="text-sm">Followers</span>
              </div>{" "}
              <div className="flex flex-col justify-center items-center ">
                <span className="font-medium">{user?._count.followings}</span>
                <span className="text-sm">Following</span>
              </div>
            </div>
          </div>
          <Feed  username={user.username}/>
        </div>
      </div>
      <div className="hidden lg:block w-[30%]">
        <RightMenu user={user} />
      </div>
    </div>
  );
};

export default page;
