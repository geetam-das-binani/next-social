"use client";

import { addStory } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { Stories } from "@prisma/client";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import { Fragment, useOptimistic, useState } from "react";

type StoryWithUser = Stories & {
  user: {
    avatar: string | null;
    name: string | null;
    username: string | null;
  };
};
type Data = {
  storyWithUser: StoryWithUser[];
  newStory: StoryWithUser;
};
const StoryList = ({ stories }: { stories: StoryWithUser[] }) => {
  const { user, isLoaded } = useUser();
  
  const [storyList, setStoryList] = useState(stories);
  const [image, setImage] = useState("");
  const [optimisticStories, setOptimisticStories] = useOptimistic(
    storyList,
    (_, value: Data) => [value.newStory, ...value.storyWithUser]
  );
  if (!isLoaded && !user)
    return (
      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
    );

  if (isLoaded && !user) return null;

  const storyAction = async () => {
    if (!image) return;
    const filteredStories = storyList.filter(
      (story) => story.userId !== user?.id
    );

    setOptimisticStories({
      newStory: {
        id: Math.floor(Math.random() * 1000),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        userId: user?.id ?? String(Math.floor(Math.random() * 1000)),
        user: {
          name: user?.firstName ?? "",

          username: user?.username ?? "",
          avatar: user?.imageUrl ?? "noAvatar.png",
        },
        img: image,
      },
      storyWithUser: filteredStories,
    });
    try {
      const newStory = await addStory(image);

      setStoryList((_) => [newStory, ...filteredStories]);
      setImage("");
    } catch (error: any) {
      setImage("");
      console.log(error.message);
    }
  };

 
  return (
    <Fragment>
      <CldUploadWidget
        uploadPreset="social"
        onSuccess={(result, { widget }) => {
          const data = result?.info as CloudinaryUploadWidgetInfo;
          setImage(data.secure_url || data.url || "");
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <Image
                src={(image || user?.imageUrl) ?? "/noAvatar.png"}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full ring-2 object-cover"
                alt="storyImage"
                onClick={() => open()}
              />
              {image ? (
                <form action={storyAction}>
                  <button className="text-xs  bg-blue-500 p-1 rounded-md text-white">
                    Send
                  </button>
                </form>
              ) : (
                <span className="font-medium">Add a story</span>
              )}
            </div>
          );
        }}
      </CldUploadWidget>
      {optimisticStories?.length > 0 &&
        optimisticStories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <Image
              src={story.img ?? "/noAvatar.png"}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full ring-2"
              alt="storyImage"
            />
            <span className="font-medium">
              {story.user.name ?? story.user.username}
            </span>
          </div>
        ))}
    </Fragment>
  );
};

export default StoryList;
