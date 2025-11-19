import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { environment } from 'src/environments/environment';
import { BesoinEnPersonnel } from '../../besoin-en-personnel/models/besoinEnPersonnel';
import { FicheSynoptique } from '../models/FicheSynoptique';
import { FiliereDiscipline } from '../models/FiliereDiscipline';
import { ClasseProfDiscipline } from '../models/ClasseProfDiscipline';

@Injectable({
  providedIn: 'root'
})
export class FicheSynoptiqueService {
  apiUrl: string = environment.apiUrl;
  endpoint : string = 'ficheSynoptique'

  constructor(private _httpClient: HttpClient) { }

post = (data: FicheSynoptique): Observable<ResponseApi2> => {
  return this._httpClient.post(`${this.apiUrl}${this.endpoint}/create`, data).pipe(
    catchError(this.handleError)
  );
}
update = (data: FicheSynoptique): Observable<ResponseApi2> => {
  return this._httpClient.post(`${this.apiUrl}${this.endpoint}/update`, data).pipe(
    catchError(this.handleError)
  );
}
get = (chefEtablissementUserId: number): Observable<ResponseApi2> =>{
  return this._httpClient.get(`${this.apiUrl}${this.endpoint}/getone/${chefEtablissementUserId}`).pipe(
  catchError(this.handleError)
);
  }
  getFicheByCodeEtab = (codeEtab: string): Observable<ResponseApi2> =>{
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/getoneByEtablissement/${codeEtab}`).pipe(
    catchError(this.handleError)
  );
  }
  getHoraireProfsByCodeEtab = (codeEtab: string, page: number, size: number, matricule: string, nomComplet :string): Observable<ResponseApi2> =>{
    let params = new HttpParams()
                      .set('page', page.toString())
                      .set('size', size.toString())
                      .set('matricule', matricule)
                      .set('nomComplet', nomComplet);
   
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/list/${codeEtab}`, {params}).pipe(
    catchError(this.handleError)
  );
}
getDisciplineAyantDeficit = (codeEtab: string, page: number, size: number, disciplineName: string): Observable<ResponseApi2> =>{
  let params = new HttpParams()
                    .set('page', page.toString())
                    .set('size', size.toString())
                    .set('disciplineName', disciplineName);
 
  return this._httpClient.get(`${this.apiUrl}${this.endpoint}/listDeficitaire/${codeEtab}`, {params}).pipe(
  catchError(this.handleError)
);
}
getDisciplineAyantDeficitEtab = (page: number, size: number, disciplineName: string): Observable<ResponseApi2> =>{
  let params = new HttpParams()
                    .set('page', page.toString())
                    .set('size', size.toString())
                    .set('disciplineName', disciplineName);
 
  return this._httpClient.get(`${this.apiUrl}${this.endpoint}/listDeficitaireAllEtab`, {params}).pipe(
  catchError(this.handleError)
);
}
addFiliere = (idFiche : number, data: FiliereDiscipline[]): Observable<ResponseApi2> => {
  return this._httpClient.patch(`${this.apiUrl}${this.endpoint}/addFiliere/${idFiche}`, data).pipe(
    catchError(this.handleError)
  );
}
addSerie = (idFiche : number, data: FiliereDiscipline[]): Observable<ResponseApi2> => {
  return this._httpClient.patch(`${this.apiUrl}${this.endpoint}/addSerie/${idFiche}`, data).pipe(
    catchError(this.handleError)
  );
}
addClasse = (idFiche : number , data: ClasseProfDiscipline[]): Observable<ResponseApi2> => {
  return this._httpClient.patch(`${this.apiUrl}${this.endpoint}/addClasse/${idFiche}`, data).pipe(
    catchError(this.handleError)
  );
}
addClasseSerie = (idFiche : number , data: ClasseProfDiscipline[]): Observable<ResponseApi2> => {
  return this._httpClient.patch(`${this.apiUrl}${this.endpoint}/addClasseSerie/${idFiche}`, data).pipe(
    catchError(this.handleError)
  );
}
getEtablissementHoraire = (codeEtab: string): Observable<ResponseApi2> =>{
  return this._httpClient.get(`${this.apiUrl}${this.endpoint}/etabDeficitaire/${codeEtab}`).pipe(
  catchError(this.handleError)
);
}
listEtablissementAyantDeficitSurUneDiscipline = (page : number, size : number, idDiscipline: number): Observable<ResponseApi2> =>{
      let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  return this._httpClient.get(`${this.apiUrl}${this.endpoint}/deficitSurUneDiscipline/${idDiscipline}`, {params}).pipe(
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
