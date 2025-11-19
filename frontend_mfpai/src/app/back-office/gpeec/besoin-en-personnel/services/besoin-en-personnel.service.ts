import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { environment } from 'src/environments/environment';
import {  BesoinEnPersonnel } from '../models/besoinEnPersonnel';

@Injectable({
  providedIn: 'root'
})
export class BesoinEnPersonnelService {

  apiUrl: string = environment.apiUrl;
  endpoint : string = 'besoinEnPersonnel'

  constructor(private _httpClient: HttpClient) { }

  getAll = (userId: number, page: number, size: number, matricule: string, statut :string, etablissement : string,
            region : string, ia : string, ief : string, prenom : string, nom : string, reference : number): Observable<ResponseApi2> =>{
    let params = new HttpParams()
                      .set('page', page.toString())
                      .set('size', size.toString())
                      .set('matricule', matricule)
                      .set('statut', statut)
                      .set('etablissement', etablissement)
                      .set('region', region)
                      .set('ia', ia)
                      .set('ief', ief)
                      .set('prenom', prenom)
                      .set('nom', nom)
                      .set('reference', reference.toString())
                      ;
   
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/list/${userId}`, {params}).pipe(
    catchError(this.handleError)
  );
}
post = (data: BesoinEnPersonnel): Observable<ResponseApi2> => {
  return this._httpClient.post(`${this.apiUrl}${this.endpoint}/create`, data).pipe(
    catchError(this.handleError)
  );
}
get = (idBEP: number): Observable<ResponseApi2> =>{
  return this._httpClient.get(`${this.apiUrl}${this.endpoint}/getone/${idBEP}`).pipe(
  catchError(this.handleError)
);
}

indicateur = (profileCode : string): Observable<ResponseApi2> =>{
let params = new HttpParams()
            .set('profileCode', profileCode);

return this._httpClient.get(`${this.apiUrl}${this.endpoint}/indicateur`, {params}).pipe(
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
