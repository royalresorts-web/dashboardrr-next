"use client";
import { useAuth, useUserConfig } from "@/Context";
import React, { useState } from "react";
import { CertificateFinder, CertificateRecords } from "@/Components";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/Components/ui/alert-dialog";
import Loader from "@/Components/loader";



export default function Page() {
  const { user, logout } = useAuth();
  const { userConfig, userProyects, errorConfig } = useUserConfig();
  const [disclaimerLoading, setDisclaimerLoading] = useState(false);

  return (
    <div className="w-full h-[calc(100vh-56px)] p-2 ">
      <AlertDialog open={disclaimerLoading}>
        <AlertDialogContent className="w-[200px] h-auto">
          <AlertDialogTitle className="hidden"></AlertDialogTitle>
          <Loader />
        </AlertDialogContent>
      </AlertDialog>
      {
        user && <CertificateFinder user={user} setLoading={setDisclaimerLoading} />
      }
      {
        user && <CertificateRecords user={user} setLoading={setDisclaimerLoading}/>
      }
    </div>
  )
}