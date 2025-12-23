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



type ModernNavigator = Navigator & {
    share?: (data: ShareData) => Promise<void>;
};
interface ImageUploaderProps {
    user: UserType,
    logout: () => Promise<void>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    proyect: string,
    // update: boolean,
    // setUpdate: React.Dispatch<React.SetStateAction<boolean>>
}
const Imageuploader: React.FC<ImageUploaderProps> = ({user, setLoading, logout, proyect}) => {
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

    const handleShareOrCopy = async (
        url: string
    ) => {
        // Use the extended Navigator type
        const nav = navigator as ModernNavigator;
        const shareData: ShareData = {
            title: "Certificates",
            text: "Royal Resorts",
            url: url,
        };
        try {
            // 2. Try Modern Share API (Mobile)
            if (nav.share) {
                await nav.share(shareData);
                // Share was successful (or at least the dialog opened)
                return;
            }

            // 3. Try Modern Clipboard API (Desktop/Secure Contexts)
            // We can now safely check clipboard.writeText
            if (nav.clipboard && nav.clipboard.writeText) {
                await nav.clipboard.writeText(url);
                showToast.success("Url Copiada !!!", {
                    duration: 4000,
                    progress: true,
                    position: "top-right",
                    transition: "bounceIn",
                    icon: '',
                    sound: true,
                });
                return;
            }

            // 4. Fallback to Legacy 'execCommand' (Your Original Method)
            const el = document.createElement("textarea");
            el.value = url; // Use .value for textareas, not textContent
            el.setAttribute("readonly", ""); // Set readonly attribute
            el.style.position = "absolute";
            el.style.left = "-9999px"; // Move it off-screen
            el.classList.add(`copy-${url}`); // Add class just in case
            document.body.appendChild(el);

            el.select(); // Select the text
            const success = document.execCommand("copy"); // Execute the copy

            document.body.removeChild(el); // IMPORTANT: Clean up the DOM

            if (success) {
                showToast.success("Url Copiada !!!", {
                    duration: 4000,
                    progress: true,
                    position: "top-right",
                    transition: "bounceIn",
                    icon: '',
                    sound: true,
                });
            } else {
                showToast.error("Hubo un error al intentar copiar la url", {
                    duration: 4000,
                    progress: true,
                    position: "top-right",
                    transition: "bounceIn",
                    icon: '',
                    sound: true,
                });
            }

        } catch (err) {
            // Handle errors from navigator.share (e.g., user cancelled)
            // or navigator.clipboard.writeText (e.g., permissions denied)

            // Don't show an error if the user just cancelled the share dialog
            // Check if err is an Error object before accessing .name
            if (err instanceof Error && err.name !== 'AbortError') {
                showToast.error("Error: " + err.message, {
                    duration: 4000,
                    progress: true,
                    position: "top-right",
                    transition: "bounceIn",
                    icon: '',
                    sound: true,
                });
            } else if (!(err instanceof Error)) {
                // Handle non-Error throws, just in case
                showToast.error("Error Inesperado", {
                    duration: 4000,
                    progress: true,
                    position: "top-right",
                    transition: "bounceIn",
                    icon: '',
                    sound: true,
                });
            }
        }
    }
    function copyHandler(e: React.MouseEvent<HTMLImageElement>): void {
        const url = e.currentTarget.dataset.url;
        if (url) {
            handleShareOrCopy(url);
        }
    }

    const renderUrlResults = () => {
        if (!FileUploadResult) return;

        return FileUploadResult.map((fileURL, idUrl) => {
            return (
                <div key={idUrl} className="urlResult">
                    <label htmlFor="">{fileURL.file}</label>
                    <div className="input">
                        <input
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
                console.log(data);
                
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
        })
        .catch(() => {
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
                        <h2>Previews</h2>
                        <div className="carouselImages w-full overflow-x-auto scrollbar-hide py-4">{renderImagesPreview()}</div>
                    </div>
                ) : (
                    ""
                )}
                {viewPreview && FileUploadResult ? (
                    <>
                        <h2>Urls en servidor</h2>
                        {renderUrlResults()}
                    </>
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



