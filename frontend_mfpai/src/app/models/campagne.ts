export interface Campagne {
    id: number;
    nom: string;
    dateDebut: Date;
    dateFin: Date;
    deleted: boolean;
    cardBackground: string;
    statut: string;
    numberOfExpressionDeBesoin: number;
    // Add other properties as needed
}
