"use client"
import React, { FC } from 'react'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogHeader, DialogDescription } from '../ui/dialog'

interface DeleteImageProps {
    id: string,
    open: boolean, 
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>,
    deleteHandler: (id: string) => void,
}

export const DeleteImage: FC<DeleteImageProps> = ({ id, open, onOpenChange, deleteHandler}: DeleteImageProps) => {

    const deleteImage = ()=>{
        deleteHandler(id);
        console.log("aqui si");        
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
                <Button onClick={()=> deleteImage()} variant="outline" className='text-red-600 cursor-pointer hover:text-red-800'>Eliminar <Trash2 color="#9f0712" strokeWidth={1} /></Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
