"use client"
import React, { FC } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogHeader, DialogDescription } from '../ui/dialog'

import Image from 'next/image'

interface ImageInfoProps {
    id: string,
    open: boolean, 
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>,
    url: string,
    name: string
}

export const ImageInfo: FC<ImageInfoProps> = ({ open, onOpenChange, url, name}: ImageInfoProps) => {

    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription>
                        <Image style={{
                        width: 'auto',   // Allows the width to be determined by the 'width' prop
                        height: 'auto',  // Maintains aspect ratio
                        maxWidth: '100%', // Ensures it doesn't overflow its container
                        }} src={url} alt={name} width={700} height={500} />
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                <Button variant="outline" className=' cursor-pointer ' onClick={()=> {onOpenChange(false)}}>Cerrar</Button>                
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
