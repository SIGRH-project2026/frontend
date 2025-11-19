import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "../shared/models/utils/response-api.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
/**
 * SERVICE POUR LA GESTION DES CAMPAGNE
 */
export class CampagneService {

  constructor(private _http: HttpClient) {}
  // url = 'http://localhost:9080/api/v1/mfpai/campagne/'
  url = `${environment.apiUrl}`+"campagne/"

  /**
   * recuperation de la liste des campagnes
   * @param page
   * @param size
   * @param filterValue
   * @param nom
   * @param dateDebut
   * @param dateFin
   */
  getAll(page: number, size: number, filterValue: string, nom: string, dateDebut: string, dateFin: string):Observable<ResponseApi>{
    return this._http.get(this.url+"all?page="+page+"&size="+size+"&filter="+filterValue+"&nom="+nom+"&dateDebut="+dateDebut+"&dateFin="+dateFin);
  }

  /**
   * recuperation de la liste des expression de besoin d'un campagne (via id)
   * @param page
   * @param size
   * @param filterValue
   * @param statut
   * @param id
   */
  getAllExpressionDeBesoin(page: number, size: number, filterValue: string,statut: string,  besoin: string,  prenomDemandeur: string,  nomDemandeur: string,  date: string, id: string | null):Observable<ResponseApi>{
    return this._http.get(this.url+"expressionDeBesoin/"+id+"?page="+page+"&size="+size+"&filter="+filterValue+"&statut="+statut+"&besoin="+besoin+"&prenomDemandeur="+prenomDemandeur+"&nomDemandeur="+nomDemandeur+"&date="+date);
  }

  exportation(id: string | null):Observable<ResponseApi>{

    return this._http.get(this.url+"generateExcel");
  }


  /**
   * recuperation de la campagne
   * @param id
   */
  getCampagne(id: string):Observable<ResponseApi>{
    return this._http.get(this.url+"get/"+id);
  }

  /**
   * enregistremenent d'une campagne
   * @param campagne
   */
  saveCampagne(campagne: any):Observable<ResponseApi>{
    return this._http.post(this.url+"add", campagne)
  }

  /**
   * modifier une expression de besoin
   * @param id
   * @param campagne
   */
  editCampagne(id: number,campagne: any):Observable<ResponseApi>{
    return this._http.post(this.url+"edit/"+id, campagne)
  }

  /**
   * demarrer une expression de besoin
   * @param id
   */
  startCampagne(id: number):Observable<ResponseApi>{
    return this._http.get(this.url+"start/"+id)
  }

  /**
   * clôturer une expression de besoin
   * @param id
   */
  stopCampagne(id: number):Observable<ResponseApi>{
    return this._http.get(this.url+"stop/"+id)
  }

  saveCampgneFile(file: any, id: string): Observable<ResponseApi>{
    return this._http.post(`${environment.apiUrl}file/campagne/${id}`, file)
  }



  // /file/campagne/{idCampagne}/{idFile}
  deleteCampgneFile(idCampagne: string,idFile: string): Observable<ResponseApi>{
    return this._http.delete(`${environment.apiUrl}file/campagne/${idCampagne}/${idFile}`)
  }


  downloadFile(campagne: any): void {
    // this._http.get(this.url+"generateExcel")
    this._http.get(this.url+"generateExcel/"+campagne.id, {
      // headers: {
      //   'accept': '*/*',
      //   'Authorization': `Bearer ${localStorage.getItem("Token")}`
      // },
      responseType: 'blob' // traiter la réponse comme un blob
    }).subscribe(
        (response: Blob) => {
          // Créer une URL pour le contenu blob afin de pouvoir l'ouvrir dans une nouvelle fenêtre ou le télécharger
          const blobUrl = URL.createObjectURL(response);

          // Créer un élément d'ancrage invisible dans le document
          const anchor = document.createElement('a');
          anchor.style.display = 'none';
          document.body.appendChild(anchor);

          // Définir l'URL de l'ancrage sur l'URL blob et déclencher un clic
          anchor.href = blobUrl;
          anchor.download = "EB_Campagne_Du_"+campagne.dateDebut+"_Au_"+campagne.dateFin+".xlsx"; // Nom de fichier par défaut lors du téléchargement
          anchor.click();

          // Supprimer l'ancrage du document
          document.body.removeChild(anchor);

          // Libérer l'URL blob pour libérer la mémoire
          URL.revokeObjectURL(blobUrl);
        },
        (error) => console.log(error)
    );
  }

}
