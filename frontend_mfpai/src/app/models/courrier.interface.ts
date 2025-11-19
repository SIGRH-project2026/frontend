// import { TypeDemandeCourrier } from './TypeDemandeCourrier';
// import { Direction } from './Direction';
// import { Division } from './Division';
// import { Services } from './Services';
// import { Bureau } from './Bureau';

export interface CourrierResponse {
    id: number;
    reference: string;
    createdAt: Date;
    typeDemande: TypeDemandeCourrier;
    direction: Direction;
    division: Division;
    bureau: Bureau;
    statut: string;
    otherField: string;
    nomTypeCourrier: string;
}

export enum NomTypeCourrier {
    ENTRANT,
    SORTANT
    // Define enum values based on the possible values of NomTypeCourrier in Java
}



export interface TypeDemandeCourrier {
    id: number;
    code: string;
    libelle: string;
    nomTypeCourrier: string; // Vous devrez définir le type approprié ici
    isDeleted: boolean;
    division: Division;
}

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
