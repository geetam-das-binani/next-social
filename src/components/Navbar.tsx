import Link from "next/link";
import MobileMenu from "./MobileMenu";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton,ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center h-24">
      {/* left */}
      <div className="md:hidden lg:block block w-[20%]">
        <Link className="font-bold text-xl text-blue-600" href={"/"}>
          SOCIAL
        </Link>
      </div>

      {/* center  */}
      <div className="hidden md:flex w-[50%] text-sm items-center justify-between">
        {/* links  */}
        <div className="flex gap-6 text-gray-600">
          <Link href={"/"} className="flex gap-2 items-center">
            <Image
              src="/home.png"
              width={16}
              height={16}
              alt="homePage"
              className="w-4 h-4"
            />
            <span>Home</span>
          </Link>
          <Link href={"/"} className="flex gap-2 items-center">
            <Image
              src="/friends.png"
              width={16}
              height={16}
              alt="homePage"
              className="w-4 h-4"
            />
            <span>Friends</span>
          </Link>
          <Link href={"/"} className="flex gap-2 items-center">
            <Image
              src="/stories.png"
              width={16}
              height={16}
              alt="homePage"
              className="w-4 h-4"
            />
            <span>Stories</span>
          </Link>
        </div>
        <div className="hidden xl:flex p-2 bg-slate-100 rounded-xl">
          <input
            type="text"
            className="bg-transparent outline-none"
            placeholder="Search"
          />
          <Image src="/search.png" width={20} height={20} alt="search" />
        </div>
      </div>

      {/* right  */}
      <div className="w-[30%] flex items-center gap-4 xl:gap-8 justify-end">
        <ClerkLoading>
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <div className="cursor-pointer">
              <Image
                src="/people.png"
                width={24}
                height={24}
                alt="peopleImage"
              />
            </div>
            <div className="cursor-pointer">
              <Image
                src="/messages.png"
                width={20}
                height={20}
                alt="messagesImage"
              />
            </div>
            <div className="cursor-pointer">
              <Image
                src="/notifications.png"
                width={20}
                height={20}
                alt="notificationsImage"
              />
            </div>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-2 text-sm">
              <Image src="/login.png" width={20} height={20} alt="loginImage" />
              <Link href={"/sign-in"}>Login/Register</Link>
            </div>
          </SignedOut>
        </ClerkLoaded>
        <MobileMenu />
      </div>
    </div>
  );
};

export default Navbar;
