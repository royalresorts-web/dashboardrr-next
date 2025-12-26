export type getTokenResponseType = {
    "code": number,
    "token": tokenResponseType
} 

export type tokenResponseType = {
    "access_token": string,
    "instance_url": string,
    "id": string,
    "token_type": string,
    "issued_at": string,
    "signature": string
}

export type folioDisclaimerResponseType ={
    "totalSize": number,
    "done": boolean,
    "records": folioDisclaimerType[]
}

export type folioDisclaimerType = {
    "attributes": {
        "type": string,
        "url": string
    },
    "RRC_IsAcceptedTA__c": boolean,
    "RRC_AcceptedTADate__c": string,
    "RRC_CertificateType__c": string,
    "RRC_IsActive__c": boolean,
    "RRC_ExpDate__c": string,
    "Id": string,
    "RRC_Folio__c": string,
    "RRC_Contract__r": {
        "attributes": {
            "type": string,
            "url": string
        },
        "RRC_Legacy_Contract_ID__c": string,
        "Account": {
            "attributes": {
                "type": string,
                "url": string
            },
            "PersonContactId": string,
            "RRC_PeopleId__c": string,
            "FirstName": string,
            "MiddleName": string,
            "PersonEmail": string,
            "LastName": string
        }
    }
}

export type objToSendEmailCertificate = {
            messageKey: string,
            keyDefinition: string,
            to: string,
            contactKey: string,
            vars: {
                Email: string,
                Folio: string,
                Nombre: string,
                Apellido: string,
                Estatus: string,
                Fecha: Date,
            },
        };
export type objToSaveCertificate = {
    "action": string,
    "id": string | null,
    "folio": string | null,
    "name": string | null,
    "last_name": string | null,
    "email": string | null,
    "email_user": string | null,
    "status": string | null,
    "fecha": string | null,
    "fecha_enviado": string | null,
    "user": string | null,
    "url_file": string | null
};

export type apiMobiResponseSetFolioType = {
    "code": string,
    "description": string
}

export type uploadFileResponse = {
    "code": string,
    "data": uploadFileDataResponse[] | string,
    "description": string | null
}
export type uploadFileDataResponse = {
        "url": string,
        "file": string,
        "idOperation": string,
        "Date": string
    }
export type uploadImageDataResponse = {
        "code": string,
        "data": string,
        "url": string,
        "file": string,
        "idOperation": string,
        "Date": string,
        "description": string | null
    }
export type serverImageFile = {
        "ID": string,
        "Name": string,
        "Type": string,
        "link": string,
        "Proyect": string
    }           
