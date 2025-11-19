export enum Statistiques {
    CompetencesProfessionnelles = "Compétences professionnelles des Formateurs/Professeurs",
    FormateursQualifies = "Formateur/Professeurs formés, qualifiés, outillés et  disponibles",
    CompetencesMisesAJour = "Compétences des Formateur/Professeurs régulièrement mises à jour à travers la formation continue",
    PersonnelEncadrement = "Personnel d'encadrement disponible en quantité suffisante",
    PersonnelAdministratif = "Personnel administratif formé sur les bonnes pratiques de gestion administrative et financière",
    RenforcementCapacites = "Renforcement des capacités des ressources humaines",
    GestionRationnelle = "Gestion rationnelle et optimale des ressources humaines de la FPTA"
}

export interface StatistiqueInfo {
    id: number;
    label: string;
    icon: string;
}