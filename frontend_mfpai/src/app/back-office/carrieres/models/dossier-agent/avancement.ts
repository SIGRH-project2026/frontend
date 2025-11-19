import { PieceJointes } from "./pieceJointes";

export class Avancement{
    id !: number
    datePriseService !: Date
    posteOccupe !: string
    ordreService !: string
    isDeleted : boolean = false
    pieceJointes !: PieceJointes

}