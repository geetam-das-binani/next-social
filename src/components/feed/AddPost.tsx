"use client";
import { useUser } from "@clerk/nextjs";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import { useActionState, useState } from "react";
import AddPostButton from "./AddPostButton";
import { addPost } from "@/lib/actions";

const AddPost = () => {
  const { user, isLoaded } = useUser();
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [_, formAction] = useActionState(addPost, desc);

  if (!isLoaded) {
    return (
      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
    );
  }

  const postAction = async () => {
    
    try {
      if (!desc) return;
      formAction({ desc,
         image: image || "", video: video || "" });
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setDesc("");
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      {/* AVATAR */}
      <Image
        src={user?.imageUrl ?? "/noAvatar.png"}
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      {/* POST */}
      <div className="flex-1 flex flex-col">
 

        <form action={postAction} className="flex relative">
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="What's on your mind?"
            className="flex-1 bg-slate-100 rounded-lg p-2"
            name="desc"
          ></textarea>

          <Image
            src="/emoji.png"
            alt=""
            width={20}
            height={20}
            className="w-5 h-5 cursor-pointer self-end"
          />

          <AddPostButton />
        </form>

        {/* POST OPTIONS */}
        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          <CldUploadWidget
            uploadPreset="social"
            onSuccess={(result, { widget }) => {
              const data = result?.info as CloudinaryUploadWidgetInfo;
              console.log(data);
              if (data) {
                data.resource_type === "video" ? setVideo(data?.secure_url || data?.url || "") : setImage(data?.secure_url || data?.url || "");
              }
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <button
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Image src="/addImage.png" alt="" width={20} height={20} />
                    Photo
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Image src="/addVideo.png" alt="" width={20} height={20} />
                    Video
                  </div>
                </button>
              );
            }}
          </CldUploadWidget>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/poll.png" alt="" width={20} height={20} />
            Poll
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/addevent.png" alt="" width={20} height={20} />
            Event
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
