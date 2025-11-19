import { DisciplineQuantum } from "../../fiche-etablissement/models/DisciplineQuantum";

export class ClasseDisciplinesForProf {
    nomClasse !:string;
    disciplineQuantum : DisciplineQuantum[] = [];
}