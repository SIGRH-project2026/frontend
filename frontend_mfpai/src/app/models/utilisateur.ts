export interface Utilisateur {
  nom: string;
  prenom: string;
  email: string;
  situationMatrimoniale: string;
  telephone: string;
  adresse: string;
  matricule?: string;
  sexe: string;
  profils: Profil[];
  corpsGrade: CorpsGrade;
  grade: Grade;
  fonction: Fonction;
  status: boolean;
  dateDEntree: Date;
  region: Region;
  matriculeFonctionnaire: string;
  matriculeContratuel: string;
  cni: string;
  nationalite: string;
  typeMatricule: TypeMatricule;
  dateCorp: string;
  dateDEntreeFonctionPub: string;
  dateEntreService: string;
  diplomePROF: DiplomeProf;
  diplomePED: DiplomePed;
  diplomeACA: DiplomeAca;
  typePoste: TypePoste;
  nombreEnfants: number;
  lieuDeNaissance: string;
  dateNaissance: string;
  id: number;

  matriculeVacataire: string;
  matriculeDecisionnaire: string;

  firstLog: boolean;
}

export interface Grade {
  id: number;
  code: string;
  label: string;
  corpsGrade: CorpsGrade;
}

export interface CentralLevel extends Utilisateur {
  division: Division;
  service: Service;
  bureau: Bureau;
  direction: Direction;
  speciality: Speciality;
  region: Region;
  // dateEntreEtablissement: string
  dateEntreEnseignement: string;

  dateDEntreeFonctionPub: string;

  isArchived: boolean;
}

export interface Deconected extends Utilisateur {
  region: Region;
  speciality: Speciality;
  ia: Ia;
  eefMinistere: EEFMinistere;
  structure: Structure;
  etablissement: Etablissement;
  typeSystemeEnseignement: TypeSystemeEnseignement;

  cfp: Cfp;
  ief: Ief;
  quantumHoraire: number;
  dateEntreEnseignement: string;
  dateEntreEtablissement: string;
  dateDEntreeFonctionPub: string;
  isArchived: boolean;
}

export class CentralLevelDTO implements CentralLevel {
  id!: number;
  isArchived!: boolean;
  adresse!: string;
  bureau!: Bureau;
  corpsGrade!: CorpsGrade;
  direction!: Direction;
  division!: Division;
  email!: string;
  fonction!: Fonction;
  matricule!: string;
  nom!: string;
  prenom!: string;
  profils!: Profil[];
  service!: Service;
  sexe!: string;
  telephone!: string;
  status!: boolean;
  situationMatrimoniale!: string;
  grade!: Grade;
  region!: Region;
  dateDEntree!: Date;
  cni!: string;
  dateCorp!: string;
  dateDEntreeFonctionPub!: string;
  dateEntreEnseignement: string = "";
  speciality!: Speciality;
  diplomeACA!: DiplomeAca;
  diplomePED!: DiplomePed;
  diplomePROF!: DiplomeProf;
  matriculeContratuel!: string;
  matriculeFonctionnaire!: string;
  nationalite!: string;
  nombreEnfants!: number;
  //  quantumHoraire!: number;
  typeMatricule!: TypeMatricule;
  typePoste!: TypePoste;
  dateNaissance!: string;
  lieuDeNaissance!: string;
  matriculeDecisionnaire!: string;
  matriculeVacataire!: string;
  firstLog!: boolean;
  dateEntreService!: string;
  //dateEntreEtablissement: string
}

export class DeconectedDTO implements Deconected {
  adresse!: string;
  corpsGrade!: CorpsGrade;
  email!: string;
  fonction!: Fonction;
  matricule!: string;
  nom!: string;
  prenom!: string;
  profils!: Profil[];
  sexe!: string;
  telephone!: string;
  status!: boolean;
  cfp!: Cfp;
  etablissement!: Etablissement;
  typeSystemeEnseignement!: TypeSystemeEnseignement;
  ia!: Ia;
  ief!: Ief;
  region!: Region;
  speciality!: Speciality;
  eefMinistere!: EEFMinistere;
  id!: number;
  situationMatrimoniale!: string;
  quantumHoraire!: number;
  grade!: Grade;
  dateDEntree!: Date;
  cni!: string;
  dateCorp!: string;
  dateDEntreeFonctionPub!: string;
  dateEntreEnseignement!: string;
  dateEntreEtablissement!: string;
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
  matriculeDecisionnaire!: string;
  matriculeVacataire!: string;
  firstLog!: boolean;
  structure!: Structure;
  dateEntreService!: string;
  isArchived!: boolean;
}

export interface Profil {
  id?: number;
  code?: string;
  label?: string;
  menus: Menu[];
}

export interface Menu {
  menId: number;
  menPath: string;
  menTitle: string;
  menType: string;
  menIconType: string;
}

export interface CorpsGrade {
  id: number;
  code: string;
  label: string;
}

export interface Fonction {
  id: number;
  code: string;
  label: string;
  statut: boolean;
}

export interface Division {
  id: number;
  code: string;
  label: string;
  direction: Direction;
  statut: boolean;
}

export interface SpecialityEtablissement {
  id: number;
  specialities: Speciality[];
  etablissement: Etablissement;
  statut: boolean;
}

export interface Service {
  id: number;
  code: string;
  label: string;
}

export interface Bureau {
  id: number;
  code: string;
  label: string;
  division: Division;
  statut: boolean;
}

export interface Direction {
  id: number;
  code: string;
  label: string;
  region: Region;
  statut: boolean;
}

export interface Region {
  id: number;
  code: string;
  label: string;
}

export interface Speciality {
  id: number;
  code: string;
  label: string;
  statut: boolean;
}

export interface Ia {
  id: number;
  code: string;
  label: string;
  region: Region;
  statut: boolean;
}

export interface EEFMinistere {
  id: number;
  code: string;
  label: string;
}

export interface Structure {
  id: number;
  code: string;
  label: string;
}

export interface Etablissement {
  id: number;
  code: string;
  label: string;
  region: Region;
  statut: boolean;
  ief: Ief;
  structure: Structure;
  ia: Ia;
  typeEtablissement: Etablissement;
  typeSystemeEnseignement: TypeSystemeEnseignement;
}

export interface TypeSystemeEnseignement {
  id: number;
  code: string;
  label: string;
}

export interface Cfp {
  id: number;
  code: string;
  label: string;
}

export interface Speciality {
  id: number;
  code: string;
  label: string;
}

export interface Ief {
  id: number;
  code: string;
  label: string;
  region: Region;
  ia: Ia;
  statut: boolean;
}

export interface DiplomeProf {
  id: number;
  code: string;
  label: string;
}

export interface DiplomePed {
  id: number;
  code: string;
  label: string;
}

export interface DiplomeAca {
  id: number;
  code: string;
  label: string;
}

export interface TypePoste {
  id: number;
  code: string;
  label: string;
}

export interface TypeMatricule {
  id: number;
  code: string;
  label: string;
}

export interface ParametreCorpsGrade {
  noRef: string;
  dateParam: string;
  statut: boolean;
  corpsGrade: CorpsGrade;
  grades: Grade[];
  speciality: Speciality;
  typeMatricules: TypeMatricule;
}

export interface TypeDiplome {
  id: number;
  code: string;
  label: string;
}

export interface Diplomes {
  code: string;
  label: string;
  typeDiplome: TypeDiplome;
  id: number;
  statut: boolean;
}
