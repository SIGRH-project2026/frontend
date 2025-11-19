import {Direction, Fonction, Service} from "./utilisateur";

export interface UtilisateurResponseDTO {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    adresse: string;
    matricule: string;
    telephone: string;
    sexe: string;
    fonction: Fonction;
    service: Service;
    direction: Direction;
    canShowPiecesJointe: boolean
    profils: any[]; // Define a separate interface for profiles if needed
}
