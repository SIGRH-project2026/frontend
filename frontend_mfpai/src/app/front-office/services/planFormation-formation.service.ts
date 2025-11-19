import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { ResponseApi } from 'src/app/models/response-api';
import {catchError, Observable, throwError} from "rxjs";
import { ResponseApiData } from 'src/app/models/response-api.model';
import Swal from "sweetalert2";

@Injectable({
    providedIn: 'root'
})

export class PlanFormationEtFormationService{
    headers= new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    });

    constructor(private http: HttpClient) {

    }

    getAllPlanFormationEnCours(){
        const url = `${environment.apiUrl}plan-formation/list`;
        return this.http.get<ResponseApi>(url).pipe(
            catchError(this.handleError)
        );
    }

    getOnePlanFormation(id:number){
        const url = `${environment.apiUrl}plan-formation/${id}`;
        return this.http.get<ResponseApi>(url).pipe(
            catchError(this.handleError)
        );
    }

    getAllFormation(type:string){
        const url = `${environment.apiUrl}api/formations/allformationcontinueordiplomante/${type}`;
        return this.http.get<ResponseApi>(url).pipe(
            catchError(this.handleError)
        );
    }

    getAllFormationByType(type:string, page: number, size:number): Observable<ResponseApiData> {
        const url = `${environment.apiUrl}api/formations/allFormationByType/${type}?page=${page}&size=${size}`;
        return this.http.get<ResponseApiData>(url).pipe(
            catchError(this.handleError)
        );
    }


    getFormations(){
        const url = `${environment.apiUrl}api/formations`
        return this.http.get<ResponseApi>(url).pipe(
            catchError(this.handleError)
            );
    }

    getOneFormation(id:number): Observable<ResponseApi> {
        const url = `${environment.apiUrl}api/formations/${id}`;
        return this.http.get<ResponseApi>(url).pipe(
            catchError(this.handleError)
        );
    }

    getThemesByIdPlanFormation(id:number){
        const url = `${environment.apiUrl}themeformations/byPlanFormation/${id}`;
        return this.http.get<ResponseApi>(url).pipe(
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
