"use client";
import { useAuth, UserProyectsType } from "@/Context";
import React, { useState } from "react";
import dynamic from 'next/dynamic';
import { useUserConfig } from "@/Context";
import { Imageuploader, FileHistory } from "@/Components";
import { showToast } from "nextjs-toast-notify";

export type filter = {
  folio: string | null,
  user: string | null,
  state: "TODOS" | "ACEPTADO" | "ENVIADO", 
  page: number | 1
}
const LoadingDisclaimer = dynamic(() => import('@/Components/disclaimer/loaderCertificates').then((mod) => mod.LoadingDisclaimer),{
  // Optional: Show a loading message while the component chunk is fetched
  ssr: false, // This is the key
  loading: () => <p>...</p>,
});
type ModernNavigator = Navigator & {
    share?: (data: ShareData) => Promise<void>;
};


export default function Page() {
  const { user, logout} = useAuth();
  const [disclaimerLoading, setDisclaimerLoading] = useState(false);
  const { userProyects } = useUserConfig();
  const [proyect, setProyect] = useState<string>("1");
  const [updateFiles, setUpdateFiles] = useState<boolean>(false);
  console.log(proyect);

  const renderProyects = () => {
    if (!userProyects?.length) return [];
    const selectOptions: React.ReactElement[] = [];
    const uniqueItemsMap = new Map();
    userProyects.forEach(item => {
        const key = `${item.ID}-${item.Name}`;
        if (!uniqueItemsMap.has(key)) {
            uniqueItemsMap.set(key, item);
        }
    });
    const filteredArray = Array.from(uniqueItemsMap.values());
    filteredArray.forEach((proyect) => {
      selectOptions.push(
        <option key={proyect.ID + "-" + Date.now()} value={proyect.ID as string}>
          {proyect.Name}
        </option>
      );
    });
    return selectOptions;
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
  
  return (
    <>
     <LoadingDisclaimer disclaimerLoading={disclaimerLoading} />  
      <div className="w-full h-[calc(100vh-56px)] p-2 ">
        <div className="actions p-2 w-full flex justify-end items-end bg-blue-rr text-white">
          <div className="proyectSelector">
            <span>Proyecto</span>
            <select
              className="text-blue-rr bg-white ms-2 border rounded text-[16px]"
              onChange={(e) =>{              
                const proyect: UserProyectsType | undefined = userProyects?.filter(
                  (p) => p.ID === e.target.value
                )[0]
                if(proyect){
                  setProyect(e.target.value);
                }
              }              
              }
              name="proyect"
              id="proyect"
            >
              {renderProyects()}
            </select>
          </div>
        </div>
        {
          user ?  <Imageuploader share={handleShareOrCopy} updateFiles={setUpdateFiles} user={user} logout={logout} setLoading={setDisclaimerLoading} proyect={proyect} /> : ""
        } 
        {
          user ? <FileHistory user={user} share={handleShareOrCopy} proyect={proyect} update={updateFiles} updateFiles={setUpdateFiles} email={user.email!} /> : ""
        }
      </div>
    </>
  )
}