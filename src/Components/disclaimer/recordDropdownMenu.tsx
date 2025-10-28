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
    DialogTrigger,
} from "@/Components/ui/dialog"

import { UserType } from '@/Context'
import { Ellipsis, Save, Trash2 } from 'lucide-react'
import { certificateType } from './dataset'
import { RecordChangeStatus } from '@/Components';

interface MenuRecordProps {
    user: UserType,
    cert: certificateType,
    folio: string,
    idFolio: number,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const RecordDropdownMenu: FC<MenuRecordProps> = ({user, cert, folio, idFolio, setLoading}: MenuRecordProps) => {
    const [openDelete, setOpenDelete] = useState(false)
    const [openFile, setOpenFile] = useState(false)
    const [openStatus, setOpenStatus] = useState(false)



    const handleStatus = (status: string)=> {
        setLoading(true)
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
                            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                        <DropdownMenuItem className='cursor-pointer'>
                            Agregar Archivo
                            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                        <DropdownMenuItem className='cursor-pointer text-red-600 hover:text-red-800' onClick={e => setOpenDelete(true)}>
                            Eliminar Registro
                            <Trash2 color="#9f0712" strokeWidth={1} />
                            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>


            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Desea Eliminar el registro?</DialogTitle>
                        <DialogDescription>
                            Al continuar el registro se eliminará definitivamente.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className=' cursor-pointer ' onClick={e => setOpenDelete(false)}>Cancelar</Button>
                        <Button variant="outline" className='text-red-600 cursor-pointer hover:text-red-800'>Eliminar <Trash2 color="#9f0712" strokeWidth={1} /></Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <Dialog open={openStatus} onOpenChange={setOpenStatus}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-blue-rr'>¿Desea cambiar el status de este certificado ?</DialogTitle>                        
                    </DialogHeader>
                    <div className='w-full p-2 flex justify-center items-center gap-2'>
                        <span className='font-semibold'>Seleccione el nuevo el status de este certificado</span>  
                        <RecordChangeStatus user={user} cert={cert} folio={folio} idFolio={idFolio} setLoading={setLoading}/>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className=' cursor-pointer ' onClick={e => setOpenStatus(false)}>Cancelar</Button>
                        <Button variant="outline" className='text-blue-rr cursor-pointer hover:text-blue-rr'>Guardar <Save strokeWidth={1.25} /></Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>

    )
}
export { RecordDropdownMenu }
