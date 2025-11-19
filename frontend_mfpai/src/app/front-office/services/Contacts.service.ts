import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { ResponseApi } from 'src/app/models/response-api';
import {catchError, Observable, throwError} from "rxjs";
import { ResponseApiData } from 'src/app/models/response-api.model';
import Swal from "sweetalert2";
import { Contacts } from '../Model/Contacts';

@Injectable({
    providedIn: 'root'
})

export class ContactsService{

    constructor(private http: HttpClient) {

    }

    Add(contacts : Contacts){
        let url =  `${environment.apiUrl}contacts/add`
        return this.http.post(url, contacts).pipe(
            catchError(this.handleError)
        )
    }

    list(){
        let url =  `${environment.apiUrl}contacts/list`
        return this.http.get(url).pipe(
            catchError(this.handleError)
        )
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