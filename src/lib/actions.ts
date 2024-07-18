"use server";

import { auth } from "@clerk/nextjs/server";
import * as z from "zod";
import prisma from "./client";
import { revalidatePath } from "next/cache";

export const switchFollow = async (userId: string) => {
  const { userId: receiverId } = auth();
  if (!receiverId) throw new Error("User not logged in");
  try {
    const existingFollowing = await prisma.follower.findFirst({
      where: {
        followingId: userId,
        followerId: receiverId,
      },
    });

    if (existingFollowing) {
      await prisma.follower.delete({
        where: {
          id: existingFollowing.id,
        },
      });
    } else {
      const existingFollowRequest = await prisma.followRequest.findFirst({
        where: {
          receiverId: userId,
          senderId: receiverId,
        },
      });
      if (existingFollowRequest) {
        await prisma.followRequest.delete({
          where: {
            id: existingFollowRequest.id,
          },
        });
      } else {
        await prisma.followRequest.create({
          data: {
            receiverId: userId,
            senderId: receiverId,
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

export const switchBlock = async (userId: string) => {
  const { userId: receiverId } = auth();
  if (!receiverId) throw new Error("User not logged in");
  try {
    const existingBlock = await prisma.block.findFirst({
      where: {
        blockedId: userId,
        blockerId: receiverId,
      },
    });
    if (existingBlock) {
      await prisma.block.delete({
        where: {
          id: existingBlock.id,
        },
      });
    } else {
      await prisma.block.create({
        data: {
          blockedId: userId,
          blockerId: receiverId,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

export const acceptFollowRequest = async (senderId: string) => {
  const { userId: receiverId } = auth();
  if (!receiverId) throw new Error("User not logged in");
  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        receiverId,
        senderId,
      },
    });
    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
    }
    await prisma.follower.create({
      data: {
        followerId: senderId,
        followingId: receiverId,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

export const declineRequest = async (senderId: string) => {
  const { userId: receiverId } = auth();
  if (!receiverId) throw new Error("User not logged in");
  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        receiverId,
        senderId,
      },
    });
    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

export const updateProfile = async (
  prevState: { success: boolean; error: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; error: boolean; message: string }> => {
  const { userId } = auth();
  if (!userId)
    return { success: false, error: true, message: "User not logged in" };
  const fields = Object.fromEntries(formData.entries());

  fields["cover"] = formData.get("cover") as string;

  const copyFields: { [key: string]: any } = { ...fields };

  const existingUser = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!existingUser)
    return { success: false, error: true, message: "User does not exists" };

  for (const key in copyFields) {
    if (copyFields[key] === undefined || copyFields[key] === "") {
      copyFields[key] = existingUser[key as keyof typeof existingUser];
    }
  }

  // or
  // const filteredFields = Object.fromEntries(
  //   Object.entries(fields).filter(
  //     (_, value) => value.toString() !== "" || value !== undefined
  //   )
  // );

  const Profile = z.object({
    cover: z.string().optional(),
    name: z.string().max(60).optional(),
    surname: z.string().max(60).optional(),
    description: z.string().max(255).optional(),
    city: z.string().max(60).optional(),
    school: z.string().max(60).optional(),
    work: z.string().max(60).optional(),
    website: z.string().max(60).optional(),
  });
  const validatedFields = Profile.safeParse(copyFields);
  if (!validatedFields.success) {
    const errors = validatedFields.error
      .format()
      ._errors.map((elem, idx) => elem)
      .join("");

    return { success: false, error: true, message: errors };
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: validatedFields.data,
    });

    revalidatePath("/profile/[username]");
    return { success: true, error: false, message: "Profile Updated" };
  } catch (error: any) {
    return { success: false, error: true, message: error.message };
  }
};

export const switchLike = async (postId: number) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) throw new Error("User not logged in");
  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId: currentUserId,
      },
    });
    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId: currentUserId,
        },
      });
    }
  } catch (error) {
    console.log(error);

    throw new Error("Something went wrong");
  }
};

export const addComment = async (postId: number, comment: string) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) throw new Error("User not logged in");
  try {
    const createdComment = await prisma.comment.create({
      data: {
        postId,
        userId: currentUserId,
        desc: comment,
      },
      include: {
        user: true,
        likes: true,
        replies: true,
      },
    });
    revalidatePath("/");
    return createdComment;
  } catch (error) {
    console.log(error);

    throw new Error("Something went wrong");
  }
};
export const addPost = async (
  prevState: string,
  payload: { desc: string; image: string; video: string }
): Promise<string> => {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  const { desc, image, video } = payload;

  const Desc = z.string().min(3).max(255);
  const validateDescription = Desc.safeParse(desc);

  if (!validateDescription.success) {
    throw new Error("Invalid description");
  }
  try {
    await prisma.post.create({
      data: {
        desc: validateDescription.data,
        userId,
        img: image,
        video,
      },
    });
    revalidatePath("/");
    return "true";
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

export const addStory = async (image: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");

  try {
    const Image = z.string();
    const validateImage = Image.safeParse(image);
    const existingStory = await prisma.stories.findFirst({
      where: { userId: userId },
    });
    if (existingStory) {
      await prisma.stories.delete({ where: { id: existingStory.id } });
    }
    const newStory = await prisma.stories.create({
      data: {
        userId,
        img: validateImage.data!,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        user: {
          select: {
            avatar: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return newStory;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};
export const deletePost = async (postId: number) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  try {
    const existingPost = await prisma.post.findFirst({
      where: {
        id: postId,
        userId,
      },
    });
    if (!existingPost) throw new Error("Post not found");
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    revalidatePath("/");
    return "true";
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

export const toggleLikeOnComment = async (commentId: number) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        commentId,
        userId,
      },
    });
    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.like.create({
        data: {
          commentId,
          userId,
        },
      });
    }
    revalidatePath("/");
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

export const deleteCommentOfUser = async (postId: number) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  try {
    const existingComment = await prisma.comment.findFirst({
      where: {
        postId,
        userId,
      },
    });
    if (existingComment) {
      await prisma.comment.delete({
        where: {
          id: existingComment.id,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};

export const rePost = async (
  prevState: { desc: string; image: string; video: string },
  payload: { desc: string; image: string; video: string }
): Promise<{ desc: string; image: string; video: string }> => {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  const { desc, image, video } = payload;

  try {
    const response = await prisma.post.create({
      data: {
        desc,
        userId,
        img: image,
        video,
      },
    });
    revalidatePath("/");
    return {
      desc: response.desc,
      image: response.img ?? "",
      video: response.video ?? "",
    };
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

export const addReplyOnComment = async (commentId: number, desc: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");
  try {
    const newReplyOnComment = await prisma.reply.create({
      data: {
        commentId,
       
        desc,
      },
    });
    return newReplyOnComment;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
