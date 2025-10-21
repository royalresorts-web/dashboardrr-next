"use client";
import { useAuth, UserProyectsType, useUserConfig } from "@/Context";
import React from "react";
import Link from "next/link";
import { Button } from "@/Components/ui/button"
import { Input } from "@/components/ui/input"
import { CertificateRecords } from "@/Components";


export default function Page() {
    const { user, logout } = useAuth();
    const { userConfig, userProyects, errorConfig } = useUserConfig();

   
   
  return (
    <div className="w-full h-[calc(100vh-56px)] p-2 ">
        <div className="w-full h-auto py-1 items-center flex justify-center">
          <div className="flex w-full max-w-sm items-center gap-2">
            <Input type="email" placeholder="Id del Folio" className="bg-white" />
            <Button type="submit" variant="outline">
              Buscar
            </Button>
          </div>
        </div>
        {
          user && <CertificateRecords user={user} />
        }        
        
    </div>
  )
}