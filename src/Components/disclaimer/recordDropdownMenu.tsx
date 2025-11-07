"use client";
import React, { FC, useState } from 'react'
import { Button } from "@/Components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog"

import { UserType } from '@/Context'
import { Ellipsis, Save, Trash2 } from 'lucide-react'
import { certificateType } from './dataset'
import { DeleteRecord, RecordChangeStatus, RecordAddFile } from '@/Components';
import { objToSaveCertificate, setInfoCertificate,  } from '@/lib';
import { showToast } from 'nextjs-toast-notify';

interface MenuRecordProps {
    user: UserType,
    cert: certificateType,
    folio: string,
    idFolio: number,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
     setUpdate: React.Dispatch<React.SetStateAction<boolean>>
}

const RecordDropdownMenu: FC<MenuRecordProps> = ({user, cert, folio, idFolio, setLoading,  setUpdate}: MenuRecordProps) => {
    const [openDelete, setOpenDelete] = useState(false)
    const [openFile, setOpenFile] = useState(false)
    const [openStatus, setOpenStatus] = useState(false)



    const handleStatus = (folioToSave: objToSaveCertificate)=> {
        setLoading(true);
        user.getIdToken()
        .then(res => {            
            setInfoCertificate(folioToSave,res, (record, err) => {
                setLoading(false)
                if(!err && record){                    
                    showToast.success("¡La operación se realizó con éxito!", {
                                        duration: 4000,
                                        progress: true,
                                        position: "top-right",
                                        transition: "bounceIn",
                                        icon: '',
                                        sound: true,
                                    });
                    setUpdate(true);
                }else{
                    showToast.error("Hubo un error en la operacion", {
                            duration: 4000,
                            progress: true,
                            position: "top-right",
                            transition: "bounceIn",
                            icon: '',
                            sound: true,
                        });
                }
            }); 

        }).catch(err => {
            console.log(err);
            setLoading(false);
            showToast.error("Hubo un error en la operacion", {
                            duration: 4000,
                            progress: true,
                            position: "top-right",
                            transition: "bounceIn",
                            icon: '',
                            sound: true,
                        });
        })
    }


    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="bg-blue-rr font-bold cursor-pointer">
                        <Ellipsis />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                        <DropdownMenuItem className='cursor-pointer'  onClick={e => setOpenStatus(true)}>
                            Cambiar estatus
                        </DropdownMenuItem>
                        <DropdownMenuItem className='cursor-pointer' onClick={e => setOpenFile(true)}>
                            {
                                cert.url_file == "" ? "Agregar Archivo":"Ver Archivo"
                            }
                        </DropdownMenuItem>
                        <DropdownMenuItem className='cursor-pointer text-red-600 hover:text-red-800' onClick={e => setOpenDelete(true)}>
                            Eliminar Registro
                            <Trash2 color="#9f0712" strokeWidth={1} />
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <RecordAddFile setLoading={setLoading} open={openFile} onOpenChange={setOpenFile} user={user} cert={cert} folio={folio} idFolio={idFolio} handleStatus={handleStatus}/>
            <DeleteRecord open={openDelete} onOpenChange={setOpenDelete} user={user} cert={cert} folio={folio} idFolio={idFolio} handleStatus={handleStatus}/>
            <RecordChangeStatus open={openStatus} onOpenChange={setOpenStatus} user={user} cert={cert} folio={folio} idFolio={idFolio} handleStatus={handleStatus}/>

        </>

    )
}
export { RecordDropdownMenu }
