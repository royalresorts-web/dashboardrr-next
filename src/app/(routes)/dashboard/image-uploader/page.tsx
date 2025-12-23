"use client";
import { useAuth, UserProyectsType } from "@/Context";
import React, { useState } from "react";
import dynamic from 'next/dynamic';
import { useUserConfig } from "@/Context";
import { Imageuploader } from "@/Components";

export type filter = {
  folio: string | null,
  user: string | null,
  state: "TODOS" | "ACEPTADO" | "ENVIADO", 
  page: number | 1
}
const LoadingDisclaimer = dynamic(() => import('@/Components/disclaimer/loaderCertificates').then((mod) => mod.LoadingDisclaimer),{
  // Optional: Show a loading message while the component chunk is fetched
  ssr: false, // This is the key
  loading: () => <p>...</p>,
});



export default function Page() {
  const { user, logout} = useAuth();
  const [disclaimerLoading, setDisclaimerLoading] = useState(false);
  const { userProyects } = useUserConfig();
    const [proyect, setProyect] = useState<string>("1");
  console.log(proyect);

  const renderProyects = () => {
    if (!userProyects?.length) return [];
    const selectOptions: React.ReactElement[] = [];
    const uniqueItemsMap = new Map();
    userProyects.forEach(item => {
        const key = `${item.ID}-${item.Name}`;
        if (!uniqueItemsMap.has(key)) {
            uniqueItemsMap.set(key, item);
        }
    });
    const filteredArray = Array.from(uniqueItemsMap.values());
    filteredArray.forEach((proyect) => {
      selectOptions.push(
        <option key={proyect.ID + "-" + Date.now()} value={proyect.ID as string}>
          {proyect.Name}
        </option>
      );
    });
    return selectOptions;
  };
  
  return (
    <>
     <LoadingDisclaimer disclaimerLoading={disclaimerLoading} />  
      <div className="w-full h-[calc(100vh-56px)] p-2 ">
        <div className="actions p-2 w-full flex justify-end items-end bg-blue-rr text-white">
          <div className="proyectSelector">
            <span>Proyecto</span>
            <select
              className="text-blue-rr bg-white ms-2 border rounded text-[16px]"
              onChange={(e) =>{              
                const proyect: UserProyectsType | undefined = userProyects?.filter(
                  (p) => p.ID === e.target.value
                )[0]
                if(proyect){
                  setProyect(e.target.value);
                }
              }              
              }
              name="proyect"
              id="proyect"
            >
              {renderProyects()}
            </select>
          </div>
        </div>
        {
          user ?  <Imageuploader user={user} logout={logout} setLoading={setDisclaimerLoading} proyect={proyect} /> : ""
        }  
      </div>
    </>
  )
}