import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { ResponseApi } from 'src/app/models/response-api';
import {catchError, Observable, of, shareReplay, tap, throwError} from "rxjs";
import { ResponseApiData } from 'src/app/models/response-api.model';
import Swal from "sweetalert2";
import { Actualite } from '../Model/Actualite';

@Injectable({
    providedIn: 'root'
})

export class ActualiteService{

    private cache: any = null;
    private cacheA = new Map<string, Observable<ResponseApi>>();

    constructor(private http: HttpClient) {

    }

    getOne(id :number){
        return this.http.get(`${environment.apiUrl}actualite/one/${id}`)
    }

    getAllActualite( page : number , size : number , statut : string){
        const url = `${environment.apiUrl}actualite/list`;
        let params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('statut', statut.toString())
        return this.http.get<ResponseApi>(url, {params}).pipe(
            catchError(this.handleError)
        );
    }

    getAllActualiteA(page: number, size: number, statut: string): Observable<ResponseApi> {
        const url = `${environment.apiUrl}actualite/list`;
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('statut', statut);

        const cacheKey = `${page}-${size}-${statut}`;
        if (this.cacheA.has(cacheKey)) {
            return this.cacheA.get(cacheKey)!; // `!` car on est sûr qu'il y est
        }

        const request$ = this.http.get<ResponseApi>(url, { params }).pipe(
            shareReplay(1), // mise en cache de la réponse
            catchError(this.handleError),
        );

        this.cacheA.set(cacheKey, request$);

       // localStorage.setItem('cacheA', JSON.stringify(request$));
        return request$;
    }

    clearCacheA(keyPart?: string) {
        if (keyPart) {
            for (let key of this.cacheA.keys()) {
                if (key.includes(keyPart)) {
                    this.cacheA.delete(key);
                }
            }
        } else {
            this.cacheA.clear();
        }
    }

    getAllActuOrRecrutementActive(code : string){
        //console.log("code ==",code);
        
        const url = `${environment.apiUrl}actualite/listActuOrRecrutementActive/${code}`;
        return this.http.get<ResponseApi>(url).pipe(
            catchError(this.handleError)
        );
    }

    getAllActuOrRecrutementActiveBis(code: string): Observable<any> {


        if (this.cache) {
            return of(this.cache);
        }



        const url = `${environment.apiUrl}actualite/listActuOrRecrutementActive/${code}`;

        // Sinon, appel HTTP et on met en cache
        return this.http.get<any>(url).pipe(
            tap((res) => {
                if (res.success) {
                    this.cache = res;


                   // localStorage.removeItem('cache');

                 //   localStorage.setItem('cache', JSON.stringify(res));




                }
            })
        );
    }

    clearCache() {
        this.cache = null;
    }


    getLastRecrutementActive(){
        const url = `${environment.apiUrl}actualite/listLastRecrutementActive`;
        return this.http.get<ResponseApi>(url).pipe(
            catchError(this.handleError)
        );
    }

    getAllActualiteActive(){
        const url = `${environment.apiUrl}actualite/listActive`;
        return this.http.get<ResponseApi>(url).pipe(
            catchError(this.handleError)
        );
    }

    getLastActualiteActive(){
        const url = `${environment.apiUrl}actualite/listLastActuActive`;
        return this.http.get<ResponseApi>(url).pipe(
            catchError(this.handleError)
        );
    }

    getAllTypeArticle(){
        const url = `${environment.apiUrl}actualite/listType`
        return this.http.get<ResponseApi>(url).pipe(
            catchError(this.handleError)
        );
    }

    getAllCategories(){
        const url = `${environment.apiUrl}actualite/listCategorie`
        return this.http.get<ResponseApi>(url).pipe(
            catchError(this.handleError)
            );
    }

    changeStatus(id : number){
      //  console.log("id == ",id);
        const url = `${environment.apiUrl}actualite/changeStatus/${id}`
        return this.http.get<ResponseApi>(url).pipe(
            catchError(this.handleError)
            );
    }

    add(actualite : Actualite, image : File){
        const url = `${environment.apiUrl}actualite/add`
        const formData = new FormData();
        formData.append('file', image);
        let params = new HttpParams()
        .set('titre', actualite.titre.toString())
        .set('contenu', actualite.contenu.toString())
        .set('resume', actualite.resume.toString())
        .set('typeArticle', actualite.typeArticle.toString())
        .set('categorieActualite', actualite.categorieActualite.toString())
        return this.http.post<ResponseApi>(url, formData, {params}).pipe(
            catchError(this.handleError)
        );
    }

    downloadImage(filename:string){
        return this.http.get(`${environment.apiUrl}+files/download?filename=${filename}`, {
            responseType : "blob"
        })
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
