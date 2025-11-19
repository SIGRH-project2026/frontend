import {Bureau, Division} from "./utilisateur";

export interface ParametreResponse {
    id: number;
    libelle: string;
    responsableActivite: string;
    bureaux: Bureau[];
    divisions: Division[];
    statut: string;
    numero: string;
    date: Date;
    listDivisions: string
}
