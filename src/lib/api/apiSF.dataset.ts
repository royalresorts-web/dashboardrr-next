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