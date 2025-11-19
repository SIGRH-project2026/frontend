import { Discipline } from "../../fiche-etablissement/models/Discipline";

export class BesoinEnNombreDiscipline {
    id : number | undefined;
    discipline !: Discipline
    nombreDePersonne !: number
}