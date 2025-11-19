import { PieceJointes } from "src/app/back-office/carrieres/models/dossier-agent/pieceJointes"
import { UserDTOs } from "src/app/models/UserDTOs"

export class Permutation{

   id !: number 
   matriculeUtilisateur1 !: string
   matriculeUtilisateur2 !: string
   datePermutation !: Date
   motifPermutation !: string
   motifModification !: string
   motifRejet !: string
}

export class StatusPermutation{

   id !: number 
   code !: string
   libelle !: string
   
}

export class TraitementPermutation{
   statut !: StatusPermutation
   motif !: string
   dateTraitementMutation !: Date
   bordereauValidation !: PieceJointes
}

export class PermutationDTO{

   id !: number 
   utilisateur1 !: UserDTOs
   utilisateur2 !: UserDTOs
   datePermutation !: Date
   motifPermutation !: string
   traitementPermutation !: TraitementPermutation
}