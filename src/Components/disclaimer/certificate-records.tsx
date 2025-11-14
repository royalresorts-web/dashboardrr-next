"use client";

import { UserType } from "@/Context";
import React, { useEffect, useState } from "react";
import { certificateType } from "./dataset";
import { fetchCertificates, getUrlForCertificatesExport } from "@/lib";
import { Pagination, RecordDropdownMenu } from "@/Components";
import { filter } from "@/app/(routes)/dashboard/disclaimer/page";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
    ButtonGroup
} from "@/Components/ui/button-group"
import { FileDown, Search } from "lucide-react";

interface CertificateRecordProps {
    user: UserType,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    update: boolean,
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>,
    filter: filter,
    setFilter: React.Dispatch<React.SetStateAction<filter>>
}
type pagesInfo = {
    pages: number | 0,
    page: number | 1
    total: number | 0
}


const CertificateRecords: React.FC<CertificateRecordProps> = ({ user, setLoading, update, setUpdate, filter, setFilter }: CertificateRecordProps) => {
    const [certificates, setCertificates] = useState<certificateType[]>([]);
    const [pagesInfo, setPagesInfo] = useState<pagesInfo>({ pages: 0, page: 0, total: 0 });


    useEffect(() => {
        if (update) {
            setLoading(true);
            user.getIdToken()
                .then(res => {
                    console.log(res);
                    fetchCertificates(res, filter.page, filter, (cert) => {
                        setCertificates(cert.certificates);
                        setPagesInfo({ pages: cert.pages, page: cert.page, total: cert.total })
                        setLoading(false);
                    },
                        (err) => {
                            console.log(err);
                            setLoading(false);
                        })
                    setUpdate(false);
                });
            setUpdate(false);
        }
    }, [update, user]);

    const navigationNext = (page: number) => {
        setFilter({ ...filter, page: page });
        setUpdate(true);
    }
    const downloadFile = async () => {
        const url = getUrlForCertificatesExport(filter);
        user.getIdToken()
            .then(async (res) => {
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${res}`,
                        },
                    });

                    // Handle bad responses (like 401 Unauthorized, 404, 500)
                    if (!response.ok) {
                        // Try to get more error info from the response body if possible
                        const errorText = await response.text();
                        throw new Error(`Error: ${response.status} ${response.statusText}. Server says: ${errorText}`);
                    }

                    // 1. Get the response data as a blob
                    const blob = await response.blob();

                    // 2. Create a temporary URL for the blob
                    const blobUrl = window.URL.createObjectURL(blob);

                    // 3. Create a temporary <a> element
                    const link = document.createElement('a');
                    link.href = blobUrl;

                    // 4. Set the download attribute with the desired filename
                    link.setAttribute('download', 'certificates.csv');

                    // 5. Append to body, click, and remove
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // 6. Clean up the blob URL
                    window.URL.revokeObjectURL(blobUrl);

                } catch (error) {
                    // Check if error is an instance of Error to access .message
                    if (error instanceof Error) {
                        console.error('Download failed:', error.message);
                    } else {
                        console.error('An unknown error occurred:', error);
                    }
                    // You could show an error message to the user here
                }
            });
    }

    const renderRecords = () => {
        return certificates.map((certificate, index) => {
            return (
                <div key={index} className="w-full flex items-center rounded bg-white  text-[16px] border">
                    <div className="space flex-1 flex justify-center items-center relative">
                        <span className="text-xs absolute px-1 rounded top-[-15px] left-1 bg-white">{certificate.email_user}</span>
                        <span className="text-blue-rr font-semibold">{certificate.folio}</span>
                    </div>
                    <div className="space flex-2 flex justify-center items-center">{certificate.email}</div>
                    <div className="space flex-1 flex justify-center items-center">{`${certificate.last_name}`}</div>
                    <div className="space flex-2 flex justify-center items-center">{certificate.name}</div>
                    <div className="space flex-1 flex justify-center items-center uppercase p-1">
                        <span className={`p-2 rounded text-xs text-white font-bold ${certificate.status == "ACEPTADO" ? "bg-green-700" : "bg-red-500"}`}>
                            {certificate.status}
                        </span>

                    </div>
                    <div className="space flex-2 flex justify-center items-center">{certificate.fecha}</div>
                    <div className="space flex-1 flex justify-center items-center">
                        <RecordDropdownMenu user={user} cert={certificate} folio={certificate.folio} idFolio={certificate.id} setLoading={setLoading} setUpdate={setUpdate} />
                    </div>

                </div>
            )
        });
    }
    const filters = ()=>{
        return (
            <div className="w-full flex flex-row justify-between ">
                <div className="flex items-center gap-2c">
                    <Button onClick={(e) => { downloadFile() }} variant="outline" className="cursor-pointer" >
                        <FileDown /> Exportar Filtro
                    </Button>
                </div>
                <div className="w-full flex flex-row justify-end items-end gap-2 p-2">

                    <div className="flex w-[300px] max-w-sm items-center gap-2">
                        <Input type="text" placeholder="Id del Folio" value={filter.folio || ""} onChange={(e) => { setFilter({ ...filter, page: 1, folio: e.target.value }); }} className="bg-white" />
                    </div>
                    <div className="flex w-[300px] max-w-sm items-center gap-2">
                        <Input type="email" placeholder="User Email" value={filter.user || ""} onChange={(e) => { setFilter({ ...filter, page: 1, user: e.target.value }) }} className="bg-white" />
                    </div>
                    <div className="flex w-[300px] max-w-sm items-center gap-2">
                        <ButtonGroup>
                            <Button onClick={e => setFilter({ ...filter, page: 1, state: "ACEPTADO" })} className="cursor-pointer" variant={`${filter.state == "ACEPTADO" ? "secondary" : "outline"}`}>ACEPTADOS</Button>
                            <Button onClick={e => setFilter({ ...filter, page: 1, state: "ENVIADO" })} className="cursor-pointer" variant={`${filter.state == "ENVIADO" ? "secondary" : "outline"}`}>ENVIADOS</Button>
                            <Button onClick={e => setFilter({ ...filter, page: 1, state: "TODOS" })} className="cursor-pointer" variant={`${filter.state == "TODOS" ? "secondary" : "outline"}`}>TODOS</Button>
                        </ButtonGroup>
                    </div>
                    <div className="flex w-[300px] max-w-sm justify-center items-center gap-2">
                        <Button onClick={(e) => { setUpdate(true) }} variant="outline" className="cursor-pointer" >
                            <Search /> Buscar
                        </Button>
                        <Button onClick={(e) => {
                            setFilter({ ...filter, page: 1, user: null, folio: null, state: "TODOS" })
                            setUpdate(true)
                        }
                        } variant="destructive" className="cursor-pointer" >
                            Clear
                        </Button>
                    </div>
                </div>
            </div>

        )
    }
    return (
        <div className="w-full 3xl:max-w-[1900px] max-w-full mx-auto p-2">
            {filters()}
            <Pagination totalPages={pagesInfo.pages} currentPage={pagesInfo.page} onPageChange={(page: number) => { navigationNext(page) }} />
            <div className="records flex flex-col justify-center gap-[11px] px-2 py-2">
                {renderRecords()}
            </div>
            <Pagination totalPages={pagesInfo.pages} currentPage={pagesInfo.page} onPageChange={(page: number) => { navigationNext(page) }} />
        </div>
    )
}

export { CertificateRecords }