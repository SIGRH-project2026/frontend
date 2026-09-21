import { UserDTOs } from "src/app/models/UserDTOs"
import { Bureau, Direction, Division, Etablissement, Ia, Ief, Region, Service } from "src/app/models/utilisateur"
import { FileDTO } from "src/app/back-office/carrieres/mes-demandes/components/models/FileDTO"
import { TraitementMutation } from "./traitementMutation"

export class MutationDTO{
    id !: number
    commentaire !: string
    dossierSigne?: string;
    regionSouhaitee !: Region 
    iaSouhaitee !: Ia
    iefSouhaitee !: Ief
    etablissementSouhaitee !:Etablissement
    bureauSouhaite !: Bureau
    directionSouhaitee !: Direction
    divisionSouhaitee !: Division
    serviceSouhaite !: Service
    idUserdemandeur !: number
    numeroRef !: string
    demandeur !: UserDTOs
    traitementMutation !: TraitementMutation;
    dateDemande !: Date
    origineDemandeurLog !: OrigineDemandeurLog;
    destinataireType !: string
    ordreService !: string
    profilDevantTraiter !: string
    osgenerated !: boolean
    currentBordereauTransmission !: string
    pieceJointes !: FileDTO[]

}
class OrigineDemandeurLog  {
    region !: Region 
    ia !: Ia
    ief !: Ief
    etablissement !:Etablissement
    origineUserType !: string
    bureau!: Bureau
    direction !: Direction
    division !: Division
    service!: Service
}
