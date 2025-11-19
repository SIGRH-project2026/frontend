import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs/internal/observable/throwError";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { DemandePecDTO } from "../back-office/affaires-sociales/models/DemandePecDTO";
import { ResponseApi2 } from "../shared/models/ResponseApi";
import { Observable } from "rxjs/internal/Observable";
import { catchError } from "rxjs";
import { TypeDemandeDTO } from "../back-office/affaires-sociales/models/TypeDemandeDTO";

@Injectable({
    providedIn: 'root'
  })
  export class DemandePecService {
    apiUrl: string = environment.apiUrl;
    endpoint : string = 'priseencharges'
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

    create = (demande: DemandePecDTO): Observable<ResponseApi2> => {
      return this._httpClient.post(`${this.apiUrl}${this.endpoint}/create`, demande).pipe(
        catchError(this.handleError)
      );
    }

    getDemandePec= (id:number):Observable<ResponseApi2>=>  {
      return this._httpClient.get(`${this.apiUrl}${this.endpoint}/getOne/${id}`).pipe(
        catchError(this.handleError)
      );
    }

    listPec=(page: number, size: number,typeUserId:number,numero:string, matricule:string, nom:string, prenom:string, region:string, ia:string, date:string,objet:string,statut: string,type:string): Observable<ResponseApi2>=>{
    //  console.log({endpoint:this.apiUrl+this.endpoint})
      return this._httpClient.get(`${this.apiUrl}${this.endpoint}/listDemandes?page=${page}&size=${size}&typeUserId=${typeUserId}&numero=${numero}&matricule=${matricule}&nom=${nom}&prenom=${prenom}&region=${region}&ia=${ia}&date=${date}&objet=${objet}&statut=${statut}&type=${type}`).pipe(
        catchError(this.handleError)
      );
    }


    editPec= (id:number,typeDemandeDTO:DemandePecDTO):Observable<ResponseApi2>=>  {
      return this._httpClient.put(`${this.apiUrl}${this.endpoint}/updateDemande/${id}`,typeDemandeDTO).pipe(
        catchError(this.handleError)
      );
    }

    deleteDemandePec= (id:number):Observable<ResponseApi2>=>  {
      return this._httpClient.delete(`${this.apiUrl}${this.endpoint}/delete/${id}`).pipe(
        catchError(this.handleError)
      );
    }
  
    traiterPec= (id:number,idTraitant:number,traitement:string,motifModif:string,motifRejet:string):Observable<ResponseApi2>=>  {
      return this._httpClient.get(`${this.apiUrl}${this.endpoint}/traiterDemande/${id}/${idTraitant}/${traitement}?motifModif=${motifModif}&motifRejet=${motifRejet}`).pipe(
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


    statPec = (codeProfile : string): Observable<ResponseApi2> =>{
      let params = new HttpParams().set('codeProfile',codeProfile);
      return this._httpClient.get(`${this.apiUrl}${this.endpoint}/statistiques`, {params}).pipe(
        catchError(this.handleError)
      );
    }
  
 }
  
