"use client";

import { UserType } from "@/Context";
import React, { useEffect, useState } from "react";
import { certificateType } from "./dataset";
import { fetchCertificates } from "@/lib";

interface CertificateRecordProps {
    user: UserType 
}
type pagesInfo = {
    pages: number | 0,
    page: number | 1
    total: number | 0
}


const CertificateRecords: React.FC<CertificateRecordProps> = ({user}: CertificateRecordProps) => {
    const [certificates, setCertificates] = useState<certificateType[]>([]);
    const [pagesInfo, setPagesInfo] = useState<pagesInfo>({pages: 0, page: 0, total: 0});
    const [update, setUpdate] = useState<boolean>(true);
   

    useEffect(() => {
        if(update){
            user.getIdToken()
            .then(res => {
                   fetchCertificates(res,pagesInfo.page, (cert)=>{
                       setCertificates(cert.certificates);
                       setPagesInfo({ pages: cert.pages, page: cert.page, total: cert.total})
                   },
                   (err) => {
                        console.log(err);                    
                   })
                   setUpdate(false);
            });
            setUpdate(false);
        }      
    }, [update, user]);    

    const renderRecords = () => {
        return certificates.map((certificate, index) => {
            return (
                <div key={index} className="w-full flex items-center rounded bg-white p-1 text-[16px]">
                    <div className="space flex-1 flex justify-center items-center">{certificate.folio}</div>
                    <div className="space flex-2 flex justify-center items-center">{certificate.email}</div>
                    <div className="space flex-1 flex justify-center items-center">{`${certificate.last_name}`}</div>
                    <div className="space flex-2 flex justify-center items-center">{certificate.name}</div>
                    <div className="space flex-1 flex justify-center items-center uppercase p-1">
                        <span className={`p-2 rounded text-xs text-white font-bold ${certificate.status == "ACEPTADO" ? "bg-green-700" : "bg-red-500"}`}>
                            {certificate.status}
                        </span>
                        
                    </div>
                    <div className="space flex-2 flex justify-center items-center">{certificate.fecha}</div>
                    <div className="space flex-1 flex justify-center items-center">...</div>
                </div>
            )
        });
    }
   
  return (
    <div className="w-full 3xl:max-w-[1900px] max-w-full mx-auto p-2">        
        records
        <div className="records flex flex-col justify-center gap-2 px-2">
            {renderRecords()}
        </div>
       
    </div>
  )
}

export {CertificateRecords}