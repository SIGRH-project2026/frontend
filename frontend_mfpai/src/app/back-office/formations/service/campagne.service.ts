import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "../../../shared/models/utils/response-api.model";

@Injectable({
  providedIn: 'root'
})
export class CampagneService {

  constructor(private _http: HttpClient) {}
  token = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5am81cVVUYXBFNkNiMVp0UjYzbGFhWEh4V3lHVWR1eXh2TlFLRU1mSGljIn0.eyJleHAiOjE3MDY3MDc0ODAsImlhdCI6MTcwNjcwMzk0MCwianRpIjoiNzk5NTk2ZDktMjRjMi00ODc1LTlkYTMtZDMyMGNmYTZiMjQ4IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgxL3JlYWxtcy8yZ2stbWZwYWktYmFja2VuZCIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJiYjE2MGU0ZC0zMDc0LTRjMTgtYTQwZS1kOTUyNzE4NGFlODUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJtZnBhaS1hcGktcmVzdCIsInNlc3Npb25fc3RhdGUiOiI5ZTJlNTlmNy03NzJlLTQxNDYtOTFiOS04ODEwOTg5NDQxYTMiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIkNIRUYtRElWSVNJT04iLCJBU1NJU1RBTlQtRFJIIiwiQ0hFRi1CVVJFQVUiLCJkZWZhdWx0LXJvbGVzLTJnay1tZnBhaS1iYWNrZW5kIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsInNpZCI6IjllMmU1OWY3LTc3MmUtNDE0Ni05MWI5LTg4MTA5ODk0NDFhMyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiQWJsYXllIEZBWUUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhYmxheWVAeW9wbWFpbC5jb20iLCJnaXZlbl9uYW1lIjoiQWJsYXllIiwiZmFtaWx5X25hbWUiOiJGQVlFIiwiZW1haWwiOiJhYmxheWVAeW9wbWFpbC5jb20ifQ.OSnGXR4fQUxyPe2mmIu0pB8-uv7LS3yTY-XHUzzE3N4vFcIWDTaquB-Opnub6MOpocoION1-hlTD6-3Z6YMH99mx9p5s-nuq7-_3W1e2ajzJtXKtiTIUKPsRxkaejBseKjXW7AcHdWw4B_cUC0fxq76h77wpuTqGja2ZesCp3V1Z5HfmKatK-1tCQLz2eamcXVAwT1e4pId_8ubiZm7wFhhxt2_I9cLinwvQNPyrVtiOVS_LqmQD4pV0Dnathn6ZIXJkdu0cOll5lhlhyKkTKnNgtCc3pcMLRfGfpcjw9Lv4FplFNR2uNkbLxz9sSajNxWjhr_WIdgvQMjPKJ6IzoA';
  url = 'http://localhost:9080/api/v1/mfpai/campagne/'

  getAll(page: number, size: number, filterValue: string):Observable<ResponseApi>{

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this._http.get(this.url+"all?page="+page+"&size="+size.toString(), {headers});
    // return this._http.get(this.url+"all?page="+page+"&size="+size, {headers});
  }

  saveCampagne(campagne: any):Observable<ResponseApi>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this._http.post(this.url+"add", campagne,{headers})
  }

  editCampagne(id: number,campagne: any):Observable<ResponseApi>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this._http.post(this.url+"edit/"+id, campagne,{headers})
  }

  startCampagne(id: number):Observable<ResponseApi>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this._http.get(this.url+"start/"+id,{headers})
  }

  stopCampagne(id: number):Observable<ResponseApi>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this._http.get(this.url+"stop/"+id,{headers})
  }





}
