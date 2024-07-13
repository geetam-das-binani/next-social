"use client"
import { deletePost } from "@/lib/actions";
import Image from "next/image";
import { useState } from "react";

const PostInfo = ({ userId, postId, isMyPost }: { userId: string; postId: number, isMyPost: boolean }) => {
    const [open, setOpen] = useState(false);
    const deletePostWithId = () => {


        if (isMyPost) deletePost.bind(null, postId)()
    }
    return (
        <div className="relative">
            <Image
                src={"/more.png"}
                width={16}
                height={16}
                alt=""
                className="w-10 h-10  rounded-full"
                onClick={() => setOpen(!open)}
            />
            {
                open && (
                    <div className="absolute top-4 right-0 w-40 bg-white  rounded-lg flex flex-col  shadow-md z-50 text-xs p-4 ">
                        <ul>
                            <li className="p-2 hover:bg-gray-100 cursor-pointer">View</li>
                            <li className="p-2 hover:bg-gray-100 cursor-pointer">Re-Post</li>
                        </ul>
                        {
                            isMyPost && (
                                <form className="flex items-center hover:bg-gray-300 p-2 rounded-lg" action={deletePostWithId}>
                                    <button className="text-red-600 text-xs">Delete</button>
                                </form>
                            )
                        }
                    </div>

                )
            }
        </div>
    )
}

export default PostInfo
