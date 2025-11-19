import { DeconectedDTO } from "src/app/models/utilisateur"
import { Discipline } from "./Discipline"
import { DisciplineQuantum } from "./DisciplineQuantum"

export class ProfDiscipline{
    id !: number;
    professeur !: DeconectedDTO
    disciplineQuantums : DisciplineQuantum [] = []
}