import {Division, Utilisateur} from "../../../models/utilisateur";
import {ParametreRequest} from "../../../models/parametre-request.interface";
import {ParametreResponse} from "../../../models/parametre-response.interface";

export interface Direction {
    id: number;
    code: string;
    label: string;
}


export interface ModeCalcul {
    id: number;
    modeCalcul: string;
    frequenceProd: string;
    methodCollecte: string;
    sourceDonnees: string;
    divisions: Division[];
    subAction: SubActionPTA
}

export interface SubActionPTA {
    id: number;
    libelleSubAction: string;
    dateDebut: string;
    dateFin: string;
    budget: number;
   // cible: number;
    sourceFinancement: string;
    moyenRH: string;
    utilisateur: Utilisateur;
    modeCalcul: ModeCalcul;
    indicateur: ParametreResponse;
    resultPTA: ResultAction;
    reportRealisation:  ReportRealisation

}

export interface ReportRealisation {
    dateDebut: string
    dateFin: string
    resume: string
    cible: number
    id: number
    tauxAtteint: number
    observation: string
    subAction: SubActionPTA,
    files: File[]
}

export interface File {
    id: number
    originalName: string
    generatedName: string
    fileType: string
    fileSize: number
    idAppartenance: number
}

export interface ResultAction {
    id: number;
    libelleResultat: string;
    tauxAtteint: number;
    cible: number;
    subActionPTA: SubActionPTA[];
}

export interface ActionPTA {
    id: number;
    libelleAction: string;
    resultActions: ResultAction[];
}

export interface InitialPTA {
    id: number;
    nomPTA: string;
    date: string;
    direction: Direction;
    numeroPTA: string;
}

export interface PlanTravailAnnuel {
    id: number;
    initialPTA: InitialPTA;
    actionPTAs: ActionPTA[];
}
