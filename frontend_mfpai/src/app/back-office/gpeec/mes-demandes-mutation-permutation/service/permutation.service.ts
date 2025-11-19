import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { ResponseApi } from 'src/app/models/response-api';
import {catchError, Observable, throwError} from "rxjs";
import { ResponseApiData } from 'src/app/models/response-api.model';
import Swal from "sweetalert2";
import { CentralLevelDTO, DeconectedDTO } from 'src/app/models/utilisateur';
import { Permutation } from '../model/Permutation';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';

@Injectable({
    providedIn: 'root'
})
export class PermutationService{

    headers= new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    });
    constructor(private http: HttpClient) {

    }

    getCurrentUser(){
        const url = `${environment.apiUrl}permutation/currentUser`;
        return this.http.get<ResponseApi>(url)
    }

    uploadPermuatationOS(idPermutation:number, idTraiteur : number, file: File){
        const url = `${environment.apiUrl}permutation/uploadPermutationOS/${idPermutation}/${idTraiteur}`
        const formData = new FormData();
        formData.append('file', file)
        return this.http.post(url, formData ).pipe(
            catchError(this.handleError)
        ); 
    }

    getUser2(matricule:string){
        console.log(matricule);
        const url = `${environment.apiUrl}permutation/recherche`;
        let params = new HttpParams()
            .set('matricule', matricule.toString())
        return this.http.get<ResponseApi>(url, {params})
    }

    add(permutation:Permutation){
        const url = `${environment.apiUrl}permutation/add`;
        return this.http.post<ResponseApi>(url, permutation)
    }

    getAll(page :number, size:number, matricule:string, region:string, statut:string, nom :string, prenom : string, type: string, ia:string, ief:string, etablissement:string ){
        const url = `${environment.apiUrl}permutation/list`;
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('matricule', matricule.toString())
            .set('nom', nom.toString())
            .set('prenom', prenom.toString())
            .set('region', region.toString())
            .set('type', type.toString())
            .set('statut', statut.toString())
            .set('ia', ia.toString())
            .set('ief', ief.toString())
            .set('etablissement', etablissement.toString())
        return this.http.get<ResponseApi>(url, {params}).pipe(
            catchError(this.handleError)
        );
    }

    traitement(idPermutation: number, action : string, motif:string, type : string){
        const url = `${environment.apiUrl}permutation/traitement`;
        let params = new HttpParams()
            .set('idPermutation', idPermutation.toString())
            .set('action', action.toString())
            .set('motif', motif.toString())
            .set('type', type.toString())

        return this.http.get<ResponseApi>(url, {params}).pipe(
            catchError(this.handleError)
        );
    }

    getOne(id:number){
        const url = `${environment.apiUrl}permutation/getOne`;
        return this.http.get<ResponseApi>(`${url}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    generate  (id: number){
        return this.http.get(`${environment.apiUrl}permutation/generate/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    generateAllPermutation  (){
        return this.http.get(`${environment.apiUrl}permutation/generateAllPermutation`).pipe(
            catchError(this.handleError)
        );
    }

    indicateurPermutation = (codeProfile : string): Observable<ResponseApi2> =>{
        let params = new HttpParams().set('codeProfile',codeProfile);
        return this.http.get(`${environment.apiUrl}permutation/indicateurs`, {params}).pipe(
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

