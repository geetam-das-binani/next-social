import prisma from "@/lib/client";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const UserMediaCard = async ({ user }: { user: User }) => {
  const postsMedia = await prisma.post.findMany({
    where: { userId: user.id },
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log(postsMedia);
  

  const postsWithImages = postsMedia.map(post=>{
    if(post.img) return post
    else return null
  }).filter(Boolean)
  
  

  return (
    <div className="flex flex-col gap-4 p-4 bg-white shadow-md text-sm rounded-lg">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User Media</span>
        <Link href={"/"} className="text-blue-600 text-xs">
          See all
        </Link>
      </div>
      {/* bottom  */}
      <div className="flex gap-4 justify-between flex-wrap">
        {postsWithImages.length > 0
          ? postsWithImages.map((post) => (
            <div key={post?.id} className="flex flex-col gap-2">
              <Image
                src={post?.img ?? ""}
                alt="post image"
                width={100}
                height={100}
                className="w-20 h-20 object-cover rounded-md"
              />
            </div>
          ))
          : "No Media Found!"}
      </div>
    </div>
  );
};

export default UserMediaCard;
