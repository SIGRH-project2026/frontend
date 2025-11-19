import {Bureau, Direction, Division, Service} from "./utilisateur";

export interface DemandeStage {
    id: number;
    numero: string;
    prenomDemandeur: string;
    nomDemandeur: string;
    dateNaissance: string;
    lieuDeNaissance: string;
    mail: string;
    tel: string;
    adresse: string;
    objet: string;
    niveauScolaire:NiveauScolaire;
    disciplineStage: string;
    direction:Direction;
    division: Division ;
    bureau: Bureau;
    service: Service
    dateDebut: string;
    dateFin: string;
    commentaire: string;
    statutDemandeStage: StatutDemandeStage
    justificatfs: File[];
    justificatfsAuthorisationStage: File[];
    haveRapport: boolean;
    haveAttestation: boolean;
    haveAuthorisationStage: boolean;
    rapportStageResponse: RapportStage;
    attestationStageResponse: AttestionStage;
}

export  interface NiveauScolaire {
    id: number;
    code: string;
    libelle: string;
    deleted: boolean;
}


export interface Discipline {
    id: number;
    code: string;
    libelle: string;
    deleted: boolean;
}

export interface StatutDemandeStage {
    id: number;
    code: string;
    libelle: string;
    isDeleted: boolean;
}

export interface File {
    id: number;
    originalName: string;
    generatedName: string;
    fileCode: string;
    downloadUrl: string;
    fileType: string;
    fileSize: number;
    idAppartenance: number;
}

export interface RapportStage {
    id: number;
    piecesJoint: File;
    commentaire: string;
}

export interface AttestionStage {
    id: number;
    piecesJoint: File;
    commentaire: string;
}