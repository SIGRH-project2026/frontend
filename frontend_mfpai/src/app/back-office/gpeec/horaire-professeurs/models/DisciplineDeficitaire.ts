import { Etablissement } from "src/app/models/utilisateur";
import { Discipline } from "../../fiche-etablissement/models/Discipline";

export class DisciplineDeficitaire{
     discipline !: Discipline;
     totalHeuresAttribuees !: number;
     totalHeuresDispensee !: number;
     etablissement !: Etablissement
}

export class DisciplineDeficitaireAllEtablisemment{
    etablissement !: Etablissement;
    disciplineDeficitaires : DisciplineDeficitaire[] = [];
}