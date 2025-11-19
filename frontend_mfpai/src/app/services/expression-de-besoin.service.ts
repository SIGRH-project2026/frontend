import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "../shared/models/utils/response-api.model";
import {environment} from "../../environments/environment";
import {EspressionDeBesoinRequestdtoInterface} from "../models/espression-de-besoin-requestdto.interface";

@Injectable({
    providedIn: 'root'
})
export class ExpressionDeBesoinService {

    constructor(private _http: HttpClient) {}
    // url = 'http://localhost:9080/api/v1/mfpai/campagne/'
    url = `${environment.apiUrl}`+"expressionDeBesoin/"


    soumettreExpressionDeBesoin(expressionDeBesoin: EspressionDeBesoinRequestdtoInterface, id: string | null | undefined):Observable<ResponseApi>{
        return this._http.post(this.url+"soumettreExpressionDeBesoin/"+id, expressionDeBesoin)
    }

    editExpressionDeBesoin(expressionDeBesoin: EspressionDeBesoinRequestdtoInterface, id: string | null | undefined):Observable<ResponseApi>{
        return this._http.put(this.url+"editExpressionDeBesoins/"+id, expressionDeBesoin)
    }


    //
    traiterExpressionDeBesoins(ids: string, themeProvisoire: string): Observable<ResponseApi>{

        return this._http.get(this.url+"traiterExpressionDeBesoins/"+ids+"/"+themeProvisoire)
    }

    getExpressionDeBesoin(id: string | null): Observable<ResponseApi>{
        return this._http.get(this.url+"get/"+id)
    }




}
