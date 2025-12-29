"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useFilesByEmail } from "@/Hooks";
import { FilePreview } from "..";
import { UserType } from "@/Context";
import { Button } from "../ui/button";
import { deleteImageFromImageUploader } from "@/lib";

interface FileHistoryProps {
  email: string,
  proyect: string,
  update: boolean,
  updateFiles: React.Dispatch<React.SetStateAction<boolean>>
  share: (url: string) => void,
  user: UserType,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}
const numberFilesPerPage = 16;
const FileHistory: React.FC<FileHistoryProps> = ({ user, update, updateFiles, email, proyect, share, setLoading }) => {
  const { files, fetchFiles } = useFilesByEmail(email);
  const [number, setNumber] = useState(numberFilesPerPage);
  useEffect(() => {
    if (update) {
      fetchFiles(email);
      updateFiles(false);
    }
  }, [update, fetchFiles, updateFiles]);

  const getNumberOfFiles = files.filter((f, id) => {
    return f.Proyect === proyect;
  }).length;

  const copyHandler = (e: React.MouseEvent<HTMLImageElement>): void => {
    const url = e.currentTarget.dataset.url;
    if (url) {
      share(url);
    }
  }
  const deleteImage = (imageID: string) => {
    let emailUser = user.email;
    console.log(user.uid);
    
    setLoading(true)
    deleteImageFromImageUploader(imageID, emailUser!, (success, error) => {
        if (success) {
            fetchFiles(email);
        }
        setLoading(false)
    });
  };


  const renderImages = files
    .filter((f, id) => {
      return f.Proyect === proyect.toString();
    })
    .sort((a, b) => {
      return parseInt(b.ID) - parseInt(a.ID);
    })
    .filter((f, id) => id <= number)
    .map((file, id) => {
      return (
        <FilePreview
          copyHandler={copyHandler}
          id={file.ID}
          key={file.ID + id}
          name={file.Name}
          type={file.Type}
          url={file.link}
          updateFiles={updateFiles}
          deleteHandler={deleteImage}
        />
      );
    });


  return (
    <div className="history files mt-2 pt-2 pb-5">
      <h3 className="text-2xl py-1 text-center font-bold text-blue-rr mb-2">Galleria</h3>
      <div className="bg-gray-400 files_wrapper flex flex-wrap justify-left gap-2 items-start w-full p-2 ">{renderImages}</div>

      {number < getNumberOfFiles - 1 && (
        <div className="showMore py-2 w-full flex justify-center items-center">
          <Button
            className="bg-blue-rr text-white cursor-pointer"
            variant={"outline"}
            onClick={(e) => {
              if (number + numberFilesPerPage < getNumberOfFiles)
                setNumber(number + numberFilesPerPage);
              else setNumber(getNumberOfFiles - 1);
            }}
          >
            Show More
          </Button>
        </div>
      )}
    </div>
  )
};
export { FileHistory };
