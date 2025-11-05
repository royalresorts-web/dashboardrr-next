"use client"
import { UserType } from '@/Context'
import React, { FC, useEffect } from 'react'
import { certificateType } from './dataset'

import {
    NativeSelect,
    NativeSelectOption,
} from "@/Components/ui/native-select"
import { Button } from '../ui/button'
import { Save, Trash2 } from 'lucide-react'
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

export const DeleteRecord: FC<DeleteRecordProps> = ({user, cert, handleStatus, open, onOpenChange}: DeleteRecordProps) => {
    const [value, setValue] = React.useState("")
 
    useEffect(() => {
      setValue(
        cert.status == "ACEPTADO" ? "ACEPTADO" : "ENVIADO"
      )
     
      return () => {
        setValue("")
      }
    }, [])

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
                    <Button variant="outline" className=' cursor-pointer ' onClick={e => {onOpenChange(false)}}>Cancelar</Button>
                    <Button onClick={()=> setStatus()} variant="outline" className='text-red-600 cursor-pointer hover:text-red-800'>Eliminar <Trash2 color="#9f0712" strokeWidth={1} /></Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
    )
}
