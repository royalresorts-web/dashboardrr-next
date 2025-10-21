import { certificateInfoType, certificateType, fetchCertificatesResponseType } from "@/Components/disclaimer/dataset";
import { getPermissionsResType } from "@/Context/UserContext";

export function getPermissions(){
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
  errorCallback: (err: certificateType[]|string|null) => void
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
        callback({"certificates": response.data, "pages": response.pages, "page": response.page, "total": response.total});
      } else {
        errorCallback(response.data);
      }
    })
    .catch((err) => {
        console.log(err);
        errorCallback("Error");
    });
}