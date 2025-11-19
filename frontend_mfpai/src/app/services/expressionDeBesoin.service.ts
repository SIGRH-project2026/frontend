import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "../shared/models/utils/response-api.model";
import {environment} from "../../environments/environment";
import {EspressionDeBesionRequestDTO} from "../models/espressionDeBesionRequestDTO";

@Injectable({
    providedIn: 'root'
})
export class ExpressionDeBesoinService {

    constructor(private _http: HttpClient) {}
    // url = 'http://localhost:9080/api/v1/mfpai/campagne/'
    url = `${environment.apiUrl}`+"expressionDeBesoin/"

    // getAll(page: number, size: number, filterValue: string, nom: string, dateDebut: string, dateFin: string):Observable<ResponseApi>{
    //
    //
    //     return this._http.get(this.url+"all?page="+page+"&size="+size+"&filter="+filterValue+"&nom="+nom+"&dateDebut="+dateDebut+"&dateFin="+dateFin);
    // }

    saveCampagne(expressionDeBesoin: EspressionDeBesionRequestDTO, id: string | null | undefined):Observable<ResponseApi>{
        return this._http.post(this.url+"add/"+id, expressionDeBesoin)
    }


    //
    traiterExpressionDeBesoins(ids: string): Observable<ResponseApi>{

        return this._http.get(this.url+"traiterExpressionDeBesoins/"+ids)
    }

    getExpressionDeBesoin(id: string | null): Observable<ResponseApi>{
        return this._http.get(this.url+"get/"+id)
    }
    //
    // startCampagne(id: number):Observable<ResponseApi>{
    //     return this._http.get(this.url+"start/"+id)
    // }
    //
    // stopCampagne(id: number):Observable<ResponseApi>{
    //     return this._http.get(this.url+"stop/"+id)
    // }



}
