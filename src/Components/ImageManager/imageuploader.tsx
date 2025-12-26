"use client";
import { UserType } from '@/Context'
import React, { useState } from 'react'
import PhotoImg from "../../img/image.png";
import CopyIcon from "../../img/copy-icon.png";
import { showToast } from 'nextjs-toast-notify'
import { ImagePreview } from "@/Components"
import { Button } from '../ui/button';
import { uploadImageDataResponse, uploadImage } from '@/lib';
import Image from 'next/image';
import { Input } from "@/Components/ui/input"




interface ImageUploaderProps {
    user: UserType,
    logout: () => Promise<void>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    proyect: string,
    // update: boolean,
    updateFiles: React.Dispatch<React.SetStateAction<boolean>>
    share: (url: string) => void
}
const Imageuploader: React.FC<ImageUploaderProps> = ({user, setLoading, logout, proyect, updateFiles, share}) => {
    const [File, setFile] = useState<File[]>([]);
    const [FileUploadResult, setFileUploadResult] = useState<uploadImageDataResponse[] | null>(null);
    const [viewPreview, setViewPreview] = useState([]);

    const renderImagesPreview = () => {

        const renderImagesPreview = Object.keys(File).map((fID) => {
            const f = File[parseInt(fID)];
            //   return <ImagePreview key={fID} file={f} />;
            return <ImagePreview key={fID} file={f} tipo='img' />;
        });

        return (
            <div className='flex flex-row gap-4 w-max min-h-[150px]'>
                {
                    renderImagesPreview
                }
            </div>
        );
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        
        const tempFiles: File[] = [];
        setFileUploadResult(null);
        setViewPreview([]);
        
        if (event.currentTarget.files) {
            Object.values(event.currentTarget.files).forEach((f) => {
                tempFiles.push(f);
            });
            event.target.value = "";
        }
        setFile(tempFiles);
    };


    function copyHandler(e: React.MouseEvent<HTMLImageElement>): void {
        const url = e.currentTarget.dataset.url;
        if (url) {
            share(url);
        }
    }

    const renderUrlResults = () => {
        if (!FileUploadResult) return;

        return FileUploadResult.map((fileURL, idUrl) => {
            return (
                <div key={idUrl} className="urlResult py-1">
                    <label htmlFor="" className='font-bold'>{fileURL.file}</label>
                    <div className="input flex flex-row gap-2 items-center w-full">
                        <Input
                            type="text"
                            id=""
                            onChange={() => { }}
                            disabled={true}
                            value={fileURL.url}
                        />
                        <Image
                            onClick={copyHandler}
                            data-url={fileURL.url}
                            width={30}
                            height={30}
                            className='cursor-pointer'
                            src={CopyIcon.src}
                            alt="Copy_Icon"
                        />
                    </div>
                </div>
            );
        });
    };

    const clickSubmitImage = () => {
        if(!user) return; 
        setLoading(true);
        user.getIdToken().then(() => {
            uploadImage(File, user.email!, proyect, (data, err) => {                
                setTimeout(() => {
                    setLoading(false);
                    if (!err) {
                        setFileUploadResult(data);
                        data!.map((imgR) => {
                            if (imgR.code === "0") {
                            showToast.success("Agregado Exitoso : " + imgR.file, {
                                duration: 4000,
                                progress: true,
                                position: "top-right",
                                transition: "bounceIn",
                                icon: '',
                                sound: true,
                            });                         
                            //TODO: aqui se actualiza no se que del file history
                            // setTrigger(!trigger);
                            updateFiles(true);
                            } else{
                                showToast.error((imgR.description || "Error :") + " : " + imgR.file, {
                                    duration: 4000,
                                    progress: true,
                                    position: "top-right",
                                    transition: "bounceIn",
                                    icon: '',
                                    sound: true,
                                });
                            }   
                            return true;
                        });
                    } else {
                        showToast.error(err, {
                            duration: 4000,
                            progress: true,
                            position: "top-right",
                            transition: "bounceIn",
                            icon: '',
                            sound: true,
                        });
                    }
                }, 2000);
            });
        }).catch(() => {
            setLoading(false);
            logout();
        });      

    };

    return (
        <>
            {/* <h1 className='text-4xl text-center py-3 font-bold text-blue-rr'>Image Manager</h1> */}
            <div className="form flex flex-col justify-center items-center w-full h-auto mt-5">
                <div className="dataForm w-[100%]  md:w-125 h-30 relative">
                    <label htmlFor="image" className='text-center text-xl font-bold flex flex-col justify-center items-center w-full h-full absolute top-0 left-0 bottom-0 right-0 border-3 border-dashed border-gray-800'>
                        Arrastre o presione para agregar imagenes
                        <Image width={30} height={30} src={PhotoImg.src} alt="photo_icon" />
                    </label>
                    <input className='absolute top-0 left-0 w-full h-25 opacity-0 cursor-pointer appearance-auto ' onChange={handleFileSelect} id="image" multiple type="file" />

                </div>
                {File.length > 0 ? (
                    <div className="preview w-full md:w-125 md:margins-auto">
                        <h2 className='text-xl mt-2 py-1 w-full bg-blue-rr text-white text-center'>Previews</h2>
                        <div className="carouselImages w-full overflow-x-auto scrollbar-hide py-2">{renderImagesPreview()}</div>
                    </div>
                ) : (
                    ""
                )}
                {viewPreview && FileUploadResult ? (
                    <div className="preview w-full md:w-125 md:margins-auto pb-2">
                        <h2 className='text-xl mt-2 py-1 w-full bg-blue-rr text-white text-center'>Urls en servidor</h2>
                        {renderUrlResults()}
                    </div>
                ) : (
                    ""
                )}
                {viewPreview && File.length > 0 ? (
                    <div className="dataForm actionsUpload ">
                        <Button variant="destructive" size="lg" onClick={() => setFile([])} className='cursor-pointer mr-2' >Clear</Button>
                        <Button onClick={clickSubmitImage} variant="outline" size="lg" className='bg-blue-rr text-white cursor-pointer'>Subir</Button>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </>
    )
}

export { Imageuploader }



