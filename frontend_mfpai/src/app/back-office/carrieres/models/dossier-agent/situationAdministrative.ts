import { CorpsGrade } from "src/app/models/utilisateur";
import { ActeDTO } from "../../mes-demandes/components/models/ActeDTO";
import { TypeActeDTO } from "../../mes-demandes/components/models/TypeActeDTO";
import { TypeAADTO } from "../../mes-demandes/components/models/TypeAADTO ";
import { TypeAGDTO } from "../../mes-demandes/components/models/TypeAGDTO ";
import { PieceJointes } from "./pieceJointes";

export class SituationAdministrative{
    id !: number
   numeroActe !: string
   dateActe !: Date
   typeActe : TypeActeDTO = new TypeActeDTO()
   acteAA : TypeAADTO = new TypeAADTO()
   acteAG : TypeAGDTO = new TypeAGDTO()
   pieceJointes !: PieceJointes;
   isDeleted : boolean = false
    //corpsGrade  !: CorpsGrade
}

