"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useFilesByEmail } from "@/Hooks";
import { FilePreview } from "..";
import { UserType } from "@/Context";

interface FileHistoryProps {
    email:string,
    proyect: string,
    update: boolean,
    updateFiles: React.Dispatch<React.SetStateAction<boolean>>
    share: (url: string) => void,
    user: UserType,
}
const FileHistory: React.FC<FileHistoryProps> = ({user, update, updateFiles, email, proyect, share }) => {
    const { files, fetchFiles } = useFilesByEmail(email);
    const [number, setNumber] = useState(10); 
    useEffect(() => {
        if(update){
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
        // deleteImageFromImageUploader(imageID, emailUser, (success, error) => {
        //     if (success) {
        //         fetchFiles(email);
        //     }
        // });
    };
    

    const renderImages = files
    .filter((f, id) => {
      return f.Proyect === proyect.toString();
    })
    .sort((a, b) => {
        return  parseInt(b.ID) - parseInt(a.ID); 
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
          deleteHandler={deleteImage}
        />
      );
    });


    return (
    <div className="history files mt-2">
      <h3 className="text-2xl py-1 text-center font-bold text-blue-rr">Galleria</h3>
      <div className="bg-gray-400 files_wrapper flex flex-wrap justify-left gap-2 items-start w-full p-2 ">{renderImages}</div>

      {number < getNumberOfFiles - 1 && (
        <div className="showMore">
          {/* <a
            onClick={(e) => {
              e.preventDefault();
              if (number + numberFilesPerPage < getNumberOfFiles)
                setNumber(number + numberFilesPerPage);
              else setNumber(getNumberOfFiles - 1);
            }}
            href="/"
          >
            Show More
          </a> */}
        </div>
      )}
    </div>
    )   
};
export { FileHistory };
