import {
    Bureau,
    CentralLevel,
    Cfp,
    CorpsGrade,
    Deconected, DiplomeAca, DiplomePed, DiplomeProf,
    Direction,
    Division,
    Etablissement,
    Fonction,
    Grade,
    Ia,
    Ief,
    Profil,
    Region,
    Service,
    Speciality,
    EEFMinistere, TypeMatricule, TypePoste,
    Utilisateur, Structure
} from "./utilisateur";

export class UserDTOs implements Utilisateur, CentralLevel, Deconected{
    isArchived !: boolean;
    nom !: string
    prenom !: string
    email !: string
    telephone !: string
    adresse !: string
    matricule !: string
    sexe !: string
    profils !: Profil[]
    corpsGrade !: CorpsGrade
    fonction !: Fonction
    status !: boolean
    division !: Division
    service !: Service
    bureau !: Bureau
    direction !: Direction
    region !: Region;
    speciality !: Speciality;
    ia !: Ia;
    eefMinistere!: EEFMinistere;
    etablissement !: Etablissement;
    cfp !: Cfp;
    ief !: Ief
    situationMatrimoniale!: string;
    dateDEntree!: Date;
    grade!: Grade;
    quantumHoraire!: number;
    id!: number;
    typeUser!: string
    cni!: string;
    dateCorp!: string;
    dateDEntreeFonctionPub!: string;
    dateEntreEnseignement!: string;
    diplomeACA!: DiplomeAca;
    diplomePED!: DiplomePed;
    diplomePROF!: DiplomeProf;
    matriculeContratuel!: string;
    matriculeFonctionnaire!: string;
    nationalite!: string;
    nombreEnfants!: number;
    typeMatricule!: TypeMatricule;
    typePoste!: TypePoste;
    dateNaissance!: string;
    lieuDeNaissance!: string;
    dateEntreEtablissement!: string;
    matriculeDecisionnaire!: string;
    matriculeVacataire!: string;
    firstLog!: boolean;
    structure!: Structure;
    dateEntreService!: string;
}
