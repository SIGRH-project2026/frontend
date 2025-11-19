import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ResponseApi } from 'src/app/models/response-api';
import { ResponseApiData } from 'src/app/models/response-api.model'; 
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';

import { environment } from 'src/environments/environment';
import Swal from "sweetalert2";


@Injectable({
    providedIn: 'root'
})

export class ImputationOuBulletinService{

    apiUrl: string = environment.apiUrl;
    endpoint : string = 'imputation'

    constructor(private _httpClient: HttpClient) { }

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

    getAll( page: number, size: number, region: string, matricule: string, nom: string, prenom: string, date: string, typeDemande : string) {
      console.log("get all service 1");
      
        let params = new HttpParams()
                          .set('page', page.toString())
                          .set('size', size.toString())
                          .set('adresse', region.toString())
                          .set('matricule', matricule.toString())
                          .set('nom', nom.toString())
                          .set('prenom', prenom.toString())
                          .set('date', date.toString())   
/*                           .set('numeroDemande', numeroDemande.toString()) 
 */                          .set('typeDemande', typeDemande.toString())                      
                     
        return this._httpClient.get(`${this.apiUrl}${this.endpoint}/list`, {params}).pipe(
        catchError(this.handleError)
      );

    }

    getAllFromDash( page: number, size: number, region: string, matricule: string, nom: string, prenom: string, date: string, typeDemande : string) {
      console.log("get all service 1");  
        let params = new HttpParams()
                          .set('page', page.toString())
                          .set('size', size.toString())
                          .set('adresse', region.toString())
                          .set('matricule', matricule.toString())
                          .set('nom', nom.toString())
                          .set('prenom', prenom.toString())
                          .set('date', date.toString())   
/*                           .set('numeroDemande', numeroDemande.toString()) 
 */                          .set('typeDemande', typeDemande.toString())                      
                     
        return this._httpClient.get(`${this.apiUrl}${this.endpoint}/listDash`, {params}).pipe(
        catchError(this.handleError)
      );

    }

    recherche (matricule: string): Observable <ResponseApi>{
      let params = new HttpParams()
                          .set('matricule', matricule.toString())
        return this._httpClient.get<ResponseApi>(`${this.apiUrl}${this.endpoint}/recherche`, {params})
    }

    post(data: any) {
        console.log("Service Add Imputation #### ",data)
        return this._httpClient.post(`${this.apiUrl}${this.endpoint}/add`, data).pipe(
          catchError(this.handleError)
        );
    }
    get(id: number){
        return this._httpClient.get(`${this.apiUrl}${this.endpoint}/imputation/${id}`).pipe(
        catchError(this.handleError)
        );
    }

    delete  (id: number){
        return this._httpClient.delete(`${this.apiUrl}${this.endpoint}/imputation/${id}`).pipe(
        catchError(this.handleError)
      );
    }

    generate  (id: number){
      return this._httpClient.get(`${this.apiUrl}${this.endpoint}/generate/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  indicateurImputationEtBulletin = (codeProfile : string): Observable<ResponseApi2> =>{
    let params = new HttpParams().set('codeProfile',codeProfile);
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/indicateurs`, {params}).pipe(
      catchError(this.handleError)
    );
  }
}