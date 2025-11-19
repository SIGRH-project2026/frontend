import {Bureau, CorpsGrade, Division, Grade, Profil, Region} from "../../models/utilisateur";
import {Direction} from "@angular/cdk/bidi";

export interface Formation {
    id: number
    typeFormation: TypeFormation
    themeFormation: ThemeFormation
    intitule: string
    reference: string
    dateDebut: string
    dateFin: string
    dateEnvoi: string
    dateReception: string
    duree: string
    prestataires: string
    cout: string
    description: string
    statutFormation: StatutFormation
    cahierCharge: CahierCharge
    effCode: string
    specialiteCode: string
    nombrePlace: number
}

export interface ThemeFormation {
    id: number
    libelle: string
    duree: string
    modalites: string
    operateur: string
    bailleur: string
    budget: string
    direction: Direction
    planFormation: PlanFormation
    profils: Profil[]
    responsableSuivi: ResponsableSuivi
}

export interface TypeFormation {
    id: number
    libelle: string
    code: string
}

export interface StatutFormation {
    id: number
    libelle: string
    code: string
}

export interface CahierCharge {
    id: number
    originalName: string
    generatedName: string
    fileSize: number
    idAppartenance: number
}
export interface StatutPlanFormation {
    id: number
    libelle: string
    code: string
    plansFormation: any
}

export interface PlanFormation {
    id: number
    reference: string
    titre: string
    commentaire: string
    dateDebut: string
    dateFin: string
    createdBy: CreatedBy
    statutPlanFormation: StatutPlanFormation
    themesFormation: any
}

export interface CreatedBy {
    createdDate: string
    lastModifiedDate: string
    id: number
    prenom: string
    nom: string
    email: string
    firstLog: boolean
    status: boolean
    telephone: string
    adresse: string
    matricule: string
    profils: any[]
    nombreEnfants: number
    isFonctionnaire: boolean
}

export interface ResponsableSuivi {
    createdBy: number
    createdDate: string
    lastModifiedBy: number
    lastModifiedDate: string
    id: number
    prenom: string
    nom: string
    email: string
    dateDEntree: string
    typeUser: string
    firstLog: boolean
    status: boolean
    telephone: string
    adresse: string
    matricule: string
    sexe: string
    situationMatrimoniale: string
    corpsGrade: CorpsGrade
    grade: Grade
    region: Region
    profils: any[]
    nombreEnfants: number
    isFonctionnaire: boolean
    bureau: Bureau
    direction: Direction
    division: Division
}
