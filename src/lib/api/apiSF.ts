import { folioDisclaimerResponseType, folioDisclaimerType, getTokenResponseType } from "./apiSF.dataset";

function fetchDataFolioDisclaimer(folio: string, callback : (record: folioDisclaimerType | null, err: string | null) => void) {




}
function getTokeyByServer(callback: (token: string) => void, errorCallback: (err: string) => void) {
  fetch(`${process.env.REACT_APP_APIDW}/CRM/getTokenByServer`, {
    method: "POST",
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


export { fetchDataFolioDisclaimer, getTokeyByServer };