"use client";
import { useAuth } from "@/Context/AuthContext"; // Ajusta la ruta
import { CircleUser } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";

function UserSection() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="relative">
      <div className="avatar-info w-[40px] h-[40px] cursor-pointer" onClick={() => setOpen(!open)}>
        {user && user.photoURL && <Image className="rounded-full" width={40} height={40} alt="Avatar" src={user.photoURL} />}
        {!user && <CircleUser size={40} />}
      </div>
      {
        open && (<div className="w-[250px] h-auto absolute top-[100%] right-0 bg-white p-2 rounded flex flex-col justify-start items-center gap-2 shadow-md">
          {
            user?.email && <h2 className="text-blue-rr">{user.email}</h2>
          }
          {
            user?.displayName && <h3 className="text-gray-700 font-bold">{user.displayName}</h3>
          }
          <Button onClick={logout} size="lg" variant="outline" className='bg-white rounded py-2 flex justify-center items-center cursor-pointer'>
            <span className='text-black'>Log Out</span>
          </Button>
        </div>)
      }
    </div>
  );
}
export { UserSection }