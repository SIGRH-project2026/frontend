import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApiData} from "../../../models/response-api.model";
import {ResponseApi} from "../../../models/response-api";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class ParametreService {

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

  // Construit un message d'erreur exploitable à partir de la réponse HTTP :
  // le backend renvoie souvent un message générique dans `message` et le détail
  // réel (exception, erreurs de validation par champ) dans `errors`.
  buildErrorMessage(error: any): string {
    const message = error?.error?.message;
    const details = error?.error?.errors;

    if (!details) {
      return message || 'Une erreur est survenue';
    }

    if (Array.isArray(details)) {
      const fieldErrors = details
        .map((d: any) => (d?.field ? `${d.field} : ${d.message}` : d?.message ?? d))
        .filter(Boolean)
        .join(' | ');
      return fieldErrors ? `${message} (${fieldErrors})` : message;
    }

    if (typeof details === 'string' && details !== message) {
      return `${message} : ${details}`;
    }

    return message || 'Une erreur est survenue';
  }

  apiUrl: string = environment.apiUrl;
  headers= new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  });

  constructor(private _http: HttpClient ) { }


  // Direction
  listDirectionAdvanced(page: number, size: number, filter: string, statut: string) : Observable<ResponseApiData> {


    return this._http.get<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/direction/list-pages?page=${page}&size=${size}&filter=${filter}&statut=${statut}`);

  }


  changeStatusDirection(paramId: number): Observable<ResponseApi> {
    return this._http.put<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/direction/change-status/${paramId}`, {});
  }

  addDirection(formData: any) : Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}parametrages/utilisateur/direction/add`;
    return this._http.post<ResponseApi>(API_URL, formData);
  }

  updateDirection(id: number, formData: any) : Observable<ResponseApi> {

    const API_URL = `${environment.apiUrl}parametrages/utilisateur/direction/update/${id}`;
    return this._http.put<ResponseApi>(API_URL, formData);
  }



  // Division
  listDivisionAdvanced(page: number, size: number, filter: string, statut: string) : Observable<ResponseApiData> {

    return this._http.get<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/division/list-pages?page=${page}&size=${size}&filter=${filter}&statut=${statut}`);

  }


  changeStatusDivision(paramId: number): Observable<ResponseApi> {
    return this._http.put<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/division/change-status/${paramId}`, {});
  }

  addDivision(formData: any) : Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}parametrages/utilisateur/division/add`;
    return this._http.post<ResponseApi>(API_URL, formData);
  }

  updateDivision(id: number, formData: any) : Observable<ResponseApi> {

    const API_URL = `${environment.apiUrl}parametrages/utilisateur/division/update/${id}`;
    return this._http.put<ResponseApi>(API_URL, formData);
  }




  // Bureau
  listBureauAdvanced(page: number, size: number, filter: string, statut: string) : Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/bureau/list-pages?page=${page}&size=${size}&filter=${filter}&statut=${statut}`);

  }

  changeStatusBureau(paramId: number): Observable<ResponseApi> {
    return this._http.put<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/bureau/change-status/${paramId}`, {});
  }

  addBureau(formData: any) : Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}parametrages/utilisateur/bureau/add`;
    return this._http.post<ResponseApi>(API_URL, formData);
  }

  updateBureau(id: number, formData: any) : Observable<ResponseApi> {

    const API_URL = `${environment.apiUrl}parametrages/utilisateur/bureau/update/${id}`;
    return this._http.put<ResponseApi>(API_URL, formData);
  }


  updateDiplome(id: number, formData: any) : Observable<ResponseApi> {

    const API_URL = `${environment.apiUrl}parametrages/utilisateur/diplome/update/${id}`;
    return this._http.put<ResponseApi>(API_URL, formData);
  }



  // Speciality
  listSpecialityAdvanced(page: number, size: number, filter: string, statut: string) : Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/speciality/list-pages?page=${page}&size=${size}&filter=${filter}&statut=${statut}`);

  }

  changeStatusSpeciality(paramId: number): Observable<ResponseApi> {
    return this._http.put<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/speciality/change-status/${paramId}`, {});
  }

  addSpeciality(formData: any) : Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}parametrages/utilisateur/speciality/add`;
    return this._http.post<ResponseApi>(API_URL, formData);
  }

  updateSpeciality(id: number, formData: any) : Observable<ResponseApi> {

    const API_URL = `${environment.apiUrl}parametrages/utilisateur/speciality/update/${id}`;
    return this._http.put<ResponseApi>(API_URL, formData);
  }



  // Fonction
  listFonctionAdvanced(page: number, size: number, filter: string, statut: string) : Observable<ResponseApiData> {


    return this._http.get<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/fonction/list-pages?page=${page}&size=${size}&filter=${filter}&statut=${statut}`);

  }


  changeStatusFonction(paramId: number): Observable<ResponseApi> {
    return this._http.put<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/fonction/change-status/${paramId}`, {});
  }

  addFonction(formData: any) : Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}parametrages/utilisateur/fonction/add`;
    return this._http.post<ResponseApi>(API_URL, formData);
  }

  updateFonction(id: number, formData: any) : Observable<ResponseApi> {

    const API_URL = `${environment.apiUrl}parametrages/utilisateur/fonction/update/${id}`;
    return this._http.put<ResponseApi>(API_URL, formData);
  }





  // IA
  listIAAdvanced(page: number, size: number, filter: string, statut: string) : Observable<ResponseApiData> {


    return this._http.get<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/ia/list-pages?page=${page}&size=${size}&filter=${filter}&statut=${statut}`);

  }


  changeStatusIA(paramId: number): Observable<ResponseApi> {
    return this._http.put<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/ia/change-status/${paramId}`, {});
  }

  addIA(formData: any) : Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}parametrages/utilisateur/ia/add`;
    return this._http.post<ResponseApi>(API_URL, formData);
  }

  updateIA(id: number, formData: any) : Observable<ResponseApi> {

    const API_URL = `${environment.apiUrl}parametrages/utilisateur/ia/update/${id}`;
    return this._http.put<ResponseApi>(API_URL, formData);
  }



  // IEF
  listIEFAdvanced(page: number, size: number, filter: string, statut: string) : Observable<ResponseApiData> {

    return this._http.get<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/ief/list-pages?page=${page}&size=${size}&filter=${filter}&statut=${statut}`);

  }


  changeStatusIEF(paramId: number): Observable<ResponseApi> {
    return this._http.put<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/ief/change-status/${paramId}`, {});
  }

  addIEF(formData: any) : Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}parametrages/utilisateur/ief/add`;
    return this._http.post<ResponseApi>(API_URL, formData);
  }

  updateIEF(id: number, formData: any) : Observable<ResponseApi> {

    const API_URL = `${environment.apiUrl}parametrages/utilisateur/ief/update/${id}`;
    return this._http.put<ResponseApi>(API_URL, formData);
  }






  // Etablissement
  listEtablissementAdvanced(page: number, size: number, filter: string, statut: string) : Observable<ResponseApiData> {

    return this._http.get<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/etablissement/list-pages?page=${page}&size=${size}&filter=${filter}&statut=${statut}`);

  }


  changeStatusEtablissement(paramId: number): Observable<ResponseApi> {
    return this._http.put<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/etablissement/change-status/${paramId}`, {});
  }

  addEtablissement(formData: any) : Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}parametrages/utilisateur/etablissement/add`;
    return this._http.post<ResponseApi>(API_URL, formData);
  }

  updateEtablissement(id: number, formData: any) : Observable<ResponseApi> {

    const API_URL = `${environment.apiUrl}parametrages/utilisateur/etablissement/update/${id}`;
    return this._http.put<ResponseApi>(API_URL, formData);
  }


  // Speciality Etablissement
  listEtapSpeAdvanced(page: number, size: number, filter: string, statut: string) : Observable<ResponseApiData> {

    return this._http.get<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/speciality-etablissement/list-pages?page=${page}&size=${size}&filter=${filter}&statut=${statut}`);
  }


  addEtablissementSpec(formData: any) : Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}parametrages/utilisateur/speciality-etablissement/add`;
    return this._http.post<ResponseApi>(API_URL, formData);
  }


  getEtablissment(etabtId: any) {
    const API_URL = `${environment.apiUrl}parametrages/utilisateur/etablissement/${etabtId}`;
    return this._http.get<ResponseApi>(API_URL);
  }


  listDiplomeAdvanced(page: number, size: number, filter: string, statut: string) : Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/diplome/list-pages?page=${page}&size=${size}&filter=${filter}&statut=${statut}`);

  }


  addDiplome(formData: any) : Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}parametrages/utilisateur/diplome/add`;
    return this._http.post<ResponseApi>(API_URL, formData);
  }



  changeStatusDiplome(paramId: number): Observable<ResponseApi> {
    return this._http.put<ResponseApi>(`${environment.apiUrl}parametrages/utilisateur/diplome/change-status/${paramId}`, {});
  }

}
