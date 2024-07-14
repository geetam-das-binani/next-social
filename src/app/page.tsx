import AddPost from "@/components/feed/AddPost";
import Feed from "@/components/feed/Feed";
import Stories from "@/components/feed/Stories";
import LeftMenu from "@/components/leftmenu/LeftMenu";
import RightMenu from "@/components/rightmenu/RightMenu";


const Homepage = () => {
  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="home" />
      </div>
      <div className="lg:w-[70%] w-full xl:w-[50%]">
        <div className="flex gap-6 flex-col">
          <Stories />
          <AddPost />
          <Feed />
        </div>
      </div>
      <div className="hidden lg:block w-[30%]">
        <RightMenu />
      </div>
    </div>
  );
};

export default Homepage;
