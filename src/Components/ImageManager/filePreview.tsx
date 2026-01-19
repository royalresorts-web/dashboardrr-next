"use client";
import Image from "next/image";
import CopyIcon from "../../img/copy-icon.png";
import DeleteIcon from "../../img/delete.png";
import BreakImage from "../../img/custom_break.png";
import { useState } from "react";
import { DeleteImage, ImageInfo} from "..";

interface FilePreviewProps {
  id: string,
  url: string,
  name: string,
  type: string,
  copyHandler: (e: React.MouseEvent<HTMLImageElement>) => void,
  deleteHandler: (id: string) => void,
  updateFiles: React.Dispatch<React.SetStateAction<boolean>>
}
const FilePreview: React.FC<FilePreviewProps> = ({
  id,
  url = "",
  name = "",
  copyHandler,
  deleteHandler,
  updateFiles
}) => {
  const [imgUrl, setImgUrl ] = useState<string>(url);
  const [preview, setPreview] = useState<boolean>(false);
  const [previewInfo, setPreviewInfo] = useState<boolean>(false);


  return (
    <>
    <div className="FilePreview w-60 h-40 flex flex-col items-center justify-between p-2 shadow-xs shadow-white py-2 rounded bg-white">
      <div className="imgPreview overflow-hidden relative">
        <Image 
          className="w-full cursor-pointer h-full object-cover" 
          onClick={() => setPreviewInfo(true)} 
          onError={()=> setImgUrl(BreakImage.src)}
          data-set={id} 
          width={200} 
          height={150} 
          src={imgUrl} 
          alt="preview" />
        <Image
          className="copyUrl absolute top-1 p-1 right-1 cursor-pointer rounded-full bg-white shadow-sm shadow-gray-400"
          onClick={copyHandler}
          data-url={url}
          width={30}
          height={30}
          src={CopyIcon.src}
          alt="Copy_Icon"
        />
        <Image
          className="deleteImage absolute top-1 p-1 left-1 cursor-pointer rounded-full bg-white shadow-sm shadow-gray-400"
          onClick={() => setPreview(true)}
          data-url={url}
          width={30}
          height={30}
          src={DeleteIcon.src}
          alt="delete_Icon"
        />
      </div>
      <p className="description p-1 bg-gray-400 text-white text-left flex justify-left items-left w-full text-[12px] ">{name}</p>
    </div>
      <DeleteImage id={id} open={preview} setUpdate={updateFiles} onOpenChange={setPreview} deleteHandler={deleteHandler} />
      <ImageInfo id={id} open={previewInfo} setUpdate={updateFiles} onOpenChange={setPreviewInfo} url={url} name={name} />
    </>
  );
};
export {FilePreview};