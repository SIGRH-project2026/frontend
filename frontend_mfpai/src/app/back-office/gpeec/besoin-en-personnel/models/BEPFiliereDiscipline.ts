import { BesoinEnNombreDiscipline } from "./BesoinEnNombreDiscipline";
import { Filiere } from "./filiere";

export class BEPFiliereDiscipline {
    id : number | undefined;
    filiere !: Filiere
    besoinEnNombreDisciplines : BesoinEnNombreDiscipline[] = []
    

}