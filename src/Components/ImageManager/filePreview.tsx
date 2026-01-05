"use client";
import Image from "next/image";
import CopyIcon from "../../img/copy-icon.png";
import DeleteIcon from "../../img/delete.png";
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
  const [preview, setPreview] = useState<boolean>(false);
  const [previewInfo, setPreviewInfo] = useState<boolean>(false);

  return (
    <>
    <div className="FilePreview w-50 h-40 flex flex-col items-center justify-between p-2 shadow-xs shadow-white py-2 rounded bg-white">
      <div className="imgPreview  relative">
        <Image onClick={() => setPreviewInfo(true)} data-set={id} className="w-full cursor-pointer" width={200} height={150} src={url} alt="preview" />
        <Image
          className="copyUrl absolute top-1 right-1 cursor-pointer"
          onClick={copyHandler}
          data-url={url}
          width={30}
          height={30}
          src={CopyIcon.src}
          alt="Copy_Icon"
        />
        <Image
          className="deleteImage absolute top-1 left-1 cursor-pointer"
          onClick={() => setPreview(true)}
          data-url={url}
          width={30}
          height={30}
          src={DeleteIcon.src}
          alt="delete_Icon"
        />
      </div>
      <p className="description text-blue-rr text-left flex justify-left items-left w-full text-[12px] ">{name}</p>
    </div>
      <DeleteImage id={id} open={preview} setUpdate={updateFiles} onOpenChange={setPreview} deleteHandler={deleteHandler} />
      <ImageInfo id={id} open={previewInfo} setUpdate={updateFiles} onOpenChange={setPreviewInfo} url={url} name={name} />
    </>
  );
};
export {FilePreview};