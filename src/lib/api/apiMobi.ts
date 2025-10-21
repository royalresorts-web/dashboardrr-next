import { certificateInfoType, certificateType, fetchCertificatesResponseType } from "@/Components/disclaimer/dataset";
import { getPermissionsResType } from "@/Context/UserContext";
import { folioDisclaimerResponseType, folioDisclaimerType } from "./apiSF.dataset";

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

export function fetchCertificates(
  token: string,
  page: number,
  callback: (response: certificateInfoType) => void,
  errorCallback: (err: certificateType[] | string | null) => void
) {
  const data = new FormData();
  data.append("page", page.toString());

  fetch(process.env.NEXT_PUBLIC_URL_APIDASHBOARD + "getCertificates.php", {
    method: "POST",
    body: data,
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
      err.message ? console.log(err.message) : console.log(err);
    });
}