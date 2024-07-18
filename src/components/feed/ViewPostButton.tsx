"use client";

import { PostType } from "@/types/types";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { getTypeOfVideo } from "@/utils/getVideoType";

const ViewPostButton = ({ post }: { post: PostType }) => {
  const formattedDate = post.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="flex  justify-center hover:bg-gray-100 p-2">
      <AlertDialog>
        <AlertDialogTrigger>View</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Post Details</AlertDialogTitle>
            <AlertDialogDescription>
              Description : {post.desc}
            </AlertDialogDescription>

            <AlertDialogDescription>
              <div className="flex flex-col gap-4">
                {post.img && (
                  <div className=" w-full min-h-96">
                    <Image
                      src={post.img}
                      fill
                      alt=""
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
                {post?.video && (
                  <video
                    controls
                    className="w-full h-96 object-cover rounded-md"
                  >
                    <source
                      src={post.video}
                      type={getTypeOfVideo(post.video)}
                    />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </AlertDialogDescription>
            <AlertDialogDescription>
              Created At : {formattedDate}
            </AlertDialogDescription>
            <AlertDialogDescription>
              Owner :{" "}
              {post.user.name && post.user.surname
                ? post.user.name + " " + post.user.surname
                : post.user?.username}
            </AlertDialogDescription>
            <AlertDialogDescription>
              <div className="flex gap-4">
                <span>Comments: {post._count.comments}</span>
                <span>Likes:{post.likes.length}</span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-red-500 text-white hover:bg-red-500 hover:text-white hover:transition
            ease-in-out duration-500" >
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ViewPostButton;
