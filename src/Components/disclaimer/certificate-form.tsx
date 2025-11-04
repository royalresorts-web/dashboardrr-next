"use client";
import { UserType } from '@/Context';
import { folioDisclaimerType, ValidateEmail, sendEmailForDisclaimer, objToSaveCertificate, setInfoCertificate } from '@/lib';
import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Image from 'next/image';
import { showToast } from 'nextjs-toast-notify';

interface CertificateFormProps {
    user: UserType,
    cert: folioDisclaimerType | null,
    folio: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>
}

const CertificateForm: React.FC<CertificateFormProps> = ({ user, cert, folio, setLoading, setUpdate }: CertificateFormProps) => {
    const [email, setEmail] = useState("");
    const [subscriber, setSubscriber] = useState("");
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");

    const emailRef =useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const lastnameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if(cert){
        setEmail(cert ? cert.RRC_Contract__r.Account.PersonEmail:"");
        setName(`${cert ? cert.RRC_Contract__r.Account.FirstName : ""} ${cert?.RRC_Contract__r.Account.MiddleName ? cert.RRC_Contract__r.Account.MiddleName : ""}`);
        setLastname(cert?.RRC_Contract__r.Account.LastName); 
        setSubscriber(cert && cert.RRC_Contract__r && cert.RRC_Contract__r.Account && cert.RRC_Contract__r.Account.PersonContactId ? cert.RRC_Contract__r.Account.PersonContactId : "");
      }    
      return () => {
        setEmail("")
        setLastname("")
        setName("")
      }
    }, [cert])

    const requestEmail = (lang: string) => {
        if (!ValidateEmail(email)) {
            emailRef?.current?.focus();
            alert("Formato de campo inválido");
            return; 
        }
        if (name === "" && nameRef.current) {
            nameRef?.current.focus();
            alert("Campo necesario para continuar");
            return;
        }
        if (lastname === "" && lastnameRef.current) {
            lastnameRef?.current.focus();
            alert("Campo necesario para continuar");
            return;
        }
        setLoading(true);
        const folio = cert && cert.RRC_Folio__c ? cert.RRC_Folio__c : "";
        const emailToSend = process.env.NODE_ENV === 'development' ? "icanul@royalresorts.com" : email;

        const obj = {
            messageKey: "envioConcerPetition" + folio + new Date().getTime(),
            keyDefinition: lang === "en-US" ? "petitionConcern" : "petitionConcernEs",
            to: emailToSend,
            contactKey:
                emailToSend !== cert!.RRC_Contract__r.Account.PersonEmail || subscriber === ""
                ? emailToSend
                : subscriber,
            vars: {
                Email: emailToSend,
                Folio: folio,
                Nombre: name,
                Apellido: lastname,
                Estatus: "ENVIADO",
                Fecha: new Date(),
            },
        };
        sendEmailForDisclaimer(obj, (success, err )=> {
            if(success){
                const options: Intl.DateTimeFormatOptions = {
                    year: 'numeric',  // "2025"
                    month: '2-digit', // "05"
                    day: '2-digit'    // "28"
                };
                const fechaParam : Date = new Date();

                const folioToSave: objToSaveCertificate = {
                    action: "add",
                    id: null,
                    folio: folio,
                    email: email,
                    name: name,
                    last_name: lastname,
                    email_user: user.email,
                    status: "ENVIADO",
                    fecha: fechaParam.toLocaleDateString('en-US', options),
                    fecha_enviado: fechaParam.toLocaleDateString('en-US', options),
                    user: "",
                    url_file : ""                       

                }
                user.getIdToken()
                .then(res => {
                    setInfoCertificate(folioToSave, res, (record, err) => {
                        setLoading(false)
                        if(!err){
                            //aqui va el toast   
                            showToast.success("¡La operación se realizó con éxito!", {
                                duration: 4000,
                                progress: true,
                                position: "top-right",
                                transition: "bounceIn",
                                icon: '',
                                sound: true,
                            });
                            setEmail("");
                            setName("");
                            setLastname("");
                            setUpdate(true);
                        }else{
                            showToast.error("Hubo un error en la operacion", {
                                duration: 4000,
                                progress: true,
                                position: "top-right",
                                transition: "bounceIn",
                                icon: '',
                                sound: true,
                            });
                        }
                    });
                })                
            }
            if(err){
                showToast.error("hubo un error: " + err, {
                    duration: 4000,
                    progress: true,
                    position: "top-right",
                    transition: "bounceIn",
                    icon: '',
                    sound: true,
                });
                setLoading(false) 
            }
        })  
         
       
    }

    return (
        <div className="records flex flex-row justify-center gap-[11px] px-2">            
            <div className="cert-detail grid grid-rows-3 gap-1 grid-cols-2 flex-1 rounded border p-0">
                <div className="data flex flex-col justify-center items-center">
                    <span className="font-bold">Tipo de Certificado</span>
                    <span className="text-blue-rr font-semibold">{cert && cert.RRC_CertificateType__c}</span>
                </div>
                <div className="data flex flex-col justify-center items-center">
                    <span className="font-bold">Folio Certificado</span>
                    <span className="text-blue-rr font-semibold">{cert && cert.RRC_Folio__c}</span>
                </div>
                <div className="data flex flex-col justify-center items-center">
                    <span className="font-bold">Estatus</span>
                    <span className="text-blue-rr font-semibold">{cert && cert.RRC_IsAcceptedTA__c ? "ACEPTADO" : "PENDIENTE"}</span>
                </div>
                <div className="data flex flex-col justify-center items-center">
                    <span className="font-bold">Fecha</span>
                    <span className="text-blue-rr font-semibold">
                        {/* {cert && cert.RRC_Folio__c} */}
                        {cert && cert.RRC_AcceptedTADate__c
                            ? cert.RRC_AcceptedTADate__c.split("T")[0]
                            : "XXX"}
                    </span>
                </div>
                <div className="data flex flex-col justify-center items-center">
                    <span className="font-bold">Legacy Contract</span>
                    <span className="text-blue-rr font-semibold">{cert && cert.RRC_Contract__r.RRC_Legacy_Contract_ID__c}</span>
                </div>
                <div className="data flex flex-col justify-center items-center">
                    <span className="font-bold">Fecha Expiración</span>
                    <span className="text-blue-rr font-semibold">{cert && cert.RRC_ExpDate__c}</span>
                </div>
            </div>
            <div className="cert-form flex-2 ">
           
                <div className="grid grid-rows-3 grid-cols-2 gap-1 p-2">
                    <div className="flex flex-col w-full   gap-1 p-2">
                        <span className="font-bold">Email</span>
                        <Input ref={emailRef} type="email" placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white" />
                    </div>
                    <div className="flex flex-col w-full items-start gap-1 p-2">
                        <span className="font-bold">Nombre</span>
                        <Input ref={nameRef} type="text" placeholder="nombre" value={name} onChange={(e) => setName(e.target.value)} className="bg-white" />
                    </div>
                    <div className="flex flex-col w-full items-start gap-1 p-2">
                        <span className="font-bold">Apellido</span>
                        <Input ref={lastnameRef} type="text" placeholder="apellido" value={lastname} onChange={(e) => setLastname(e.target.value)} className="bg-white" />
                    </div>
                    <div></div>
                    {
                        cert && (
                            <div className="flex w-full justify-center items-center gap-1">
                                <Button onClick={(e) => requestEmail("es-MX")} variant="outline" className='cursor-pointer'>
                                    Enviar
                                    <Image src="https://royalresorts.mobi/imagesCloudPages/disclaimer/es-flag.png" width={24} height={16} alt='Flag Mex' />
                                </Button>
                            </div>
                        )
                    }
                    {
                        cert && (
                            <div className="flex w-full justify-center items-center gap-1" >
                                <Button onClick={(e) => requestEmail("en-US")} variant="outline" className='cursor-pointer'>
                                    Send
                                    <Image src="https://royalresorts.mobi/imagesCloudPages/disclaimer/en-flag.png" width={24} height={16} alt='Flag Mex' />
                                </Button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export { CertificateForm }