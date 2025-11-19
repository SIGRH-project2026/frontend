

export interface Direction {
    id: number;
    code: string;
    label: string;
}

export interface Division {
    id: number;
    code: string;
    label: string;
    direction: Direction;
}

export interface Service {
    id: number;
    code: string;
    label: string;
    direction: Direction;
}

export interface Bureau {
    id: number;
    code: string;
    label: string;
    division: Division;
}


export interface Demande {
    id: number;
    code: string;
    libelle: string;
    nomTypeCourrier: NomTypeCourrier;
    isDeleted: boolean;
    division: Division;
}

export enum NomTypeCourrier {
    ENTRANT,
    SORTANT
    // Define enum values based on the possible values of NomTypeCourrier in Java
}
