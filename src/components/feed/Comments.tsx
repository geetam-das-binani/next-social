import prisma from "@/lib/client";
import CommentsLists from "./CommentsLists";

const Comments = async ({ postId }: { postId: number }) => {
  const allComments = await prisma.comment.findMany({
    where: {
      postId,
    },
    include: {
      user: true,
      likes:true
    },
  });

  
  
  return (
    <div className="">
      {/*write comments interaction */}

      <CommentsLists comments={allComments} postId={postId} />
    </div>
  );
};

export default Comments;
