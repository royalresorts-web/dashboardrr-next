"use client";
import { useAuth, useUserConfig } from "@/Context";
import React, { useState } from "react";
import { CertificateFinder, CertificateRecords } from "@/Components";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/Components/ui/alert-dialog";
import Loader from "@/Components/loader";


export type filter = {
  folio: string | null,
  user: string | null,
  state: "TODOS" | "ACEPTADO" | "ENVIADO"
}

export default function Page() {
  const { user, logout } = useAuth();
  const { userConfig, userProyects, errorConfig } = useUserConfig();
  const [disclaimerLoading, setDisclaimerLoading] = useState(false);
  const [update, setUpdate] = useState<boolean>(true);
  const [filter, setFilter] = useState<filter>({folio: null, user: null, state: "TODOS"})


  return (
    <div className="w-full h-[calc(100vh-56px)] p-2 ">
      <AlertDialog open={disclaimerLoading}>
        <AlertDialogContent className="w-[200px] h-auto">
          <AlertDialogTitle className="hidden"></AlertDialogTitle>
          <Loader />
        </AlertDialogContent>
      </AlertDialog>
      {
        user && <CertificateFinder user={user} setLoading={setDisclaimerLoading} update={update} setUpdate={setUpdate}/>
      }
      {
        user && <CertificateRecords user={user} setLoading={setDisclaimerLoading} update={update} setUpdate={setUpdate} filter={filter} />
      }
    </div>
  )
}