"use client";
import { updateProfile } from "@/lib/actions";
import { User } from "@prisma/client";
import Image from "next/image";
import {useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useFormState } from "react-dom";
import UpdateButton from "./rightmenu/UpdateButton";
const UpdateUser = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cover, setCover] = useState<any>("");

  const [state, formAction] = useFormState(updateProfile, {
    success: false,
    error: false,
    message:""
   
  });

 
  
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-500 cursor-pointer text-xs"
      >
        Update
      </button>
      {isOpen && (
        <div className=" absolute left-0 
        top-0 z-50 flex items-center justify-center
         w-screen h-screen bg-black bg-opacity-65">
          <form
            action={(formData) => {
              formData.append("cover", cover?.secure_url || "");
              try {
                formAction(formData);

                // handleClose()
              } catch (error: any) {
                console.log(error.message);
              }
            }}
            className="relative p-12
             bg-white rounded-lg shadow-md flex flex-col
              gap-2 w-full  md:w-1/2  xl:w-1/3"
          >
            {/* title  */}
            <h1>Update Profile</h1>
            <div className="text-xs text-gray-500 mt-4">
              Use the navbar profile to change the avatar or the 
              username
            </div>
            {/* cover picture upload  */}

            <CldUploadWidget
              uploadPreset="social"
              onSuccess={(result) => setCover(result?.info)}
            >
              {({ open }) => {
                return (
                  <button
                    onClick={() => open()}
                    className="flex flex-col gap-2 my-4"
                  >
                    <label htmlFor="cover">Cover Picture</label>
                    <div
                      id="cover"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          alt=""
                          width={48}
                          height={48}
                          className="w-12 h-8 rounded-md object-cover"
                          src={user?.cover ?? "/noCover.png"}
                        />
                        <span className="underline text-xs text-gray-600">
                          Change
                        </span>
                      </div>
                    </div>
                  </button>
                );
              }}
            </CldUploadWidget>

            {/* wrapper for inputs  */}
            <div className="grid grid-cols-2 relative gap-2 xl:gap-3">
              {/* INPUT */}
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-xs text-gray-500">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder={user.name ?? "John"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="name"
                  id="firstName"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="surname" className="text-xs text-gray-500">
                  Surname
                </label>
                <input
                  type="text"
                  placeholder={user.surname ?? "Doe"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="surname"
                  id="surname"
                />
              </div>
              {/* INPUT */}
              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-xs text-gray-500">
                  Description
                </label>
                <input
                  type="text"
                  placeholder={user.description ?? "Life is beautiful..."}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="description"
                  id="description"
                />
              </div>
              {/* INPUT */}
              <div className="flex flex-col gap-2">
                <label htmlFor="city" className="text-xs text-gray-500">
                  City
                </label>
                <input
                  type="text"
                  placeholder={user.city ?? "New York"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="city"
                  id="city"
                />
              </div>
              {/* INPUT */}
              <div className="flex flex-col gap-2">
                <label htmlFor="school" className="text-xs text-gray-500">
                  School
                </label>
                <input
                  type="text"
                  placeholder={user.school ?? "MIT"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md
                   text-sm"
                  name="school"
                  id="school"
                />
              </div>
              {/* INPUT */}
              <div className="flex flex-col gap-2">
                <label htmlFor="work" className="text-xs text-gray-500">
                  Work
                </label>
                <input
                  type="text"
                  placeholder={user.work ?? "Apple Inc."}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="work"
                  id="work"
                />
              </div>
              {/* INPUT */}
              <div className="flex flex-col gap-2">
                <label htmlFor="website" className="text-xs text-gray-500">
                  Website
                </label>
                <input
                  type="text"
                  placeholder={user.website ?? "lama.dev"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="website"
                  id="website"
                />
              </div>
             <UpdateButton/>
            </div>

            <button
              onClick={() => {
                handleClose();
              }}
              className="absolute text-lg right-2 top-3 cursor-pointer"
            >
              X
            </button>
            {state.success && (
              <span className="text-green-500 absolute top-[5%]">
               {
                state?.message
               }
              </span>
            )}
            {state.error && (
              <span className="text-red-500 absolute top-[5%]">{state?.message || "Something went wrong"}</span>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateUser;
