"use client"
import { UserType } from '@/Context'
import React, { ChangeEvent, useState } from 'react'
import { certificateType } from './dataset'
import { objToSaveCertificate, uploadCertificate } from '@/lib'
import { Button } from '../ui/button'
import { FileUp, Trash } from 'lucide-react'
import { showToast } from 'nextjs-toast-notify'


interface LoadFileRecordProps {
    user: UserType,
    cert: certificateType,
    folio: string,
    idFolio: number,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    handleStatus: (objToUpdate: objToSaveCertificate) => void
}

const LoadFileRecord: React.FC<LoadFileRecordProps> = ({cert,user, setLoading, handleStatus}: LoadFileRecordProps) => {
    const [File, setFile] = useState<File[]>([]);

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        if (!target.files) return;
        const tempFiles: File[] = [];
        
        Object.values(target.files).forEach((f) => {
            tempFiles.push(f);
        });
        setFile(tempFiles);
    };
    const deleteFile = () => {
        setFile([])
    }
    const uploadPDFToDB = async () => {
        setLoading(true);
        const nameFile = `certificate-${cert.folio}-${cert.email}`;
        await uploadCertificate(File, user.email! ,0, nameFile, (data, err) => {
              if (!err) {
                    showToast.success("Archivo subido con éxito, actualizando en la BD...", {
                        duration: 4000,
                        progress: true,
                        position: "top-right",
                        transition: "bounceIn",
                        icon: '',
                        sound: true,
                    });
                    
                    
                    const folioToSave: objToSaveCertificate = {
                        action: "file",
                        folio: cert.folio,
                        status: null,
                        fecha: null,
                        fecha_enviado: null,
                        user: null,
                        url_file: data ?  data.url: null,
                        id: null,
                        name: null,
                        last_name: null,
                        email: null,
                        email_user: null
                    }
                    handleStatus(folioToSave)
                    
              }else{
                setLoading(false);
                showToast.error("Hubo un error en subiendo el archivo", {
                    duration: 4000,
                    progress: true,
                    position: "top-right",
                    transition: "bounceIn",
                    icon: '',
                    sound: true,
                });
              }
        });
    }

    return (
        <>
            {File.length === 0 ? (
                <div className="inputFile">
                    <div
                        className="dataForm relative w-full h-24 border-2 border-dashed border-black/50 rounded-lg flex items-center justify-center p-4 text-center"
                    >
                        <label
                            htmlFor="image"
                            className="text-sm font-medium text-gray-700 pointer-events-none select-none z-10"
                        >
                            Arrastre o presione para agregar un archivo PDF unicamente
                        </label>
                        <input
                            onChange={handleFileSelect}
                            id="image"
                            type="file"
                            accept=".pdf"
                            className=" absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                    </div>
                </div>
            ) : (
                <div className='w-full py-3 px-2 shadow rounded my-2'>
                    <div className='text-xl font-bold text-blue-rr'>Archivo preparado para subir / eliminar</div>
                    <div className='fileInfo flex flex-row flex-wrap justify-center items-center gap-2 w-full py-2'>
                        <div className='w-[100%] lg:w-[49%]'>
                            <span className='font-bold'> Nombre</span><br />
                            <span className='text-blue-rr'>{File[0].name}</span>
                        </div>
                        <div className='w-[100%] lg:w-[49%] flex flex-row justify-center items-center gap-2'>
                            <Button onClick={uploadPDFToDB} variant={"outline"} className='cursor-pointer'>
                                <FileUp className='text-blue-rr' /> Subir
                            </Button>

                        </div>
                        <div className='w-[100%] lg:w-[49%]'>
                            <span className='font-bold'>Type:</span><br />
                            <span className='text-blue-rr '>application/pdf</span>
                        </div>
                        <div className='w-[100%] lg:w-[49%] flex flex-row justify-center items-center gap-2'>
                            <Button onClick={deleteFile} variant={"outline"} className='cursor-pointer'>
                                <Trash className='text-red-700' /> Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export { LoadFileRecord }
