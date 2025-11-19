import {inject, Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import { HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import Swal from "sweetalert2";
import { catchError, Observable, throwError} from "rxjs";
import {AuthResponse} from "../models/auth-response";
import {ResponseApiData} from "../models/response-api.model";
import {ResponseApi} from "../models/response-api";

@Injectable({
    providedIn : 'root'
})
export class CarriereService{
    apiUrl: string = environment.apiUrl;
    headers= new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  });

  constructor(private http: HttpClient) { }

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

  rechercheMatricule(matricule : string):Observable<ResponseApiData>{
    const API_URL = `${this.apiUrl}dossieragent/recherche/agent/${matricule}`;
    return this.http.get<ResponseApiData>(API_URL);
  }

  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error.message;
    }
    return throwError(() => {
      return errorMessage;
    });
  }

}