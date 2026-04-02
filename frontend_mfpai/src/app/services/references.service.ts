import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "../models/response-api";
import {environment} from "../../environments/environment";
import { ResponseApi2 } from '../shared/models/ResponseApi';
import {ResponseApiData} from "../models/response-api.model";

@Injectable({
  providedIn: 'root'
})
export class ReferencesService {
  apiUrl: string = environment.apiUrl;
  headers= new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  });

  constructor(private _http: HttpClient ) { }


  listService = (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/services`, { headers: this.headers });
  listServiceByDirectionCode = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/services/`+code, { headers: this.headers });

  listDivisions = (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/divisions`);
  listDivisionByDirectionCode = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/divisions/`+code);


  listTypeDiplomes = (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/type-diplome`);




  listDirections = (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/directions`);

  listButreaus = (): Observable<ResponseApi> =>  this._http.get<ResponseApi>(`${this.apiUrl}static/bureaus`);

  listBureauByCode = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/bureaus/${code}`);

  listProfileDivision = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/profile-divison/${code}`);
  getProfileDirection = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/profile-direction/${code}`);
  listProfileBureau = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/profile-bureau/${code}`);
  lisTypeProfileWithOutCD = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/profile-bureau-wcd/${code}`);


  listProfils = (): Observable<ResponseApi> =>  this._http.get<ResponseApi>(`${this.apiUrl}static/profils`);


  listFonction = (): Observable<ResponseApi> =>  this._http.get<ResponseApi>(`${this.apiUrl}static/fonctions`);


  listcorpsGrade = (): Observable<ResponseApi> =>  this._http.get<ResponseApi>(`${this.apiUrl}static/corpsgrade`);


//  listProfiles = (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/profils`);
  listProfilesCEN = (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/profils/cen`);
  listProfilesDEC = (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/profils/dec`);
  //listProfiles = (): Observable<ResponseApi> => this._http.get<ResponseApi>(`http://localhost:9080/api/v1/mfpai/static/profils`, { headers: this.headers });


  listIA = (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/ia`);
  listIAByCode = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/ia/${code}`);

  listIEF= (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/ief`);
  listIEFByCode = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/ief/${code}`);

  listRegion= (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/regions`);


  listSpeciality= (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/specialities`);

  listCFP= (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/cfp`);
  listCFPByCode = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/cfp/${code}`);

  listStructureMfpaa= (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/mfpaa`);

  listStructureMfpaaByCode = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/mfpaa/${code}`);

  listGradeByCode = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/grade/${code}`);
  listGrade= (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/grade`);
  listGradeFilter= (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/grade-filter`);

  listEtablissement= (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/etablissement`);

  listDiscipline= (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/discipline`);

  listTypePoste= (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/type-poste`);
  listDiplomeACA= (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/diplome-aca`);
  listDiplomePROF= (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/diplome-prof`);
  listDiplomePED= (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/diplome-ped`);
  listTypeMatricule= (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/type-matricule`);
  lisStructure= (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/structure`);
  lisTypeEtablissement= (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/etablissement-type`);


  listEtablissementByCode = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/etablissement/${code}`);
  listEtablissementByCodeIA = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/etablissement/${code}`);
  listEEMinistereByCode = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/eeministre/${code}`);
  listEEMinistere = (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/eeministre`);

  listEtablissementByIACode = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/etabliessement-ia/${code}`);
 // listEtablissementByIAEFFLYC = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/etabliessement-ia/${code}`);
  listEtablissementByIEFCode = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/etabliessement-ief/${code}`);
  listEtablissementByEFFCode = (code: string): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/etabliessement-eef/${code}`);

  listNiveauxByCodeFormation = (code : any): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/formation-pro/niveau/${code}`);

  listFormationPro = (): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/formation-pro`);
  listSerieByCodeForm = (code : any): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/formation-pro/serie/${code}`);
  listEtablissementByTypeETA= (code : any): Observable<ResponseApi> => this._http.get<ResponseApi>(`${this.apiUrl}static/etablissement-type/${code}`);

  listCorpsByMatricule = (code: string): Observable<ResponseApi> =>  this._http.get<ResponseApi>(`${this.apiUrl}static/corps/${code}`);

  getMenus = (profileId: number): Observable<ResponseApi2> =>  this._http.get<ResponseApi>(`${this.apiUrl}menus/listByProfile/${profileId}`);

  indicateurIaIefEtab = (codeProfile : string): Observable<ResponseApi2> =>{
    let params = new HttpParams().set('profileCode',codeProfile);
    return this._http.get(`${this.apiUrl}static/indicateurs`, {params})
 }

/**
 * Récupère toutes les directions (niveau central)
 */
getDirections(): Observable<any> {
  return this._http.get(`${this.apiUrl}utilisateur/references/directions`);
}

/**
 * Récupère les services d'une direction
 * @param directionCode Code de la direction
 */
getServicesByDirection(directionCode: string): Observable<any> {
  return this._http.get(`${this.apiUrl}utilisateur/references/services/${directionCode}`);
}

/**
 * Récupère les divisions d'une direction
 * @param directionCode Code de la direction
 */
getDivisionsByDirection(directionCode: string): Observable<any> {
  return this._http.get(`${this.apiUrl}utilisateur/references/divisions/${directionCode}`);
}

/**
 * Récupère les bureaux d'une division
 * @param divisionCode Code de la division
 */
getBureausByDivision(divisionCode: string): Observable<any> {
  return this._http.get(`${this.apiUrl}utilisateur/references/bureaus/${divisionCode}`);
}

}
