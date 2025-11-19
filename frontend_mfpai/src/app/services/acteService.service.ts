import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ResponseApi} from "../models/response-api";
import {catchError, Observable, throwError} from "rxjs";
import {ResponseApiData} from "../models/response-api.model";
import Swal from "sweetalert2";
import { ActeDTO } from '../back-office/carrieres/mes-demandes/components/models/ActeDTO';
import { ResponseApi2 } from '../shared/models/ResponseApi';

@Injectable({
  providedIn: 'root'
})
export class ActeService {
  apiUrl: string = environment.apiUrl;
  endpoint : string = 'actes'
  headers= new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  });
  constructor(private _httpClient: HttpClient) { }
    
 /*  getAll = (): Observable<ResponseApi2> =>{
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/list`)
  }
 */
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

  create = (demandeActe: ActeDTO): Observable<ResponseApi2> => {
    return this._httpClient.post(`${this.apiUrl}${this.endpoint}/create`, demandeActe).pipe(
      catchError(this.handleError)
    );
  }

  getActe= (id:number):Observable<ResponseApi2>=>  {
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/getOne/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getTypeActe= (id:number):Observable<ResponseApi2>=>  {
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/getType/${id}`).pipe(
      catchError(this.handleError)
    );
  }
/*   editActe=(id:number,acte:ActeDTO):Observable<ResponseApi2>=>  {
    return this._httpClient.post(`${this.apiUrl}${this.endpoint}/updateActe/${id}`,acte).pipe(
      catchError(this.handleError)
    );
  } */

  mofidierActe= (id:number,idAgent:number):Observable<ResponseApi2>=>  {
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/aModifier/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  editActe = (idActe: number, data :  ActeDTO): Observable<ResponseApi2> =>{
    return this._httpClient.patch(`${this.apiUrl}${this.endpoint}/updateActe/${idActe}`,data ).pipe(
    catchError(this.handleError)
  );}

/*   envoyerFP= (id:number,idAgent:number):Observable<ResponseApi2>=>  {
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/envoyerFP/${id}/${idAgent}`).pipe(
      catchError(this.handleError)
    );
  } */

  aEnvoyerFP= (actes:number[],idAgent:number):Observable<ResponseApi2>=>  {
    return this._httpClient.post(`${this.apiUrl}${this.endpoint}/envoyerFP/${idAgent}`,actes).pipe(
      catchError(this.handleError)
    );
  }

  traiterActe= (id:number,idAgent:number,traitement:string,motifModification:string,motifRejet:string):Observable<ResponseApi2>=>  {
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/traiterActe/${id}/${idAgent}?motifModification=${motifModification}&motifRejet=${motifRejet}/&traitement=${traitement}`).pipe(
      catchError(this.handleError)
    );
  }

  valider= (id:number,idAgent:number,date:string):Observable<ResponseApi2>=>  {
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/valider/${id}/${idAgent}?date=${date}`).pipe(
      catchError(this.handleError)
    );
  }

  validerCen= (id:number,idAgent:number, validesActesDate : any):Observable<ResponseApi2>=>  {
    return this._httpClient.patch(`${this.apiUrl}${this.endpoint}/validerCen/${id}/${idAgent}`, validesActesDate).pipe(
      catchError(this.handleError)
    );
  }
  validerDiv= (id:number,idAgent:number):Observable<ResponseApi2>=>  {
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/validerCenDiv/${id}/${idAgent}`).pipe(
      catchError(this.handleError)
    );
  }

  getOneUser(idUser : number): Observable<ResponseApiData> {
    return this._httpClient.get<ResponseApi>(`${environment.apiUrl}utilisateur/${idUser}`);
  }

  getAgentActe= (id:number):Observable<ResponseApi2>=>  {
    return this._httpClient.get(`${this.apiUrl}utilisateur/deconected/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  listActes=(page: number, size: number,typeUserId:number, reference:string,date:string,type:string,codeTypeActe:string,statut: string,matricule:string): Observable<ResponseApi2>=>{
    //console.log({endpoint:this.apiUrl+this.endpoint})

    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/listActes?page=${page}&size=${size}&reference=${reference}&typeUserId=${typeUserId}&date=${date}&type=${type}&codeTypeActe=${codeTypeActe}&statut=${statut}&matricule=${matricule}`).pipe(
      catchError(this.handleError)
    );
  }

  listActesInProcess=(page: number, size: number,typeUserId:number, reference:string,date:string,codeTypeActe:string,type:string,matricule:string): Observable<ResponseApi2>=>{
    //console.log({endpoint:this.apiUrl+this.endpoint})

    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/listActesInProcess?page=${page}&size=${size}&reference=${reference}&typeUserId=${typeUserId}&date=${date}&type=${type}&codeTypeActe=${codeTypeActe}&matricule=${matricule}`).pipe(
      catchError(this.handleError)
    );
  }

  listAA=(): Observable<ResponseApi2>=>{
    //console.log({endpoint:this.apiUrl+this.endpoint})

    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/listActesAA`).pipe(
      catchError(this.handleError)
    );
  }

  listAG=(): Observable<ResponseApi2>=>{
    //console.log({endpoint:this.apiUrl+this.endpoint})

    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/listActesAG`).pipe(
      catchError(this.handleError)
    );
  }

