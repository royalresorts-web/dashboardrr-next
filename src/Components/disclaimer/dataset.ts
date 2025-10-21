export type certificateType = {
    "id": number,
    "folio": string,
    "name": string,
    "last_name": string,
    "email": string,
    "email_user": string,
    "status": string,
    "fecha": string,
    "fecha_enviado": string,
    "user": number,
    "url_file": string,
}

export type certificateInfoType = {
    "certificates": certificateType[],
    "pages": number,
    "page": number,
    "total": number
}

export type fetchCertificatesResponseType = {
    "code": string,
    "data": certificateType[],
    "pages": number,
    "page": number,
    "total": number
    "info": {"config": JSON, "sucess": string[], "message": string} | null
}