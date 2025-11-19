import { Filiere } from "../../besoin-en-personnel/models/filiere";
import { DisciplineQuantum } from "./DisciplineQuantum";
import { Niveau } from "./Niveau";
import { Serie } from "./Serie";

export class FiliereDiscipline{
    id !: number;
    filiere !: Filiere
    serie !: Serie
    niveau !: Niveau
    disciplineQuantums : DisciplineQuantum [] = []
    quantum !: number

}
