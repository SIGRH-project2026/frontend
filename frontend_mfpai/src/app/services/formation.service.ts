import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

import {environment} from "../../environments/environment";
import {ResponseApi} from "../models/response-api";
import {ResponseApiData} from "../models/response-api.model";

@Injectable({
    providedIn: 'root'
})
/**
 * SERVICE POUR LA GESTION DES CAMPAGNE
 */
export class FormationService {

    constructor(private _http: HttpClient) {}
    // url = 'http://localhost:9080/api/v1/mfpai/campagne/'
    url = `${environment.apiUrl}`+"api/"

    getAllParticipant(): Observable<ResponseApi> {
        return this._http.get<ResponseApi>(`${this.url}participations/all`)
    }

    getAllParticipationsByFormation(idForm: number): Observable<ResponseApi> {
        return this._http.get<ResponseApi>(`${this.url}participations/byFormation/${idForm}`)
    }

    getMesFormations(page: number, size: number, filter: string): Observable<ResponseApiData> {
        return this._http.get<ResponseApiData>(`${this.url}formations/pages/formations?page=${page}&size=${size}&filter=${filter}`)
    }

    getOffres(idForm: number): Observable<ResponseApi> {
        return this._http.get<ResponseApi>(`${this.url}offreTechniqueFinanciere/by-formation/${idForm}`)
    }

    participer(data: any): Observable<any> {
        return this._http.post<any>(`${this.url}participations/add`, data, {headers: {}})
    }

    getFormations(ref: any): Observable<ResponseApi> {
        return this._http.get<ResponseApi>(`${this.url}formations/reference/${ref}`)
    }

    getFormation(id: any): Observable<ResponseApi> {
        return this._http.get<ResponseApi>(`${this.url}formations/${id}`)
    }

    getConvocationFormation(idFormation: any): Observable<ResponseApi> {
        return this._http.get<ResponseApi>(`${this.url}convocations/${idFormation}`)
    }

    getParticipantByFormation(idFormation: any): Observable<ResponseApi> {
        return this._http.get<ResponseApi>(`${this.url}participants/formation/${idFormation}`)
    }

    getPvExamenByFormation(idFormation: any): Observable<ResponseApi> {
        return this._http.get<ResponseApi>(`${this.url}pvexamens/${idFormation}`)
    }

    getRapportByFormation(idFormation: any): Observable<ResponseApi> {
        return this._http.get<ResponseApi>(`${this.url}rapports/by-formation/${idFormation}`)
    }

    getPlanningByFormation(idFormation: any): Observable<ResponseApi> {
        return this._http.get<ResponseApi>(`${this.url}planningformation/by-formation/${idFormation}`)
    }

    getSessionByFormation(idFormation: any): Observable<ResponseApi> {
        return this._http.get<ResponseApi>(`${this.url}sessions/${idFormation}`)
    }

    getTableauSuiviByFormation(idFormation: any): Observable<ResponseApi> {
        return this._http.get<ResponseApi>(`${this.url}tableauxsuivi/byFormation/${idFormation}`)
    }

    getParticipantDefinitifById(id: any): Observable<ResponseApi> {
        return this._http.get<ResponseApi>(`${this.url}tableauxsuivi/${id}`)
    }

    getParticipantDefinitifByFormation(idFormation: any): Observable<ResponseApi> {
        return this._http.get<ResponseApi>(`${this.url}participant-definitif/byFormation/${idFormation}`)
    }

    getFormationParticipeeByMatricule(matricule: any): Observable<ResponseApi> {
        return this._http.get<ResponseApi>(`${this.url}participant-definitif/byMatricule/${matricule}`)
    }
    // getFormationParticipeeByMatricule(matricule: string): Observable<ParticipantDefinitifDTO[]> {
    //     //const encodedMatricule = encodeURIComponent(matricule);
    //     const url = `${this.url}${matricule}`;
    //     return this._http.get<ParticipantDefinitifDTO[]>(url);
    //   }

    getParticipantsByMatricule(matricule: string): Observable<ResponseApi> {
        const params = new HttpParams().set('matricule', matricule);
        return this._http.get<ResponseApi>(this.url, { params });
      }

    updateParticipantDefinitif(id: number, data: Partial<ParticipantDefinitifDTO>): Observable<ParticipantDefinitifDTO> {
        return this._http.patch<ParticipantDefinitifDTO>(`${this.url}participant-definitif/${id}`, data);
      }

      // /api/formations/status-counts
    getTrainingStatusCounts(): Observable<ResponseApi> {
        return this._http.get<ResponseApi>(this.url+'formations/status-counts');
    }


}

export interface ParticipantDefinitifDTO {
    id: number;
    numeroDemande: string;
    nom: string;
    matricule: string;
    direction: string;
    division: string;
    commentaire: string;
    competences: boolean;
    admis: boolean;
    assidu: boolean;
    formation: any;
    formationId: number;
  }