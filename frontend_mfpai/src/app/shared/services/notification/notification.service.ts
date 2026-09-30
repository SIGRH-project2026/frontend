import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, throwError } from 'rxjs';
import { MutationDTO } from 'src/app/back-office/gpeec/demandes-mutation-permutation-recues/models/mutationDTO';
import { environment } from 'src/environments/environment';
import { ResponseApi2 } from '../../models/ResponseApi';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  apiUrl: string = environment.apiUrl;
  endpoint : string = 'notifications'
  private updateNotify = new Subject<void>();

  constructor(private _httpClient: HttpClient) { }

  getNotifications = (userId: number, page: number, size: number, codeProfile : string,): Observable<ResponseApi2> =>{
  let params = new HttpParams()
                .set('page', page.toString())
                .set('pageSize', size.toString())
                .set('codeProfile', codeProfile)
                ;

  return this._httpClient.get(`${this.apiUrl}${this.endpoint}/list/${userId}`, {params}).pipe(
  catchError(this.handleError)
  );
  }
  getListNotifications = (userId: number, codeProfile : string,): Observable<ResponseApi2> =>{
    let params = new HttpParams()
                  .set('codeProfile', codeProfile)
                  
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/listGlobal/${userId}`, {params}).pipe(
    catchError(this.handleError)
    );
    }
  readNotify = (isNotification: number): Observable<ResponseApi2> =>{
  
    return this._httpClient.patch(`${this.apiUrl}${this.endpoint}/read/${isNotification}`,null).pipe(
    catchError(this.handleError)
    );
    }
//écoute des mise à jour sur les nombres de notifications
listenNotify() {
  return this.updateNotify.asObservable();
}
/*
nbrDeNotification() : number {
  let n = (sessionStorage.getItem('notify'))

    if(n)
      return parseInt(n)

return 0
}
*/


  nbrDeNotification(): number {
    const notify = sessionStorage.getItem('notify');

    if (!notify) {
      console.log('Notify not found');
      return 0;
    }

    const parsed = parseInt(notify, 10);
    return isNaN(parsed) ? 0 : parsed;
  }

  //update nombre notifications
  updateNbre(nbr : number){
    sessionStorage.setItem('notify', JSON.stringify(Number.isFinite(nbr) ? Math.max(0, nbr) : 0));
    this.updateNotify.next();
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
