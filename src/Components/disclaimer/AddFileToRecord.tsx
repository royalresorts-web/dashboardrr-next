"use client"
import { UserType } from '@/Context'
import React, { FC } from 'react'
import { certificateType } from './dataset'
import PDF from "../../img/pdf-svg.svg"

import { Button } from '../ui/button'
import { Copy, Trash } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogHeader } from '../ui/dialog'
import { objToSaveCertificate } from '@/lib'
import {LoadFileRecord} from '@/Components'
import Image from 'next/image'
import { showToast } from 'nextjs-toast-notify'

interface ShareData {
    title?: string;
    text?: string;
    url?: string;
}

type ModernNavigator = Navigator & {
    share?: (data: ShareData) => Promise<void>;
};


interface RecordAddFileProps {
    user: UserType,
    cert: certificateType,
    folio: string,
    idFolio: number,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    handleStatus: (objToUpdate: objToSaveCertificate) => void,
    open: boolean,
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

export const RecordAddFile: FC<RecordAddFileProps> = ({ user, cert, handleStatus, open, onOpenChange, setLoading}: RecordAddFileProps) => {

    const showFile = (file: string) => {
        const w = 600;
        const h = 800;
        if (typeof window === 'undefined' || !window.top) {
            // Safety check: Don't run if window/top window is unavailable
            console.error("Window object or top window not available for centering.");
            return;
        }
        if(window){
            const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
            const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);
            window.open(file, `certificate-${cert.folio}-${cert.email}`, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + y + ', left=' + x);
        }
    }
    const handleShareOrCopy = async (
        url: string,
        record: certificateType
    ) => {
        // Use the extended Navigator type
        const nav = navigator as ModernNavigator;
        const shareData: ShareData = {
            title: "Certificates",
            text: "Royal Resorts",
            url: url,
        };
        try {
            // 2. Try Modern Share API (Mobile)
            if (nav.share) {
                await nav.share(shareData);
                // Share was successful (or at least the dialog opened)
                return;
            }

            // 3. Try Modern Clipboard API (Desktop/Secure Contexts)
            // We can now safely check clipboard.writeText
            if (nav.clipboard && nav.clipboard.writeText) {
                await nav.clipboard.writeText(url);
                showToast.success("Url Copiada !!!", {
                    duration: 4000,
                    progress: true,
                    position: "top-right",
                    transition: "bounceIn",
                    icon: '',
                    sound: true,
                });
                return;
            }

            // 4. Fallback to Legacy 'execCommand' (Your Original Method)
            const el = document.createElement("textarea");
            el.value = url; // Use .value for textareas, not textContent
            el.setAttribute("readonly", ""); // Set readonly attribute
            el.style.position = "absolute";
            el.style.left = "-9999px"; // Move it off-screen
            el.classList.add(`copy-${record.folio}`); // Add class just in case
            document.body.appendChild(el);
            
            el.select(); // Select the text
            const success = document.execCommand("copy"); // Execute the copy
            
            document.body.removeChild(el); // IMPORTANT: Clean up the DOM

            if (success) {
                showToast.success("Url Copiada !!!", {
                    duration: 4000,
                    progress: true,
                    position: "top-right",
                    transition: "bounceIn",
                    icon: '',
                    sound: true,
                });
            } else {
                showToast.error("Hubo un error al intentar copiar la url", {
                    duration: 4000,
                    progress: true,
                    position: "top-right",
                    transition: "bounceIn",
                    icon: '',
                    sound: true,
                });
            }

        } catch (err) {
            // Handle errors from navigator.share (e.g., user cancelled)
            // or navigator.clipboard.writeText (e.g., permissions denied)
            
            // Don't show an error if the user just cancelled the share dialog
            // Check if err is an Error object before accessing .name
            if (err instanceof Error && err.name !== 'AbortError') {
                showToast.error("Error: " + err.message, {
                    duration: 4000,
                    progress: true,
                    position: "top-right",
                    transition: "bounceIn",
                    icon: '',
                    sound: true,
                });
            } else if (!(err instanceof Error)) {
                // Handle non-Error throws, just in case
                showToast.error("Error Inesperado", {
                    duration: 4000,
                    progress: true,
                    position: "top-right",
                    transition: "bounceIn",
                    icon: '',
                    sound: true,
                });
            }
        }
    }
    function shareUrl(): void {
        handleShareOrCopy(cert.url_file, cert)
    }
    function deleteFile(): void {
        const folioToSave: objToSaveCertificate = {
            action: "file",
            folio: cert.folio,
            status: null,
            fecha: null,
            fecha_enviado: null,
            user: null,
            url_file: "",
            id: null,
            name: null,
            last_name: null,
            email: null,
            email_user: null
        }
        handleStatus(folioToSave)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='text-blue-rr flex flex-row justify-between items-center gap-2 pt-3'>
                        <span>{cert.folio}</span>
                        <span>{cert.email}</span>
                    </DialogTitle>
                </DialogHeader>
                <div className='w-full flex flex-col gap-2'>
                    <div className="information flex flex-row justify-between items-center gap-2">
                        <div className="folio w-full text-start">
                            {cert.name} {cert.last_name}
                        </div>
                        <div className="email w-full text-end">
                            {cert.fecha_enviado}
                        </div>
                    </div>               
                    {cert.url_file == "" ? (
                        <LoadFileRecord setLoading={setLoading} user={user} cert={cert} folio={cert.folio} idFolio={cert.id} handleStatus={handleStatus} />
                    ): 
                    (
                        <div className='w-full py-4'>
                            <h3 className='font-bold text-blue-rr'>Hay un archivo cargado para este registro</h3>
                            <Image onClick={e=> {console.log(e); showFile(cert.url_file)} } src={PDF} width={40} className='mt-3 cursor-pointer' height={40} alt='PDF File' />
                            <div className='w-full flex justify-start items-center py-4 gap-3'>
                                <Trash onClick={deleteFile} strokeWidth={2.5} size={30} className='text-red-800 cursor-pointer' />
                                <Copy onClick={shareUrl} strokeWidth={2.5} size={30} color='#00467f' className='cursor-pointer'/>
                            </div>
                        </div>
                    )}


                </div>
                <DialogFooter>
                    <Button variant="outline" className=' cursor-pointer ' onClick={() => {onOpenChange(false) }}>Cancelar</Button>
                    <Button onClick={() => onOpenChange(false)} variant="outline" className='text-blue-rr cursor-pointer hover:text-blue-rr'>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
