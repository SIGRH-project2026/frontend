import {inject, Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import { HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import Swal from "sweetalert2";
import { catchError, Observable, throwError} from "rxjs";
import {AuthResponse, ResetOrForgetFormDTO} from "../models/auth-response";
import {AuthResponseApi} from "../models/response-api.model";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
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

  loginUser(credentials: any): Observable<AuthResponseApi> {
    const API_URL = `${this.apiUrl}auth/login`;
    return this.http.post<AuthResponseApi>(API_URL, credentials).pipe(catchError(this.error));

  }

  forgotPassword(login: string): Observable<AuthResponseApi> {
    return this.http.get<AuthResponseApi>(`${this.apiUrl}auth/forgot-password?login=${login}`)
  }

  resetPassword(credentials: ResetOrForgetFormDTO): Observable<AuthResponseApi>  {
    const API_URL = `${this.apiUrl}auth/signin-with-forget-password-url-connexion`;
    return this.http.post<AuthResponseApi>(API_URL, credentials).pipe(catchError(this.error));

  }

  updatePassword(credentials: ResetOrForgetFormDTO)  : Observable<AuthResponseApi>{
    const API_URL = `${this.apiUrl}auth/edit-user-password`;
    return this.http.post<AuthResponseApi>(API_URL, credentials).pipe(catchError(this.error));
  }

  addUser(credentials: any,auth_token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });

    const API_URL = `${this.apiUrl}users/addUser`;
    return this.http.post(API_URL, credentials, { headers: headers }).pipe(catchError(this.error));
  }

  getInfoUser(data: any): Observable<any> {
    const API_URL = `${this.apiUrl}users?telephone=${data}`;
    return this.http.get(API_URL, { headers: this.headers }).pipe(catchError(this.error));
  }

  getAllTransactions(): Observable<any> {
    let API_URL = `${this.apiUrl}transactions`;
    return this.http.get(API_URL, { headers: this.headers }).pipe(catchError(this.error));
  }

  // getAllRoles(auth_token: string | null): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //     'Authorization': `Bearer ${auth_token}`
  //   })
  //   let API_URL = `${this.apiUrl}users/role/listRoles`;
  //   return this.http.get(API_URL, {headers: headers}).pipe(catchError(this.error));
  // }

  getAllRoles(auth_token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });

    let API_URL = `${this.apiUrl}users/role/listRoles`;

    return this.http.get(API_URL, { headers: headers }).pipe(
        catchError(this.error)
    );
  }


  getAllEntities(auth_token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });

    let API_URL = `${this.apiUrl}users/entity/listEntityRole`;

    return this.http.get(API_URL, { headers: headers }).pipe(
        catchError(this.error)
    );
  }

  getAllUsers(auth_token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });

    let API_URL = `${this.apiUrl}users/listUser`;

    return this.http.get(API_URL, { headers: headers }).pipe(
        catchError(this.error)
    );
  }

  getAllUsersPage(auth_token: string | null, page: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });

    let API_URL = `${this.apiUrl}users/listUser?page=${page}`;

    return this.http.get(API_URL, { headers: headers }).pipe(
        catchError(this.error)
    );
  }

  getAllProfilsFromEntity(entity_name: string | null, auth_token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });

    let API_URL = `${this.apiUrl}users/role/listeRoleEntity/${entity_name}`;

    return this.http.get(API_URL, { headers: headers }).pipe(
        catchError(this.error)
    );
  }



  // getAllUsers(): Observable<any> {
  //   let API_URL = `${this.apiUrl}users`;
  //   return this.http.get(API_URL, { headers: this.headers }).pipe(catchError(this.error));
  // }




  updateStatusOfTransaction(id: any): Observable<any> {
    let API_URL = `${this.apiUrl}transactions/${id}`;
    return this.http.patch(API_URL, { "statut": 'Réussi' }, { headers: this.headers }).pipe(catchError(this.error));
  }

  getOneTransaction(numberPhone: any): Observable<any> {
    let API_URL = `${this.apiUrl}transactions?order[id]=desc&&user.telephone=${numberPhone}`;
    return this.http.get(API_URL, { headers: this.headers }).pipe(catchError(this.error));
  }

  // Handle Errors
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
