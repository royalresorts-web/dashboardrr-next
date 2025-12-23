"use client";
import { useUserConfig } from "@/Context";
import React from "react";
import Link from "next/link";

export default function Page() {
    const { userConfig, errorConfig } = useUserConfig();
    
   
   let renderModules: React.ReactElement[] = [];
   
   if(userConfig){
    renderModules = userConfig.map((e,k) => {
      return (
        <Link key={k} href={"/dashboard" + e.Url!} className="duration-30 text-white ease-in-out hover:scale-105" >
          <div  className="rounded w-[300px] h-[200px] bg-white text-blue-rr shadow-sm flex flex-col justify-between cursor-pointer">
            <div className="flex justify-center items-center flex-1 p-2 font-bold text-md">
              {e.Description}
            </div>
            <div  className="flex justify-end items-center px-2 py-1 bg-blue-rr text-white ">
              Ver más
            </div>          
          </div>
        </Link>
      )
    }) 
   }
   
  return (
    <div className="w-full h-[calc(100vh-56px)] flex justify-start items-start gap-3 p-3 ">
      {errorConfig && (<div className="w-full h-[calc(100vh-56px)] flex justify-center items-center font-semibold text-blue-rr text-lg">{errorConfig}</div>)}

      {renderModules}
    </div>
  )
}