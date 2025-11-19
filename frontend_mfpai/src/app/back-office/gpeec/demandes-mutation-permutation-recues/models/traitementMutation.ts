import { UserDTOs } from "src/app/models/UserDTOs";
import { StatutMutation } from "./statutMutation";

export class TraitementMutation{
    id !: number
    traiteur !: UserDTOs;
    statut !: StatutMutation
    dateTraitementMutation !: Date
    motif !: string
    codeStatutMutation !: string
    idTraiteur !: number
}