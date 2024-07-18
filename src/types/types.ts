import { Post, User, Comment, Like, Reply } from "@prisma/client";

export type PostType = Post & { user: User } & {
  likes: { userId: string }[];
} & { _count: { comments: number } };

export type CommentType = Comment & {likes:Like[]} & {replies:Reply[]} & {
  user: {
    username: string | null;
    avatar: string | null;
    name: string | null;
    surname: string | null;
  };
};
