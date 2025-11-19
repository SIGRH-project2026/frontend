import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FiliereService {

  apiUrl: string = environment.apiUrl;
  endpoint : string = 'filieres'

  constructor(private _httpClient: HttpClient) { }
    
  getAll = (): Observable<ResponseApi2> =>{
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/list`)
  }
  
}
