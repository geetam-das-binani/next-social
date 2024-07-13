import prisma from "@/lib/client";
import Posts from "./Posts";
import { auth } from "@clerk/nextjs/server";
import { PostType } from "@/types/types";



const Feed = async ({ username }: { username?: string }) => {
  const { userId } = auth();
  let posts: PostType[]=[];

  if (username) {
    
   
    posts = await prisma.post.findMany({
      where: {
      user: {
      username
    }
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            comments: true

          }
        },


      },
      orderBy:
      {
        createdAt: "desc"
      }
    })
  }
  if (!username && userId) {
    const following = await prisma.follower.findMany({
      where: {
        followerId: userId
      },
      select: {
        followingId: true,

      }

    })
    const followingsIds = following.map(f => f.followingId)
    followingsIds.push(userId)

    posts = await prisma.post.findMany({
      where: {
        userId: {
          in: followingsIds
        }
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            comments: true

          }
        },


      },
      orderBy:
      {
        createdAt: "desc"
      }
    })


  }


  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-12">
     { !posts?.length ? "No Posts Found":(
      posts.map((post) => (
        <Posts key={post.id} post={post} />
      ))
     )}
    </div>
  );
};

export default Feed;
