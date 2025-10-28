"use client"
import { UserType } from '@/Context'
import React, { FC, useEffect } from 'react'
import { certificateType } from './dataset'

import {
    NativeSelect,
    NativeSelectOptGroup,
    NativeSelectOption,
} from "@/Components/ui/native-select"

interface RecordChangeStatusProps {
    user: UserType,
    cert: certificateType,
    folio: string,
    idFolio: number,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const RecordChangeStatus: FC<RecordChangeStatusProps> = ({cert, user, folio, idFolio, setLoading}: RecordChangeStatusProps) => {
    const [value, setValue] = React.useState("")

    useEffect(() => {
      setValue(
        cert.status == "ACEPTADO" ? "ACEPTADO" : "ENVIADO"
      )
    
      return () => {
        setValue("")
      }
    }, [cert])
    
    
    return (
        <NativeSelect value={value} onChange={e => setValue(e.target.value)}>
            <NativeSelectOption value="ENVIADO">ENVIADO</NativeSelectOption>
            <NativeSelectOption value="ACEPTADO">ACEPTADO</NativeSelectOption>
        </NativeSelect>
    )
}
