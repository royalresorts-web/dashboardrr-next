import { getTokenResponseType, objToSendEmailCertificate } from "./apiSF.dataset";

function getTokeyByServer(callback: (token: string) => void, errorCallback: (err: string) => void) {
  fetch(`${process.env.REACT_APP_APIDW}/CRM/getTokenByServer`, {
    method: "POST",
    cache: "no-cache",
  })
    .then((res) => res.json())
    .then((response: getTokenResponseType) => {
      if (response.code === 0) {
        callback(response.token.access_token);
      }
    })
    .catch((err) => {
      errorCallback(err.message ? err.message : err);
    });
}
function sendEmailForDisclaimer(obj: objToSendEmailCertificate, callback: (success: boolean, err: string | null) => void) {
  // callback(true, null);
  fetch(`${process.env.NEXT_PUBLIC_APIDW}/emails/sendMessage`, {
    method: "POST",
    body: JSON.stringify(obj),
    cache: "no-cache",
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.errorcode === 0) {
        callback(true, null);
      } else {
        callback(false, null);
        alert("Hubo un error al enviar");
      }
    })
    .catch((err) => {
      callback(false, err.message ? err.message : err);
    });
}

export { getTokeyByServer, sendEmailForDisclaimer };