import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "../shared/models/utils/response-api.model";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
/**
 * SERVICE POUR LA GESTION DES CAMPAGNE
 */
export class ParametreService {


    constructor(private _http: HttpClient) {
    }

    // url = 'http://localhost:9080/api/v1/mfpai/campagne/'
    url = `${environment.apiUrl}` + "pta/parametre/"

    findParametre(id: string):Observable<ResponseApi>{
        return this._http.get(this.url+"find/"+id);
    }

    getParametre(id: number):Observable<ResponseApi>{
        return this._http.get(this.url+"findOne/"+id);
    }

    saveParametre(parametre: any): Observable<ResponseApi>{
        return this._http.post(this.url+"add", parametre);
    }

    editParametre(parametre: any, id: string): Observable<ResponseApi>{
        return this._http.post(this.url+"edit/"+id, parametre);
    }

    enableOrDisableParametre(id: string):Observable<ResponseApi>{
        return this._http.get(this.url+"activer-ou-desactiver/"+id);
    }

    getAllParametre(page: number,size: number, filter: string, numero: string, libelle: string, date: string,responsableActivite: string, statut: string, divisions: string):Observable<ResponseApi>{
        return this._http.get(this.url+"all?page="+page+"&size="+size+"&filter="+filter+"&numero="+numero+"&libelle="+libelle+"&date="+date+"&responsableActivite="+responsableActivite+"&statut="+statut+"&divisions="+divisions);
    }



    getIndicateurs = (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.url}indicateurs`);






}