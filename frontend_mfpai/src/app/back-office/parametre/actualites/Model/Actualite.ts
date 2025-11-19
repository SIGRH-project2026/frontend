import { PieceJointes } from "src/app/back-office/carrieres/models/dossier-agent/pieceJointes"

export class Actualite{
    id !: number
    titre !: string
    resume !: string
    contenu !: String
    datePublication !: Date
    image !: PieceJointes
    categorieActualite !: CategorieActualite
    typeArticle !: TypeArticle
    activated !: boolean
}

export class CategorieActualite{
    id !: number
    libelle !: string
}

export class TypeArticle{
    id !: number
    libelle !: string
}