/*   filtreAvance=(page: number, size: number, reference: string,date:Date,typeActe:string): Observable<ResponseApi2>=>{
    console.log({endpoint:this.apiUrl+this.endpoint})
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/listFiltree?page=${page}&size=${size}&reference=${reference}&date=${date}type=${typeActe}`).pipe(
      catchError(this.handleError)
    );
  } */
/* 
  ListDemandeActe(page: number, size: string, filter: string): Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(`${environment.apiUrl}actes/listActes?page=${page}&size=${size}&filter=${filter}`);
  }

  ListDemandeActes(page: number, size: number, statut: string,type:string): Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(`${environment.apiUrl}actes/listActes?page=${page}&size=${size}&statut=${statut}&type=${type}`);
  }


  getActe(id:number):Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(`${environment.apiUrl}actes/getOne/${id}`);
  }

  telechargerActe(id:number):Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(`${environment.apiUrl}actes/telechargerActe/${id}`);
}

  traiterActe(id:number,idResponsable:number):Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(`${environment.apiUrl}actes/traiterActe?responsable=${idResponsable}/${id}`);
}

deleteActe(id:number):Observable<ResponseApiData> {
  return this._http.get<ResponseApi>(`${environment.apiUrl}actes/deleteActe/${id}`);

} 
 */


private handleError(error: HttpErrorResponse) {
  if (error.status === 0) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(
      `Backend returned code ${error.status}, body was: `, error.error);
  }
  // Return an observable with a user-facing error message.
  return throwError(() => new Error(`Something bad happened; please try again later`));
}



// From ak

  listActesSortie=(page: number, size: number,code: string, filter: string, type: string): Observable<ResponseApi2>=>{
   //console.log(`${this.apiUrl}${this.endpoint}/soties/listActesPage/${code}?page=${page}&size=${size}&filter=${filter}&type=${type}`)
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/soties/listActesPage/${code}?page=${page}&size=${size}&filter=${filter}&type=${type}`).pipe(
        catchError(this.handleError)
    );
  }

  listActesSortieTemp=(page: number, size: number, filter: string, type: string): Observable<ResponseApi2>=>{
    //console.log(`${this.apiUrl}${this.endpoint}/soties/listActesPage/${code}?page=${page}&size=${size}&filter=${filter}&type=${type}`)
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/soties/listActesBisPage?page=${page}&size=${size}&filter=${filter}&type=${type}`).pipe(
        catchError(this.handleError)
    );
  }

  statActes = (codeProfile : string,codeTypeActe:string): Observable<ResponseApi2> =>{
    let params = new HttpParams().set('codeProfile',codeProfile);
    params = params.append('codeTypeActe', codeTypeActe);
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/statistiques?codeProfile=${codeProfile}&codeTypeActe=${codeTypeActe}`).pipe(
      catchError(this.handleError)
    );
  }
  
  listTypeActe = ():Observable<ResponseApi2>=>  {
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/getTypeActe`).pipe(
      catchError(this.handleError)
    );
  }


}