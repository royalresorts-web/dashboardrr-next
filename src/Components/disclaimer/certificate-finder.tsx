"use client";

import { UserType } from "@/Context";
import { fetchCertificateByFolio, folioDisclaimerType } from "@/lib";
import React, { use, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CertificateForm } from "./certificate-form";

interface CertificateFinderProps {
    user: UserType
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}
const CertificateFinder: React.FC<CertificateFinderProps> = ({ user, setLoading }: CertificateFinderProps) => {
    const [cert, setCert] = useState<folioDisclaimerType | null>(null);
    const [folio, setFolio] = useState<string>("");
    const [errorFolio, setError] = useState<string>("");

    
    const handleFindFolio = () => {
        if (folio.length !== 0) {
            setLoading(true)
            user.getIdToken()
                .then(res => {
                    console.log(res);                    
                    fetchCertificateByFolio(folio, res, (record, err) => {
                        setLoading(false)                        
                        if(err){
                            setError(err)
                            setCert(null)    
                        }else{
                            setCert(record)
                            setError("")
                        }
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
            <div className="w-full 3xl:max-w-[1700px] max-w-full mx-auto p-2 my-3">
                {cert ? <CertificateForm user={user} cert={cert} folio={folio} setLoading={setLoading} />: (
                    <div className="records flex flex-col justify-center items-center gap-[11px] px-2 w-full h-[200px]">
                        <span className='font-bold text-2xl text-blue-rr'>Agrege un folio válido en el buscador para continuar</span>
                        <span className='font-bold text-xl text-red-500'>{errorFolio}</span>
                    </div>
                )}                                
            </div>
        </>

    )
}

export { CertificateFinder } 