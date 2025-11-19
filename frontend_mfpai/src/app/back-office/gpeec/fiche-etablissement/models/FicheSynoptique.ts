import { DeconectedDTO } from "src/app/models/utilisateur";
import { FiliereDiscipline } from "./FiliereDiscipline";
import { ClasseProfDiscipline } from "./ClasseProfDiscipline";
import { TypeEtablissement } from "./TypeEtablissement";

export class FicheSynoptique{
    id !: number;
    chefEtablissemnt !: DeconectedDTO;
    filiereDisciplines : FiliereDiscipline[] = []
    classeProfDisciplines : ClasseProfDiscipline[] = []
    formationProfessionels : TypeEtablissement[] = []
    serieNiveauDisciplines : FiliereDiscipline[] = []
    serieClasseProfDisciplines : ClasseProfDiscipline[] = []

    userId !: number

}