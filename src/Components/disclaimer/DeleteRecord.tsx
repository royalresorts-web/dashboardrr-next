"use client"
import { UserType } from '@/Context'
import React, { FC } from 'react'
import { certificateType } from './dataset'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogHeader, DialogDescription } from '../ui/dialog'
import { objToSaveCertificate } from '@/lib'

interface DeleteRecordProps {
    user: UserType,
    cert: certificateType,
    folio: string,
    idFolio: number,
    handleStatus: (objToUpdate: objToSaveCertificate) => void,
    open: boolean, 
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

export const DeleteRecord: FC<DeleteRecordProps> = ({ cert, handleStatus, open, onOpenChange}: DeleteRecordProps) => {

    const setStatus = ()=>{
        const folioToSave: objToSaveCertificate = {
                action: "delete",
                folio: cert.folio,
                status: null,
                fecha: null,
                fecha_enviado: null,
                user: null,
                url_file: null,
                id: cert.id.toString(),
                name: null,
                last_name: null,
                email: null,
                email_user: null
            }
        handleStatus(folioToSave)
        onOpenChange(false)
    }   
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Desea Eliminar el registro?</DialogTitle>
                    <DialogDescription>
                        Al continuar el registro se eliminará definitivamente.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                <Button variant="outline" className=' cursor-pointer ' onClick={()=> {onOpenChange(false)}}>Cancelar</Button>
                <Button onClick={()=> setStatus()} variant="outline" className='text-red-600 cursor-pointer hover:text-red-800'>Eliminar <Trash2 color="#9f0712" strokeWidth={1} /></Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
