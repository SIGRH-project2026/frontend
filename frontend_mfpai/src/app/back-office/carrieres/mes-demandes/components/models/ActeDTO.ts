import { UserDTOs } from "src/app/models/UserDTOs";
import { StatutActeDTO } from "./StatutActeDTO";
import { TypeActeDTO } from "./TypeActeDTO";
import { FileDTO } from "./FileDTO";
import { TypeAADTO } from "./TypeAADTO ";
import { TypeAGDTO } from "./TypeAGDTO ";
import { Direction, Division, Ia, Ief } from "src/app/models/utilisateur";
import { Bordereau } from "./Bordereau";

export class ActeDTO{
    id!: number;
    referenceActe!:string;
    idAgent!:number;
    agent!:UserDTOs;
    profilDevantTraiter!:string;
    pieceJointes:FileDTO[]=[];
    currentBordereau!:Bordereau;
    predBordereau!: Bordereau;
    typeActe!:TypeActeDTO;
    typeAA!:TypeAADTO;
    typeAG!:TypeAGDTO
    codetypeActe!:string;
    codeTypeActeAA!:string;
    codeTypeActeAG!:string;
    autreTypeActe?: string;
    typeSortie!:string;
    statutActe!:StatutActeDTO;
    dateDemandeActe!:Date;
    dateRetour!:Date;
    reference!:string;
    dateDebut!:string;
    dateFin!:string;
    commentaire!:string;
    isDeleted!:boolean;
    isActivated!:boolean;
    motifModification!:string;
    motifRejetDemande!:string;
  // codeTypeActeAG!: string;
    checked!: boolean;
    direction !: Direction
    division !: Division

    /* ia!:Ia
    ief!:Ief; */
  }
