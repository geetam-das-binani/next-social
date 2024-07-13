import { Post, User,Comment } from "@prisma/client";

export type PostType = Post & { user: User } & {
  likes: { userId: string }[];
} & { _count: { comments: number } };

export type CommentType = Comment & {
  user: {
    username: string | null ;
    avatar: string | null;
    name:string | null;
    surname:string | null
  };
};
