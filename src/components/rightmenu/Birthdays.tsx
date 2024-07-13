import Image from "next/image";
import Link from "next/link";

const Birthdays = () => {
  return (
    <div className="p-4 flex flex-col gap-4 bg-white shadow-md text-sm rounded-lg">
      <div className="flex  items-center font-medium">
        <span className="text-gray-500">Birthdays</span>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src={
              "https://images.unsplash.com/photo-1639020715359-f03b05835829?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dW5zcGFsc2h8ZW58MHx8MHx8fDA%3D"
            }
            className="w-10 h-10 rounded-full object-cover"
            alt=""
            width={40}
            height={40}
          />
          <span className="font-semibold">user</span>
        </div>
        <div className="">
          <button className="bg-blue-600 text-white px-2 py-1 rounded-md">
            Celebrate
          </button>
        </div>
      </div>
      {/* upcoming  */}
      <div className="p-4 
      flex items-center gap-4 bg-slate-100 rounded-lg">
        <Image src={"/gift.png"} alt="" width={24} height={24} />
        <Link href={"/"} className="flex flex-col gap-1 text-xs">
        <span className="text-gray-700 font-semibold">Upcomig Birthdays</span>
        <span className="text-gray-500">See other 16 have upcomg birthdays</span>
        </Link>
        
      </div>
    </div>
  );
};

export default Birthdays;
