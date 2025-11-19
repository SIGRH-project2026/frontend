import { UserDTOs } from "src/app/models/UserDTOs";
import { StatutDemandeDTO } from "./StatutDemandeDTO";
import { TypeDemandeDTO } from "./TypeDemandeDTO";
import { FileDTO } from "../../carrieres/mes-demandes/components/models/FileDTO";

export class DemandePecDTO{
    id!:number;
    numeroDemande!:string;
    dateDemande!:Date;
    lastModified!:string;
    idUtilisateur!:number;
    objetDemande!:string;
    codeTypeDemande!:string;
    pieceJointes:FileDTO[]=[];
    codecodeStatutDemande!:string;
    typeDemandePeec!:TypeDemandeDTO;
    statutPriseEnCharge!:StatutDemandeDTO
    utilisateur!:UserDTOs;
    motifRejetDemande!:string;
    motifModification!:string;

}