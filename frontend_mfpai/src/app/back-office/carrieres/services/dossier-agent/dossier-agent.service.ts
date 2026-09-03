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
export class DossierAgentService {

  apiUrl: string = environment.apiUrl;
  endpoint : string = 'dossieragent'
  

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

  getAllDipList(){
    return this._httpClient.get(`${this.apiUrl}diplomeList/list`).pipe(
      catchError(this.handleError)
    );
  }

  getDiplomes(matricule:string, page : number , size : number){
    let params = new HttpParams()
                      .set('page', page.toString())
                      .set('size', size.toString())
                      .set('matricule', matricule.toString())

    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/dossier/diplomes/${matricule}`, {params}).pipe(
      catchError(this.handleError)
    )
  }

  getAvancements(matricule : string,  page : number , size : number){
    console.log("le matricule ", matricule);
    
    
    let params = new HttpParams()
                      .set('page', page.toString())
                      .set('size', size.toString())
                      .set('matricule', matricule.toString())
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/dossier/avancements`, {params}).pipe(
      catchError(this.handleError)
    )
  }


  getAllCorpsGradeList(){
    return this._httpClient.get(`${this.apiUrl}static/corpsgrade`).pipe(
      catchError(this.handleError)
    );
  }

  getAll  ( page: number, size: number, adresse: string, matricule: string, nom: string, prenom: string ) {
    let params = new HttpParams()
                      .set('page', page.toString())
                      .set('size', size.toString())
                      .set('adresse', adresse.toString())
                      .set('matricule', matricule.toString())
                      .set('nom', nom.toString())
                      .set('prenom', prenom.toString())
                    
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/dossier/list`, {params}).pipe(
    catchError(this.handleError)
  );
} 
post  (data: any) {
  console.log("Service Add #### ",data)
  return this._httpClient.post(`${this.apiUrl}${this.endpoint}/add`, data).pipe(
    catchError(this.handleError)
  );
}
get  (id: number): Observable<ResponseApiData>{
  return this._httpClient.get<ResponseApiData>(`${this.apiUrl}${this.endpoint}/dossier/${id}`).pipe(
    catchError(this.handleError)
  );
}
recherche (matricule: string): Observable <ResponseApi>{
  let params = new HttpParams()
  .set('matricule', matricule.toString())
  return this._httpClient.get<ResponseApi>(`${this.apiUrl}${this.endpoint}/recherche/agent`,{params})

}

delete  (id: number){
  return this._httpClient.delete(`${this.apiUrl}${this.endpoint}/dossier/${id}`).pipe(
  catchError(this.handleError)
);
}

getDossierCurrentUser() : Observable<ResponseApiData>{
  return this._httpClient.get<ResponseApiData>(`${this.apiUrl}${this.endpoint}/current`).pipe(
  catchError(this.handleError)
);
}


  getDossierUserId(id: number): Observable<ResponseApiData>{
    return this._httpClient.get<ResponseApiData>(`${this.apiUrl}${this.endpoint}/dossier/utilisateur/${id}`)
        /*.pipe(
        catchError(this.handleError))

         */
        ;
  }
   

private handleError(error: any) {
      if (error.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${error.status}, body was: `, error.error);
      }
      // Preserve the HTTP response so the component can display the backend message.
      return throwError(() => error);
    }

}
