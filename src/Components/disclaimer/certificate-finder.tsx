"use client";

import { UserType } from "@/Context";
import { fetchCertificateByFolio, folioDisclaimerType } from "@/lib";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface CertificateFinderProps {
    user: UserType
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}
const CertificateFinder: React.FC<CertificateFinderProps> = ({ user, setLoading }: CertificateFinderProps) => {
    const [cert, setCert] = useState<folioDisclaimerType | null>(null);
    const [folio, setFolio] = useState<string>("");

    const handleFindFolio = () => {
        if(folio.length !== 0){
            setLoading(true)
            user.getIdToken()
            .then(res => {
                fetchCertificateByFolio(folio, res, (record, err) => {
                    setCert(record)
                    setLoading(false)
                });
            });
        }
    }

    return (
        <>
            <div className="w-full h-auto py-1 items-center flex justify-center">
                <div className="flex w-full max-w-sm items-center gap-2">
                    <Input type="email" placeholder="Id del Folio" value={folio} onChange={(e) => setFolio(e.target.value)} className="bg-white" />
                    <Button onClick={(e) => handleFindFolio()} variant="outline" >
                        Buscar
                    </Button>
                </div>
            </div>
            <div className="w-full 3xl:max-w-[1900px] max-w-full mx-auto p-2">
                <div className="records flex flex-col justify-center gap-[11px] px-2">
                    ss{cert && cert.Id}
                </div>
            </div>
        </>

    )
}

export { CertificateFinder } 