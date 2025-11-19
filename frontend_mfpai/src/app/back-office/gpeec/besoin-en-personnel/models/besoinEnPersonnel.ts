import { CorpsGrade, Etablissement, Grade, Ia, Ief, Region, Utilisateur } from "src/app/models/utilisateur";

import { StatutBEP } from "./statutBEP";
import { UserDTOs } from "src/app/models/UserDTOs";
import { BEPFiliereDiscipline } from "./BEPFiliereDiscipline";

export class BesoinEnPersonnel{
     id !: number
     utilisateur : UserDTOs = new UserDTOs
     nbrPersonne!: number;
     commentaire!: string;
     bepFiliereDisciplines : BEPFiliereDiscipline[] = []
     statut !: StatutBEP
     userId!: number;
     etablissement !: Etablissement
     ia !: Ia
     ief !: Ief
     region !: Region
     annee !: string
     corps !: CorpsGrade
     grade !: Grade
     deficit !: number

}

