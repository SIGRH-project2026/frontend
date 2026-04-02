import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ResponseApi} from "../models/response-api";
import {catchError, Observable} from "rxjs";
import {ResponseApiData} from "../models/response-api.model";
import Swal from "sweetalert2";
import {CentralLevelDTO, DeconectedDTO} from "../models/utilisateur";

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  headers= new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  });

  constructor(private _http: HttpClient ) { }

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

 /* addUserCentral(credentials: any,auth_token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });

    const API_URL = `${environment.apiUrl}utilisateur/central/add`;
    return this._http.post(API_URL, credentials, { headers: headers });
  }
*/
  addUserCentral(credentials: any): Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}utilisateur/central/add`;
    return this._http.post<ResponseApi>(API_URL, credentials);
  }

  addUserDeconected(credentials: any): Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}utilisateur/deconected/add`;
    return this._http.post<ResponseApi>(API_URL, credentials);
  }
  getDeconnected(id:number): Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(`${environment.apiUrl}utilisateur/deconected/${id}`);
  }

  listUtilisateur(page: number, size: string, filter: string): Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(`${environment.apiUrl}utilisateur/listPage?page=${page}&size=${size}&filter=${filter}`);
  }

  listUtilisateurCount(): Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(`${environment.apiUrl}utilisateur/getAll`);
  }

  listUtilisateurCentral(page: number, size: number, filter: string): Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(`${environment.apiUrl}utilisateur/central/listPage?page=${page}&size=${size}&filter=${filter}`);
  }

  listUtilisateurCentralAdvanced(page: number, size: number, filter: string,profile: string, matricule: string,prenom: string,nom: string, direction: string ): Observable<ResponseApiData> {
   // http://localhost:9080/api/v1/mfpai/utilisateur/central/listAvancedPage?size=10&matricule=SN874&prenom=Ousmane&nom=Fall&direction=Autres directions&page=0&filter=SN874
   // console.log(`${environment.apiUrl}utilisateur/central/listAvancedPage?page=${page}&size=${size}&filter=${filter}&profile=${profile}&matricule=${matricule}&prenom=${prenom}&nom=${nom}&direction=${direction}`)
    return this._http.get<ResponseApi>(`${environment.apiUrl}utilisateur/central/listAvancedPage?page=${page}&size=${size}&filter=${filter}&profile=${profile}&matricule=${matricule}&prenom=${prenom}&nom=${nom}&direction=${direction}`);

   // return this._http.get<ResponseApi>(`${environment.apiUrl}utilisateur/central/listAvancedPage?size=${size}&profile=${profile}&matricule=${matricule}&prenom=${prenom}&nom=${nom}&direction=${direction}&page=${page}&filter=${filter}`);
  }

  listParamAdvanced(page: number, size: number, filter: string,libelleCorps: string,
                    libelleGrade: string,libelleSpecialite: string ): Observable<ResponseApiData> {


    return this._http.get<ResponseApi>(`${environment.apiUrl}parametre-corps/list-pages?page=${page}&size=${size}&filter=${filter}
    &libelleCorps=${libelleCorps}&libelleGrade=${libelleGrade}&libelleSpecialite=${libelleSpecialite}`);


  }





  getAllCentralUser( page: number,  size: number,  region: string,  direction: string,  division: string,
                     bureau: string,specialite: string, corps: string,  grade: string,  matricule: string,  prenom: string,

                     nom: string,  dateNaissance: string,  cni: string,  telephone: string,  email: string): Observable<ResponseApiData>{

   // console.log(`${environment.apiUrl}utilisateur/central/listCenPage?page=${page}&size=${size}&region=${region}&direction=${direction}&division=${division}&bureau=${bureau}&specialite=${specialite}&corps=${corps}&grade=${grade}&matricule=${matricule}&prenom=${prenom}&nom=${nom}&dateNaissance=${dateNaissance}&cni=${cni}&telephone=${telephone}&email=${email}`)
    return this._http.get<ResponseApiData>(`${environment.apiUrl}utilisateur/central/listCenPage?page=${page}&size=${size}&region=${region}&direction=${direction}&division=${division}&bureau=${bureau}&specialite=${specialite}&corps=${corps}&grade=${grade}&matricule=${matricule}&prenom=${prenom}&nom=${nom}&dateNaissance=${dateNaissance}&cni=${cni}&telephone=${telephone}&email=${email}`);
  }


  getAllDecoUser( page: number,  size: number,  region: string,  ia: string,  ief: string,
                  etablissement: string,specialite: string, corps: string,  grade: string,  matricule: string,  prenom: string,
                     nom: string,  dateNaissance: string,  cni: string,  telephone: string,  email: string): Observable<ResponseApiData>{


   // console.log("log",`${environment.apiUrl}utilisateur/deconected/listDecoPage?page=${page}&size=${size}&region=${region}&ia=${ia}&ief=${ief}&etablissement=${etablissement}&specialite=${specialite}&corps=${corps}&grade=${grade}&matricule=${matricule}&prenom=${prenom}&nom=${nom}&dateNaissance=${dateNaissance}&cni=${cni}&telephone=${telephone}&email=${email}`)
    return this._http.get<ResponseApiData>(`${environment.apiUrl}utilisateur/deconected/listDecoPage?page=${page}&size=${size}&region=${region}&ia=${ia}&ief=${ief}&etablissement=${etablissement}&specialite=${specialite}&corps=${corps}&grade=${grade}&matricule=${matricule}&prenom=${prenom}&nom=${nom}&dateNaissance=${dateNaissance}&cni=${cni}&telephone=${telephone}&email=${email}`);
  }


  listUtilisateurDeconected(page: number, size: string, filter: string): Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(`${environment.apiUrl}utilisateur/deconected/listPage?page=${page}&size=${size}&filter=${filter}`);
  }

  listUtilisateurDeconectedAdvanced(page: number, size: number, filter: string, profile: string, matricule: string,prenom: string,nom: string, region: string, ia: string, ief: string, etablissement: string): Observable<ResponseApiData> {
   //console.log(`${environment.apiUrl}utilisateur/deconected/listAdvandedPage?page=${page}&size=${size}&filter=${filter}&profile=${profile}&matricule=${matricule}&prenom=${prenom}&nom=${nom}&region=${region}&ia=${ia}&ief=${ief}&etablissement=${etablissement}`)
    return this._http.get<ResponseApi>(`${environment.apiUrl}utilisateur/deconected/listAdvandedPage?page=${page}&size=${size}&filter=${filter}&profile=${profile}&matricule=${matricule}&prenom=${prenom}&nom=${nom}&region=${region}&ia=${ia}&ief=${ief}&etablissement=${etablissement}`);
  }


  connected(): Observable<any> {
    const API_URL = `${environment.apiUrl}utilisateur/connected`;
    return this._http.get(API_URL);
  }

  // http://localhost:9080/api/v1/mfpai/utilisateur/connected
  // ${environment.apiUrl}utilisateur/currentUser
  getCurrentUser(): Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(`${environment.apiUrl}utilisateur/currentUser`);
  }
  //TOP
  getOneUser(idUser : number): Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(`${environment.apiUrl}utilisateur/${idUser}`);
  }

  // isCurrentUserInTopN(n: number): Observable<boolean> {
  //   return this._http.get<boolean>(`${environment.apiUrl}utilisateur/prioritaires?n=${n}`);
  // }

  isCurrentUserInTopN(n: number): Observable<boolean> {
    return this._http.get<boolean>(`${environment.apiUrl}utilisateur/prioritaire?n=${n}`);
  }
  

  changeStatus(userId: number): Observable<ResponseApi> {
    return this._http.put<ResponseApi>(`${environment.apiUrl}utilisateur/change-status/${userId}`, {});
  }



  switchUserType(userId: number, dto: any) {
    const API_URL = `${environment.apiUrl}utilisateur/switch-user/${userId}`;
    return this._http.put<ResponseApi>(API_URL, dto);
  }


  updateUserCentral(userId: number, dto: CentralLevelDTO) {
    const API_URL = `${environment.apiUrl}utilisateur/central/update/${userId}`;
    return this._http.put<ResponseApi>(API_URL, dto);
  }

  updateUserDeconected(userId: number, dto: DeconectedDTO) {
    const API_URL = `${environment.apiUrl}utilisateur/deconected/update/${userId}`;
    return this._http.put<ResponseApi>(API_URL, dto);
  }

  getUser(userId: number): Observable<ResponseApi> {
    return this._http.get<ResponseApi>( `${environment.apiUrl}utilisateur/${userId}`)
  }
  listProfParEtablissement( codeEtablissement: string): Observable<ResponseApi> {

    return this._http.get<ResponseApi>(`${environment.apiUrl}utilisateur/deconected/list/${codeEtablissement}`);
  }

 /*  getOneUser(userId: number): Observable<ResponseApi> {
    return this._http.get<ResponseApi>( `${environment.apiUrl}utilisateur/${userId}`)
  } */


  // Services for Parameter

  addParam(credentials: any): Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}parametre-corps/add`;
    return this._http.post<ResponseApi>(API_URL, credentials);
  }

  updateParam(id: number, credentials: any): Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}parametre-corps/update/${id}`;
    return this._http.put<ResponseApi>(API_URL, credentials);
  }

  getParam(paramId: number): Observable<ResponseApi> {
    return this._http.get<ResponseApi>( `${environment.apiUrl}parametre-corps/${paramId}`)
  }
  changeStatusParam(paramId: number): Observable<ResponseApi> {
    return this._http.put<ResponseApi>(`${environment.apiUrl}parametre-corps/change-status/${paramId}`, {});
  }


  getAllPersonnel( page: number,  size: number,  region: string,structure : string,  ia: string,  ief: string, etablissement: string): Observable<ResponseApiData>{
    let params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('structure', structure)
        .set('region', region)
        .set('ia', ia)
        .set('ief', ief)
        .set('etablissement', etablissement)
    ;

    return this._http.get<ResponseApiData>(`${environment.apiUrl}utilisateur/personnels/`, {params});
  }


  getSearchUser(filter: string): Observable<ResponseApi>{
    return this._http.get<ResponseApi>(`${environment.apiUrl}utilisateur/filter-user?filter=${filter}`);
  }

  /**
   * Récupère le personnel du niveau central avec pagination et filtres
   */
  getPersonnelNiveauCentral(params: {
  page: number;
  size: number;
  direction?: string;
  service?: string;
  division?: string;
  bureau?: string;
}): Observable<any> {
  let queryParams = `?page=${params.page}&size=${params.size}`;
  
  if (params.direction) queryParams += `&direction=${params.direction}`;
  if (params.service) queryParams += `&service=${params.service}`;
  if (params.division) queryParams += `&division=${params.division}`;
  if (params.bureau) queryParams += `&bureau=${params.bureau}`;
  
  // Vérifiez que l'URL est correcte
  console.log('Appel API:', `${environment.apiUrl}utilisateur/personnel/niveau-central${queryParams}`);
  
  return this._http.get(`${environment.apiUrl}utilisateur/personnel/niveau-central${queryParams}`);
}
}

