import { PieceJointes } from "./pieceJointes";

export class Diplome {
    id !: number;
    dipNom !: string;
    dipDateObtention !: Date
//filename !: File
    isDeleted : boolean = false
    pieceJointes !: PieceJointes;
}