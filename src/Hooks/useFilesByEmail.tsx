import { useState, useEffect, useCallback } from "react";
import { serverImageFile, getFilesByEmail } from "@/lib";

const useFilesByEmail = (email: string) => {
  const [files, setFiles] = useState<serverImageFile[]>([]);
  const refreshFiles = useCallback((emailP: string) => {
    if (!emailP) return;
    getFilesByEmail(emailP)
      .then((res) => res.json())
      .then((response) => {
        if (response.Data) setFiles(response.Data);
        else setFiles([]);
      })
      .catch((error) => {
        console.error(error.message || error);
      });
  }, []);
  useEffect(() => {
    if (email) {
      refreshFiles(email);
    }
  }, [email, refreshFiles]);
  return { files: files, fetchFiles: refreshFiles };
};

export {useFilesByEmail};
