import {File} from "./demande-stage.interface";
import {UtilisateurResponseDTO} from "./utilisateur-response-dto.interface";

export interface CampagneInterface {
    id: number;
    nom: string;
    dateDebut: Date;
    dateFin: Date;
    deleted: boolean;
    cardBackground: string;
    statut: string;
    numberOfExpressionDeBesoin: number;
    pieceJoint: any;
    utilisateurResponseDTO: UtilisateurResponseDTO;

    // Add other properties as needed
}
