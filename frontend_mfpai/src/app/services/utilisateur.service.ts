import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { environment } from "../../environments/environment";
import { ResponseApi } from "../models/response-api";
import { ResponseApiData } from "../models/response-api.model";
import { CentralLevelDTO, DeconectedDTO } from "../models/utilisateur";

@Injectable({
  providedIn: "root",
})
export class UtilisateurService {
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
  });

  constructor(private _http: HttpClient) {}

  showSwal(icon?: any, text?: any) {
    Swal.fire({
      position: "center",
      icon,
      title: "Message!",
      text,
      confirmButtonColor: "#056db6",
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

  /**
   * Import en masse d'utilisateurs de niveau central à partir
   * d'un fichier Excel (.xlsx/.xls) ou CSV. Les champs manquants sont tolérés
   * et les doublons sont bloqués ligne par ligne côté serveur.
   */
  importUtilisateursCentral(file: File): Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}utilisateur/central/import`;
    const formData = new FormData();
    formData.append("file", file);
    return this._http.post<ResponseApi>(API_URL, formData);
  }

  /**
   * Import en masse d'utilisateurs de niveau déconcentré à partir
   * d'un fichier Excel (.xlsx/.xls) ou CSV. Les champs manquants sont tolérés.
   */
  importUtilisateursDeconected(file: File): Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}utilisateur/deconected/import`;
    const formData = new FormData();
    formData.append("file", file);
    return this._http.post<ResponseApi>(API_URL, formData);
  }

  /** Détecte les matricules en doublon (niveau déconcentré) sans rien supprimer. */
  findDuplicateUtilisateursDeconected(): Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}utilisateur/deconected/duplicates`;
    return this._http.get<ResponseApi>(API_URL);
  }

  /** Supprime les doublons de matricule (niveau déconcentré), conserve le plus ancien. */
  removeDuplicateUtilisateursDeconected(): Observable<ResponseApi> {
    const API_URL = `${environment.apiUrl}utilisateur/deconected/duplicates`;
    return this._http.delete<ResponseApi>(API_URL);
  }
  getDeconnected(id: number): Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(
      `${environment.apiUrl}utilisateur/deconected/${id}`,
    );
  }

  listUtilisateur(
    page: number,
    size: string,
    filter: string,
  ): Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(
      `${environment.apiUrl}utilisateur/listPage?page=${page}&size=${size}&filter=${filter}`,
    );
  }

  listUtilisateurCount(): Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(
      `${environment.apiUrl}utilisateur/getAll`,
    );
  }

  listUtilisateurCentral(
    page: number,
    size: number,
    filter: string,
  ): Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(
      `${environment.apiUrl}utilisateur/central/listPage?page=${page}&size=${size}&filter=${filter}`,
    );
  }

  listUtilisateurCentralAdvanced(
    page: number,
    size: number,
    filter: string,
    profile: string,
    matricule: string,
    prenom: string,
    nom: string,
    direction: string,
  ): Observable<ResponseApiData> {
    const params = new HttpParams()
      .set("page", Math.max(0, page ?? 0))
      .set("size", size ?? 10)
      .set("filter", (filter ?? "").trim())
      .set("profile", (profile ?? "").trim())
      .set("matricule", (matricule ?? "").trim())
      .set("prenom", (prenom ?? "").trim())
      .set("nom", (nom ?? "").trim())
      .set("direction", (direction ?? "").trim());
    return this._http.get<ResponseApi>(
      `${environment.apiUrl}utilisateur/central/listAvancedPage`,
      { params },
    );
  }

  listParamAdvanced(
    page: number,
    size: number,
    filter: string,
    libelleCorps: string,
    libelleGrade: string,
    libelleSpecialite: string,
  ): Observable<ResponseApiData> {
    return this._http
      .get<ResponseApi>(`${environment.apiUrl}parametre-corps/list-pages?page=${page}&size=${size}&filter=${filter}
    &libelleCorps=${libelleCorps}&libelleGrade=${libelleGrade}&libelleSpecialite=${libelleSpecialite}`);
  }

  getAllCentralUser(
    page: number,
    size: number,
    region: string,
    direction: string,
    division: string,
    bureau: string,
    specialite: string,
    corps: string,
    grade: string,
    matricule: string,
    prenom: string,

    nom: string,
    dateNaissance: string,
    cni: string,
    telephone: string,
    email: string,
  ): Observable<ResponseApiData> {
    // console.log(`${environment.apiUrl}utilisateur/central/listCenPage?page=${page}&size=${size}&region=${region}&direction=${direction}&division=${division}&bureau=${bureau}&specialite=${specialite}&corps=${corps}&grade=${grade}&matricule=${matricule}&prenom=${prenom}&nom=${nom}&dateNaissance=${dateNaissance}&cni=${cni}&telephone=${telephone}&email=${email}`)
    return this._http.get<ResponseApiData>(
      `${environment.apiUrl}utilisateur/central/listCenPage?page=${page}&size=${size}&region=${region}&direction=${direction}&division=${division}&bureau=${bureau}&specialite=${specialite}&corps=${corps}&grade=${grade}&matricule=${matricule}&prenom=${prenom}&nom=${nom}&dateNaissance=${dateNaissance}&cni=${cni}&telephone=${telephone}&email=${email}`,
    );
  }

  getAllDecoUser(
    page: number,
    size: number,
    region: string,
    ia: string,
    ief: string,
    etablissement: string,
    typeSystemeEnseignement: string,
    specialite: string,
    corps: string,
    grade: string,
    matricule: string,
    prenom: string,
    nom: string,
    dateNaissance: string,
    cni: string,
    telephone: string,
    email: string,
  ): Observable<ResponseApiData> {
    const params = new HttpParams()
      .set("page", Math.max(0, page ?? 0))
      .set("size", size ?? 10)
      .set("region", (region ?? "").trim())
      .set("ia", (ia ?? "").trim())
      .set("ief", (ief ?? "").trim())
      .set("etablissement", (etablissement ?? "").trim())
      .set("typeSystemeEnseignement", (typeSystemeEnseignement ?? "").trim())
      .set("specialite", (specialite ?? "").trim())
      .set("corps", (corps ?? "").trim())
      .set("grade", (grade ?? "").trim())
      .set("matricule", (matricule ?? "").trim())
      .set("prenom", (prenom ?? "").trim())
      .set("nom", (nom ?? "").trim())
      .set("dateNaissance", (dateNaissance ?? "").trim())
      .set("cni", (cni ?? "").trim())
      .set("telephone", (telephone ?? "").trim())
      .set("email", (email ?? "").trim());
    return this._http.get<ResponseApiData>(
      `${environment.apiUrl}utilisateur/deconected/listDecoPage`,
      { params },
    );
  }

  listUtilisateurDeconected(
    page: number,
    size: string,
    filter: string,
  ): Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(
      `${environment.apiUrl}utilisateur/deconected/listPage?page=${page}&size=${size}&filter=${filter}`,
    );
  }

  listUtilisateurDeconectedAdvanced(
    page: number,
    size: number,
    filter: string,
    profile: string,
    matricule: string,
    prenom: string,
    nom: string,
    region: string,
    ia: string,
    ief: string,
    etablissement: string,
    typeSystemeEnseignement: string,
  ): Observable<ResponseApiData> {
    const params = new HttpParams()
      .set("page", Math.max(0, page ?? 0))
      .set("size", size ?? 10)
      .set("filter", (filter ?? "").trim())
      .set("profile", (profile ?? "").trim())
      .set("matricule", (matricule ?? "").trim())
      .set("prenom", (prenom ?? "").trim())
      .set("nom", (nom ?? "").trim())
      .set("region", (region ?? "").trim())
      .set("ia", (ia ?? "").trim())
      .set("ief", (ief ?? "").trim())
      .set("etablissement", (etablissement ?? "").trim())
      .set("typeSystemeEnseignement", (typeSystemeEnseignement ?? "").trim());
    return this._http.get<ResponseApi>(
      `${environment.apiUrl}utilisateur/deconected/listAdvandedPage`,
      { params },
    );
  }

  connected(): Observable<any> {
    const API_URL = `${environment.apiUrl}utilisateur/connected`;
    return this._http.get(API_URL);
  }

  // http://localhost:9080/api/v1/mfpai/utilisateur/connected
  // ${environment.apiUrl}utilisateur/currentUser
  getCurrentUser(): Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(
      `${environment.apiUrl}utilisateur/currentUser`,
    );
  }
  //TOP
  getOneUser(idUser: number): Observable<ResponseApiData> {
    return this._http.get<ResponseApi>(
      `${environment.apiUrl}utilisateur/${idUser}`,
    );
  }

  // isCurrentUserInTopN(n: number): Observable<boolean> {
  //   return this._http.get<boolean>(`${environment.apiUrl}utilisateur/prioritaires?n=${n}`);
  // }

  isCurrentUserInTopN(n: number): Observable<boolean> {
    return this._http.get<boolean>(
      `${environment.apiUrl}utilisateur/prioritaire?n=${n}`,
    );
  }

  changeStatus(userId: number): Observable<ResponseApi> {
    return this._http.put<ResponseApi>(
      `${environment.apiUrl}utilisateur/change-status/${userId}`,
      {},
    );
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
    return this._http.get<ResponseApi>(
      `${environment.apiUrl}utilisateur/${userId}`,
    );
  }
  listProfParEtablissement(codeEtablissement: string): Observable<ResponseApi> {
    return this._http.get<ResponseApi>(
      `${environment.apiUrl}utilisateur/deconected/list/${codeEtablissement}`,
    );
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
    return this._http.get<ResponseApi>(
      `${environment.apiUrl}parametre-corps/${paramId}`,
    );
  }
  changeStatusParam(paramId: number): Observable<ResponseApi> {
    return this._http.put<ResponseApi>(
      `${environment.apiUrl}parametre-corps/change-status/${paramId}`,
      {},
    );
  }

  getAllPersonnel(
    page: number,
    size: number,
    region: string,
    structure: string,
    ia: string,
    ief: string,
    etablissement: string,
  ): Observable<ResponseApiData> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString())
      .set("structure", structure)
      .set("region", region)
      .set("ia", ia)
      .set("ief", ief)
      .set("etablissement", etablissement);
    return this._http.get<ResponseApiData>(
      `${environment.apiUrl}utilisateur/personnels/`,
      { params },
    );
  }

  getSearchUser(filter: string): Observable<ResponseApi> {
    return this._http.get<ResponseApi>(
      `${environment.apiUrl}utilisateur/filter-user?filter=${filter}`,
    );
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
    console.log(
      "Appel API:",
      `${environment.apiUrl}utilisateur/personnel/niveau-central${queryParams}`,
    );

    return this._http.get(
      `${environment.apiUrl}utilisateur/personnel/niveau-central${queryParams}`,
    );
  }
}
