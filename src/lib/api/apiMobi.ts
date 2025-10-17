import { getPermissionsResType } from "@/Context/UserConfig";

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