import { ActeDTO } from "../../carrieres/mes-demandes/components/models/ActeDTO"

export class IndicateurActe{
    countValid !: number
    countValidAA !: number
    countValidAG !: number
    countReject !: number
    countRejectAA !: number
    countRejectAG !: number
    countInProcess!:number
    countInProcessAA!:number
    countInProcessAG!:number
    countStem!:number
    countSdef!:number
    sum !: number
    sumAA !: number
    sumAG !: number
    listInProcess:ActeDTO[]=[]
}