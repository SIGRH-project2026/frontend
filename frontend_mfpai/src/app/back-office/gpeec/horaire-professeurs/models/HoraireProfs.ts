import { DeconectedDTO } from "src/app/models/utilisateur";
import { ClasseDisciplinesForProf } from "./ClasseDisciplinesForProf";

export class HoraireProfs{
    professeur !: DeconectedDTO
    nbreClasse !: number;
    nbrDiscipline  !: number;
    heuresDispensees !: number;
    classeDisciplinesForProfs : ClasseDisciplinesForProf[] = []
}