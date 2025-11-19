import { UserDTOs } from "src/app/models/UserDTOs"
import { PieceJointes } from "./pieceJointes"

export class Imputation{
    numeroDemande !: number
    utilisateur !: UserDTOs
    justificatifs !: PieceJointes[]
    dateImputation !: Date
    statusBeneficiere !: string
    prenomBeneficiere !: string
    nomBeneficiere !: string
    typeDemande !: string
    id !: number
    imputationGeneree !: string
}

export class ImputationDTO{
    numeroDemande !: number
    utilisateurId !: number
    justificatifs !: PieceJointes[]
    dateImputation !: Date
    statusBeneficiere !: string
    prenomBeneficiere !: string
    nomBeneficiere !: string
    typeDemande !: string
    id !: number
    utilisateur !: UserDTOs
    imputationGeneree !: string
}