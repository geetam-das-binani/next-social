import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const ProfileCard = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      _count: {
        select: {
          followers: true,
        },
      },
    },
  });
  if (!user) {
    return null;
  }


  
  return (
    <div className="flex flex-col gap-6 p-4 bg-white shadow-md text-sm rounded-lg">
      <div className="h-20 relative">
        <Image
          fill
          alt=""
          src={user.cover ?? "/noCover.png"}
         
          className="rounded-md object-cover"
        />
        <Image
          alt=""
          src={user.avatar ?? "/noAvatar.png"}
          width={48}
          height={48}
          className="w-12 h-12 absolute left-0 right-0 m-auto
          
          -bottom-6  rounded-full ring-white z-10 object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 items-center h-20">
        <span className="font-semibold">{(user.name && user.surname) ? user.name + " " + user.surname : user?.username}</span>
        <div className="flex items-center gap-4">
          <div className="flex">
            {" "}
            <Image
              alt=""
              src="https://images.unsplash.com/photo-1611343693811-2c235c683f26?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHVuc3BhbHNofGVufDB8fDB8fHww"
              width={12}
              height={12}
              className="w-3 h-3 rounded-full object-cover "
            />
            <Image
              alt=""
              src="https://images.unsplash.com/photo-1611343693811-2c235c683f26?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHVuc3BhbHNofGVufDB8fDB8fHww"
              width={12}
              height={12}
              className="w-3 h-3 rounded-full object-cover "
            />{" "}
            <Image
              alt=""
              src="https://images.unsplash.com/photo-1611343693811-2c235c683f26?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHVuc3BhbHNofGVufDB8fDB8fHww"
              width={12}
              height={12}
              className="w-3 h-3 rounded-full object-cover "
            />
          </div>
          <span className="text-xs text-gray-500">
            {user._count.followers} Followers
          </span>
        </div>
        <Link href={`/profile/${user?.username}`} className="bg-blue-600 text-white text-sm p-2 rounded-md">
          My Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
