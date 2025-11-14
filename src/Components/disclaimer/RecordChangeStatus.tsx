"use client"
import { UserType } from '@/Context'
import React, { FC, useEffect } from 'react'
import { certificateType } from './dataset'

import {
    NativeSelect,
    NativeSelectOption,
} from "@/Components/ui/native-select"
import { Button } from '../ui/button'
import { Save } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogHeader } from '../ui/dialog'
import { objToSaveCertificate } from '@/lib'

interface RecordChangeStatusProps {
    user: UserType,
    cert: certificateType,
    folio: string,
    idFolio: number,
    handleStatus: (objToUpdate: objToSaveCertificate) => void,
    open: boolean, 
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

export const RecordChangeStatus: FC<RecordChangeStatusProps> = ({ cert, handleStatus, open, onOpenChange}: RecordChangeStatusProps) => {
    const [value, setValue] = React.useState("")
 
    useEffect(() => {
      setValue(
        cert.status == "ACEPTADO" ? "ACEPTADO" : "ENVIADO"
      )
     
      return () => {
        setValue("")
      }
    }, [cert])

    const setStatus = ()=>{      
      const folioToSave: objToSaveCertificate = {
                action: "status",
                folio: cert.folio,
                status: value == "ACEPTADO" ? "ACEPTADO" : "ENVIADO",
                fecha: null,
                fecha_enviado: null,
                user: null,
                url_file: null,
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
                    <DialogTitle className='text-blue-rr'>¿Desea cambiar el status de este certificado ?</DialogTitle>                        
                </DialogHeader>
                <div className='w-full p-2 flex justify-center items-center gap-2'>                   

                      <span className='font-semibold'>Seleccione el nuevo el status de este certificado</span>  
                      <NativeSelect value={value} onChange={e => setValue(e.target.value)}>
                            <NativeSelectOption value="ENVIADO">ENVIADO</NativeSelectOption>
                            <NativeSelectOption value="ACEPTADO">ACEPTADO</NativeSelectOption>
                      </NativeSelect>

                </div>
                <DialogFooter>
                    <Button variant="outline" className=' cursor-pointer ' onClick={() => {onOpenChange(false)}}>Cancelar</Button>
                    <Button onClick={()=> setStatus()} variant="outline" className='text-blue-rr cursor-pointer hover:text-blue-rr'>Guardar <Save strokeWidth={1.25} /></Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
