"use client";

import { Reply } from "@prisma/client";
import { Input } from "../ui/input";

const ReplyOnComment = ({ reply }: { reply: Reply }) => {
  return (
    <Input
      className="active:cursor-not-allowed active:outline-none active:border-none bg-gray-200 text-black"
      value={reply.desc}
      readOnly
    />
  );
};

export default ReplyOnComment;
