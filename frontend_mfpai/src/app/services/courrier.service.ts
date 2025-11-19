import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "../shared/models/utils/response-api.model";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
/**
 * SERVICE POUR LA GESTION DES CAMPAGNE
 */
export class CourrierService {

    constructor(private _http: HttpClient) {}
    // url = 'http://localhost:9080/api/v1/mfpai/campagne/'
    url = `${environment.apiUrl}`+"courrier/"

    /**
     * recuperation de la liste des campagnes
     * @param page
     * @param size
     * @param filterValue
     * @param nom
     * @param dateDebut
     * @param dateFin
     */
    getAll(page: number, size: number, filterValue: string, reference: string, typeDemande: string, direction: string,  division: string,typeCourrier: string,statut: string):Observable<ResponseApi>{

        return this._http.get(this.url+"all?page="+page+"&size="+size+"&filter="+filterValue+"&typeDemande="+typeDemande+"&direction="+direction+"&division="+division+"&typeCourrier="+typeCourrier+"&statut="+statut);
    }
    saveCourrier(courrier: any):Observable<ResponseApi>{
        return this._http.post(this.url+"add", courrier)
    }

    verifyIfUserCanCreateCourrier():Observable<ResponseApi>{
        return this._http.get(this.url+"verifyIfUserCanCreateCourrier")
    }

    listTypeDemandeCourrierByDivisionAndNomTypeCourrier(divisionCode:string, nomTypeCourrier:string):Observable<ResponseApi>{
        return this._http.get(this.url+"list-type-demande-courrier-by-divison-and-nom-type-courrier/"+divisionCode+"/"+nomTypeCourrier)
    }

    listTypeDemandeCourrier():Observable<ResponseApi>{
        return this._http.get(this.url+"list-type-demande-courrier")
    }
    traiterCourrier(id: string): Observable<ResponseApi>{
        return this._http.get(this.url+"traiter-courrier/"+id)
    }


    nombreDeCourrierTraiterEtNomTraiter(): Observable<ResponseApi>{
        return this._http.get(this.url+"nombre-courrier-traiter-nontraiter")
    }
}
