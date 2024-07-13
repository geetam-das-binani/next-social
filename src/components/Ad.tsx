import Image from "next/image";
import React from "react";

const Ad = ({ size }: { size: "sm" | "md" | "lg" }) => {
  return (
    <div className="p-4 bg-white shadow-md text-sm rounded-lg">
      {/* top  */}

      <div className="flex items-center justify-between text-gray-500 font-medium">
        <span>Sponsor Ads...</span>
        <Image src="/more.png" alt="" width={16} height={16} />
      </div>
      {/* bottom  */}
      <div
        className={`flex flex-col mt-4 ${size === 
          "sm" ? "gap-2" : "gap-4"}`}
      >
        <div
          className={`relative w-full ${
            size === "sm" ? "h-24" : size === "md" ? "h-36" : "h-48"
          }`}
        >
          <Image
            src="https://images.unsplash.com/photo-1639020715359-f03b05835829?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dW5zcGFsc2h8ZW58MHx8MHx8fDA%3D"
            alt=""
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex items-center justify-center gap-4">
          <Image
            src="https://images.unsplash.com/photo-1639020715359-f03b05835829?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dW5zcGFsc2h8ZW58MHx8MHx8fDA%3D"
            alt=""
            width={24}
            height={24}
            className="object-cover rounded-full w-6 h-6"
          />
          <span className="text-blue-600 font-medium">BigChef Lounge</span>
        </div>
        <p className={`${size === "sm" ? "text-xs" : "text-sm"}`}>
          {size === "sm"
            ? "jajsnas"
            : size === "md"
            ? " Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur voluptatibus aliquid iure veniam! Quis magnam tempore eligendi numquam reiciendis excepturi.s"
            : "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita corrupti sit eos! Omnis aperiam consequatur facilis expedita aliquam assumenda suscipit perferendis cum accusamus vitae. Alias quidem quis mollitia eum? Earum est vitae, libero adipisci reiciendis similique deserunt doloremque totam quam corporis iste incidunt, reprehenderit voluptates velit tenetur dolorem recusandae eligendi?"}
        </p>
        <button className="bg-gray-200 text-gray-500 p-2 text-xs rounded-lg">Learn More</button>
      </div>
    </div>
  );
};

export default Ad;
