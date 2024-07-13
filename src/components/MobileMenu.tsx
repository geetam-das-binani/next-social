"use client";
import Link from "next/link";
import { useState } from "react";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="md:hidden">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex flex-col gap-[4.5] cursor-pointer"
      >
        <div
          className={`h-1 w-6 bg-blue-500 rounded-sm
        ${isOpen && "rotate-45 origin-left ease-in-out duration-500"}
        `}
        ></div>
        <div
          className={`h-1 w-6 bg-blue-500 rounded-sm
         ${isOpen && "opacity-0 ease-in-out duration-500"}
        `}
        ></div>
        <div
          className={`h-1 w-6 bg-blue-500 rounded-sm
         ${isOpen && "rotate-[-45deg] origin-left ease-in-out duration-500 "}
        `}
        ></div>
      </div>

      {isOpen && (
        <div className="absolute w-full top-24 left-0 z-20 h-[calc(100vh-96px)] bg-white flex flex-col items-center justify-center gap-8 text-xl font-medium">
          <Link href={"/"}>HomePage</Link>
          <Link href={"/"}>Friends</Link>
          <Link href={"/"}>Groups</Link>
          <Link href={"/"}>Stories</Link>
          <Link href={"/"}>Profile</Link>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
