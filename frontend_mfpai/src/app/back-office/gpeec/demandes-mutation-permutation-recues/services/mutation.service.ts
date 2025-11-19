import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { environment } from 'src/environments/environment';
import { BesoinEnPersonnel } from '../../besoin-en-personnel/models/besoinEnPersonnel';
import { MutationDTO } from '../models/mutationDTO';
import { TraitementMutation } from '../models/traitementMutation';

@Injectable({
  providedIn: 'root'
})
export class MutationService {
  apiUrl: string = environment.apiUrl;
  endpoint : string = 'mutations'

  constructor(private _httpClient: HttpClient) { }

  getAll = (userId: number, page: number, size: number, statutMutation : string,
            region : string, ia : string, ief : string, etablissement : string,
            bureau : string, direction : string, division : string, service : string,
            numeroRef : string, pourTraitement : boolean, profileConnected : string): Observable<ResponseApi2> =>{
    let params = new HttpParams()
                      .set('page', page.toString())
                      .set('size', size.toString())
                      .set('statutMutation', statutMutation)
                      .set('region', region)
                      .set('ia', ia)
                      .set('ief', ief)
                      .set('etablissement', etablissement)
                      .set('bureau', bureau)
                      .set('direction', direction)
                      .set('division', division)
                      .set('service', service)
                      .set('numeroRef', numeroRef)
                      .set('pourTraitement', pourTraitement.valueOf())
                      .set('filtre', profileConnected)
                      ;
   
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/list/${userId}`, {params}).pipe(
        catchError(this.handleError)
    );
  }
  post = (data: MutationDTO): Observable<ResponseApi2> => {
    return this._httpClient.post(`${this.apiUrl}${this.endpoint}/create`, data).pipe(
        catchError(this.handleError)
    );
  }
  get = (idMutation: number): Observable<ResponseApi2> =>{
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/getOne/${idMutation}`).pipe(
        catchError(this.handleError)
    );}

  patch = (idMutation: number, data :  MutationDTO): Observable<ResponseApi2> =>{
    return this._httpClient.patch(`${this.apiUrl}${this.endpoint}/update/${idMutation}`,data ).pipe(
        catchError(this.handleError)
    );}
  Traitement = (idMutation: number, bordereau : File, data :  TraitementMutation): Observable<ResponseApi2> =>{
    const formData = new FormData();
     formData.append('TraitementMutation', decodeURIComponent(JSON.stringify(data)));
     formData.append('bordereau', bordereau);

    return this._httpClient.patch(`${this.apiUrl}${this.endpoint}/traitement/${idMutation}`,formData ).pipe(
        catchError(this.handleError)
    );}

  TraitementValider = (idMutation: number, idTraiteur :  number, file : File ): Observable<ResponseApi2> =>{
    const formData = new FormData();
    formData.append('file', file)
    return this._httpClient.patch(`${this.apiUrl}${this.endpoint}/traitement/valider/${idMutation}/${idTraiteur}`,formData ).pipe(
        catchError(this.handleError)
    );}
  genererOS = (allMutationAccepted : boolean, idMutation: number): Observable<ResponseApi2> =>{
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/generateOS/${allMutationAccepted}/${idMutation}`).pipe(
        catchError(this.handleError)
    );}


  indicateurMutation = (codeProfile : string): Observable<ResponseApi2> =>{
    let params = new HttpParams().set('codeProfile',codeProfile);
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/indicateurs`, {params}).pipe(
      catchError(this.handleError)
    );
  }
  
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
}

