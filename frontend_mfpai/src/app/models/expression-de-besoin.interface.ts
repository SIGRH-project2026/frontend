import { UtilisateurResponseDTO } from './utilisateur-response-dto.interface';
import {CampagneInterface} from "./campagne.interface";

export interface ExpressionDeBesoinInterface {
    id: number;
    besoin: string;
    date: string; // Assuming date is a string representation of a date
    motif: string;
    reference: string;
    statut: string;
    utilisateurResponseDTO: UtilisateurResponseDTO;
    campagneResponseDTO: CampagneInterface;
    themeProvisoire: string;
}
