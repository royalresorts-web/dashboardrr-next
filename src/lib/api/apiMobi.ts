import { certificateInfoType, certificateType, fetchCertificatesResponseType } from "@/Components/disclaimer/dataset";
import { getPermissionsResType } from "@/Context/UserContext";
import { 
  apiMobiResponseSetFolioType, 
  folioDisclaimerResponseType, 
  folioDisclaimerType, 
  objToSaveCertificate, 
  uploadFileDataResponse, 
  uploadImageDataResponse,
  uploadFileResponse} from "./apiSF.dataset";
import { filter } from "@/app/(routes)/dashboard/disclaimer/page";
export function getPermissions() {
}

export function fetchUserPermissions(
  emailParam: string,
  callback: (response: getPermissionsResType) => void,
  errorCallback: (err: string | null) => void
) {
  const data = new FormData();
  data.append("email", emailParam);

  fetch(process.env.NEXT_PUBLIC_URL_APIDASHBOARD + "getPermissions.php", {
    method: "POST",
    body: data,
    cache: 'no-store' 
  })
    .then((res) => res.json())
    .then((response: getPermissionsResType) => {
      if (response.code === "0") {
        callback(response);
      } else {
        errorCallback(response.data);
      }
    })
    .catch((err) => {
      console.log(err);
      //   errorCallback(err.message ? err.message : err);
      errorCallback("Error");
    });
}

export function getUrlForCertificatesExport(filter: filter){
  let conditions = "";
  
  if (filter.folio) {
    conditions += `&folio=${filter.folio}`;
  }
  if (filter.user) {
    conditions += `&user=${filter.user}`;
  }
  if (filter.state) {
    conditions += `&status=${filter.state}`;
  }

  const downloadUrl = `${process.env.NEXT_PUBLIC_URL_APIDASHBOARD}getCertificates.php?export=1${conditions}`;
  return downloadUrl;
}

export function fetchCertificates(
  token: string,
  page: number,
  filter: filter,
  callback: (response: certificateInfoType) => void,
  errorCallback: (err: certificateType[] | string | null) => void
) {
const params = new URLSearchParams();
// Always append 'page'
params.append("page", page.toString()); 

// Conditionally append filter values
if (filter) {
    if (filter.folio) params.append("folio", filter.folio);
    if (filter.user) params.append("user", filter.user);
    // Note: I've kept the original check for 'filter' here, 
    // but the original code only checked filter.state *if* filter was truthy.
    // Assuming filter.state is the status you want to pass.
    if (filter.state) params.append("status", filter.state); 
}


  fetch(`${process.env.NEXT_PUBLIC_URL_APIDASHBOARD}getCertificates.php?${params.toString()}`, {
    method: "GET",
    // body: data,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((response: fetchCertificatesResponseType) => {
      if (response.code === "0") {
        callback({ "certificates": response.data, "pages": response.pages, "page": response.page, "total": response.total });
      } else {
        errorCallback(response.data);
      }
    })
    .catch((err) => {
      console.log(err);
      errorCallback("Error");
    });
}
export function fetchCertificateByFolio(folio: string, token: string, callback: (record: folioDisclaimerType | null, err: string | null) => void) {
  fetch(
    `${process.env.NEXT_PUBLIC_URL_APIDASHBOARD}/getFolioDisclaimer.php?cert=${folio}`,
    {
      method: "GET",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((response: folioDisclaimerResponseType) => {
      if (response.records.length > 0) {
        callback(response.records[0], null);
      } else {
        callback(null, "No hay datos para este folio");
      }
    })
    .catch((err) => {
      if (err.message) {
        console.log(err.message);
      } else {
        console.log(err);
      }      
    });
}

export function setInfoCertificate($data: objToSaveCertificate, token: string, callback: (record: boolean, err: string | null) => void) {
  fetch(
    `${process.env.NEXT_PUBLIC_URL_APIDASHBOARD}/setFolioCertificate.php`,
    {
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify($data),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((response: apiMobiResponseSetFolioType) => {
      if (response.code == "1") {
        callback(true, null);
      } else {
        callback(false, "No hay datos para este folio");
      }
    })
    .catch((err) => {
      if (err.message) {
        console.log(err.message);
      } else {
        console.log(err);
      }
    });
}
export function setStatusCertificate($data: objToSaveCertificate, token: string, callback: (record: boolean, err: string | null) => void) {
  fetch(
    `${process.env.NEXT_PUBLIC_URL_APIDASHBOARD}/setFolioCertificate.php`,
    {
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify($data),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((response: apiMobiResponseSetFolioType) => {
      if (response.code == "1") {
        callback(true, null);
      } else {
        callback(false, "No hay datos para este folio");
      }
    })
    .catch((err) => {
      if (err.message) {
        console.log(err.message);
      } else {
        console.log(err);
      }
    });
}
export const uploadCertificate =async (file: File[], email: string, proyect:number = 0, name:string = "custom-0989", callback: (sucess: uploadFileDataResponse | null, err :null | string) => void) => {
  const data = new FormData();
  file.map((f, id) => {
    data.append("archivo[" + id + "]", f);
    return true;
  });

  data.append("user", "2");
  data.append("proyect", proyect.toString());
  data.append("email", email);
  data.append("name", name);

  // return;
  fetch(process.env.NEXT_PUBLIC_URL_APIDASHBOARD + "FileUploaderCertificatesByEmail.php", {
    method: "POST",
    body: data,
    cache: "no-cache",
  })
    .then((response) => response.json())
    .then((res: uploadFileResponse) => {
      if (res.code === "0") {
        if(typeof res.data !== "string"){
          callback(res.data[0], null);
        }else{
          callback(null, res.data);
        }        
      } else {
        if(typeof res.data !== "string"){
          callback(null, "Hubo un error al subir el archivo: 183");
        }else{
          callback(null, res.data);
        }        
      }
    })
    .catch((err) => {
      callback(null, err.message || err);
    });
};
export const uploadImage = (file: File[], email: string,  proyect:string = "1", callback: (sucess: uploadImageDataResponse[] | null, err :null | string) => void) => {
  const data = new FormData();
  file.map((f, id) => {
    data.append("archivo[" + id + "]", f);
    return true;
  });

  data.append("user", "2");
  data.append("proyect", proyect);
  data.append("email", email);

  // return;
  fetch(process.env.NEXT_PUBLIC_URL_APIDASHBOARD + "FileUploaderByEmail.php", {
    method: "POST",
    body: data,
    cache: "no-cache",
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.code === "0") {
        callback(res.data, null);
      } else {
        callback(null, res.data);
      }
    })
    .catch((err) => {
      callback(null, err.message || err);
    });
};
export const getFilesByEmail = (mail: string) => {
  let data = new FormData();
  data.append("email", mail);
  return fetch(process.env.NEXT_PUBLIC_URL_APIDASHBOARD + "getFilesByEmail.php", {
    method: "POST",
    body: data,
    cache: "no-cache",
  });
};