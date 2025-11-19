import { DeconectedDTO } from "src/app/models/utilisateur";
import { Discipline } from "./Discipline";
import { ProfDiscipline } from "./ProfDiscipline";
import { Serie } from "./Serie";

export class SerieClasseProfDiscipline{
    id !: number;
    nomClasse !: string
    serie !: Serie
    quantum !: number
    profDiscipline : ProfDiscipline[] = []
  
}
