export interface DemandeStageRequest {
    prenomDemandeur: string;
    nomDemandeur: string;
    dateNaissance: string; // Assuming this is in ISO 8601 format (e.g., "2024-03-06")
    lieuDeNaissance: string;
    mail: string;
    tel: string;
    adresse: string;
    objet: string;
    codeNiveauScolaire: string;
    codeDiscipline: string;
    directionCode: string;
    divisionCode: string;
    serviceCode: string;
    bureauCode: string;
    dateDebut: string; // Assuming this is in ISO 8601 format (e.g., "2024-03-06")
    dateFin: string; // Assuming this is in ISO 8601 format (e.g., "2024-03-06")
    commentaire: string;
}
