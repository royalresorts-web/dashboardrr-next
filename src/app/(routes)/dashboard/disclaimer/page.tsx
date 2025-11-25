"use client";
import { useAuth } from "@/Context";
import React, { useState } from "react";
import dynamic from 'next/dynamic';

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

const CertificateFinder = dynamic(() => import('@/Components/disclaimer/certificate-finder').then((mod) => mod.CertificateFinder),{
  // Optional: Show a loading message while the component chunk is fetched
  ssr: false, // This is the key
  loading: () => <p>...</p>,
});
const CertificateRecords = dynamic(() => import('@/Components/disclaimer/certificate-records').then((mod) => mod.CertificateRecords),{
  // Optional: Show a loading message while the component chunk is fetched
  ssr: false, // This is the key
  loading: () => <p>...</p>,
});

export default function Page() {
  const { user, logout} = useAuth();
  const [disclaimerLoading, setDisclaimerLoading] = useState(false);
  const [update, setUpdate] = useState<boolean>(true);
  const [filter, setFilter] = useState<filter>({folio: null, user: null, state: "TODOS", page: 1})

  return (
    <div className="w-full h-[calc(100vh-56px)] p-2 ">

      <LoadingDisclaimer disclaimerLoading={disclaimerLoading} />        
      {
        user && <CertificateFinder user={user} logout={logout} setLoading={setDisclaimerLoading} update={update} setUpdate={setUpdate}/>
      }
      {
        user && <CertificateRecords logout={logout} setFilter={setFilter} user={user} setLoading={setDisclaimerLoading} update={update} setUpdate={setUpdate} filter={filter} />
      }
    </div>
  )
}