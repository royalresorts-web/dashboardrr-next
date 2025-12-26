"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ImagePreviewProps {
    file: File,
    tipo: string
}
const ImagePreview: React.FC<ImagePreviewProps> = ({ file, tipo }) => {
    // const ImagePreview = ({ file: File = null, tipo: string = "img" }) => {
    const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);


    useEffect(() => {
        const reader = new FileReader();
        reader.onload = function (event) {
            if (event.target) {
                setPreview(event.target.result);
            }
        };
        if (file != null) reader.readAsDataURL(file)
        return () => { };
    }, [file])


    return (
        <div className="flex flex-col w-40 flex-shrink-0 bg-white border rounded-lg p-2 shadow-sm">
            {preview && tipo == "img" ? <Image className="w-full" width={100} height={100} src={preview as string} alt="preview" /> : ""}
            <p className="description">
                <strong>Nombre:</strong> {file?.name} <br />
                <strong>Type:</strong> {file?.type} <br />
            </p>
        </div>
    );
};
export { ImagePreview };
