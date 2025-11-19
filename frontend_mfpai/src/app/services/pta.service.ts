import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "../models/response-api";
import {environment} from "../../environments/environment";
import {ResponseApiData} from "../models/response-api.model";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class PtaService {

  headers= new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  });

  constructor(private _http: HttpClient ) { }

  showSwal(icon?: any, text?: any,) {
    Swal.fire({
      position: 'center',
      icon,
      title: 'Message!',
      text,
      confirmButtonColor: '#056db6',
      showConfirmButton: true,
    });
  }

  addInitPTA(dto: any): Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}pta/initial-plan-travail/add`;
    return this._http.post<ResponseApi>(API_URL, dto);
  }


  addAction(dto: any): Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}pta/action-pta/add`;
    return this._http.post<ResponseApi>(API_URL, dto);
  }

  updateAction(id: number, dto: any): Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}pta/action-pta/update/${id}`;
    return this._http.put<ResponseApi>(API_URL, dto);
  }


  addResult(dto: any): Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}pta/result-action/add`;
    return this._http.post<ResponseApi>(API_URL, dto);
  }


  getListPTA(page: number, size: number, filter: string, numPta: string, libelle: string, responssable: string,
             division: string, debut: string, fin: string): Observable<ResponseApiData> {


    return this._http.get<ResponseApiData>(
        `${environment.apiUrl}pta/list-pta-page?page=${page}&size=${size}&filter=${filter}&numPta=${numPta}&libelle=${libelle}&responssable=${responssable}&division=${division}&debut=${debut}&fin=${fin}`);
  }

  getPTA(idPTA: number): Observable<ResponseApi> {
    return this._http.get<ResponseApi>( `${environment.apiUrl}pta/${idPTA}`)
  }


  getResult(idResult: number): Observable<ResponseApi> {
    return this._http.get<ResponseApi>( `${environment.apiUrl}pta/result-action/${idResult}`)
  }


  getListResultForAction(page: number, size: number, idAction: number): Observable<ResponseApiData> {

    return this._http.get<ResponseApi>( `${environment.apiUrl}pta/result-action/list/${idAction}?page=${page}&size=${size}`)
  }

  getListAction(idAction: number): Observable<ResponseApi> {
    return this._http.get<ResponseApi>( `${environment.apiUrl}pta/action/list/${idAction}`)
  }





  addSubResult(dto: any):   Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}pta/action-sub-result/add`;
    return this._http.post<ResponseApi>(API_URL, dto);
  }


  updateSubResult(id: number ,dto: any):   Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}pta/action-sub-result/update/${id}`;
    return this._http.put<ResponseApi>(API_URL, dto);
  }


  getListSubAction(id: number, page: number, size: number, filter: string): Observable<ResponseApiData> {
    return this._http.get<ResponseApiData>(
        `${environment.apiUrl}pta/list-sub-action/${id}?page=${page}&size=${size}&filter=${filter}`);
  }

    updateResultat(id: number, dto: any): Observable<ResponseApi> {
      const API_URL = `${environment.apiUrl}pta/result-action/update/${id}`;
      return this._http.put<ResponseApi>(API_URL, dto);
    }

  addModeCalcul(formData: any) : Observable<ResponseApi> {
      const API_URL = `${environment.apiUrl}pta/mode-calcul/add`;
      return this._http.post<ResponseApi>(API_URL, formData);
  }


  addReport(formData: any) : Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}pta/report/add`;
    return this._http.post<ResponseApi>(API_URL, formData);
  }

  getReport(idReport: number) {
    return this._http.get<ResponseApi>( `${environment.apiUrl}pta/report/${idReport}`)
  }

  //let formParams = new FormData();


  getSubAction(idSubAction: any) {
    return this._http.get<ResponseApi>( `${environment.apiUrl}pta/action-sub-result/${idSubAction}`)
  }


  getDownloadFile(filename: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/pdf'  // ou autre type MIME du fichier que vous voulez télécharger
    });
    return this._http.get(`${environment.apiUrl}files/download?filename=${filename}`, {
      headers: headers,
      responseType: 'blob'  // Récupérer la réponse sous forme de blob
    });

  }


}
