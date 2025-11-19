import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "../shared/models/utils/response-api.model";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
/**
 * SERVICE POUR LA GESTION DES DEMANDES DE STAGE
 */
export class DemandeStageService {

    constructor(private _http: HttpClient) {}
    // url principale
    url = `${environment.apiUrl}`+"demandeStage/"
    url_ = `${environment.apiUrl}`+""
    // url demande de stage
    urlDemandeStage = `${environment.apiUrl}`+"disciplineStage"
    // url pour niveau de scolarite
    urlNiveauScolarite = `${environment.apiUrl}`+"niveauScolarite"
    // url pour rapport de stage
    urlRapportStage = `${environment.apiUrl}`+"rapportStage/"
    // url pour l'attestation de stage
    urlAttestationStage = `${environment.apiUrl}`+"attestationStage/"

    /**
     * recuperation de la liste des campagnes
     * @param page
     * @param size
     * @param filterValue
     * @param nom
     * @param dateDebut
     * @param dateFin
     */
    // page, size, filter,numero, prenomDemandeur, nomDemandeur, discipline,dateDebut,dateFin,statut
    getAll(page: number, size: number, filterValue: string, numero: string, prenomDemandeur: string, nomDemandeur: string,  discipline: string,dateDebut: string,dateFin: string,statut: string):Observable<ResponseApi>{
        return this._http.get(this.url+"all?page="+page+"&size="+size+"&filter="+filterValue+"&numero="+numero+"&prenomDemandeur="+prenomDemandeur+"&nomDemandeur="+nomDemandeur+"&discipline="+discipline+"&dateDebut="+dateDebut+"&dateFin="+dateFin+"&statut="+statut);
    }

    /**
     * liste des discipline de stage
     */
    getAllDisciplineStage():Observable<ResponseApi>{
        return this._http.get(this.urlDemandeStage+'/all');
    }

    /**
     * recuperation demande
     * @param id
     */
    getDemande(id: string | null):Observable<ResponseApi>{
        return this._http.get(this.url+"detail-demande-stage/"+id);
    }

    /**
     * liste des niveau scolaire
     */
    getAllNiveauScolarite():Observable<ResponseApi>{
        return this._http.get(this.urlNiveauScolarite+"/all");
    }


    /**
     * autoriser une demande de stage
     * @param id
     */
    autoriserDemande(id: string):Observable<ResponseApi>{
        return this._http.get(this.url+"autoriserDemandeStage/"+id);
    }


    /**
     * ne pas autoriser une demande de stage
     * @param id
     * @param avis
     */
    nonautoriserDemande(id: string | null, avis: string):Observable<ResponseApi>{
       let  body = {
            idDemandeStage: id,
            avis: avis
        }
        return this._http.post(this.url+"nePasautoriserDemandeStage",body);
    }

    /**
     * telechargement fichier
     * @param id
     * @param files
     */
    uploadFile(id: string,files: any):Observable<ResponseApi>{
        return this._http.post(this.url+"file/upload/"+id, files)
    }


    /**
     * telecharger rapport de stage
     * @param id
     * @param files
     */
    uploadFileForRapportStage(id: string,files: any):Observable<ResponseApi>{
        return this._http.post(this.urlRapportStage+"file/upload/"+id, files)
    }

    /**
     * telecharger attestation de stage
     * @param id
     * @param files
     */
    uploadFileForAttestationStage(id: string,files: any):Observable<ResponseApi>{
        return this._http.post(this.urlAttestationStage+"file/upload/"+id, files)
    }

    /**
     * enregistre rapport de stage
     * @param rapportStage
     */
    saveRapportStage(rapportStage: any):Observable<ResponseApi>{
        return this._http.post(this.urlRapportStage+"add", rapportStage)
    }

    /**
     * enregistrer attestation de stage
     * @param attestation
     */
    saveAttestationStage(attestation: any):Observable<ResponseApi>{
        return this._http.post(this.urlAttestationStage+"add", attestation)
    }

    /**
     * imputer demande de stage
     * @param id
     * @param demande
     */
    imputationDemandeStage(id: string,demande: any):Observable<ResponseApi>{
        return this._http.post(this.url+"imputation-demande-stage/"+id, demande)
    }


    /**
     * telecharger fichier
     * @param filename
     */
    downloadFile(filename: string): void {
        this._http.get(environment.apiUrl + "files/download?filename=" + filename, {
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${localStorage.getItem("Token")}`
            },
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
                anchor.download = filename; // Nom de fichier par défaut lors du téléchargement
                anchor.click();

                // Supprimer l'ancrage du document
                document.body.removeChild(anchor);

                // Libérer l'URL blob pour libérer la mémoire
                URL.revokeObjectURL(blobUrl);
            },
            (error) => console.log(error)
        );
    }

    /**
     * enregistrer demande de stage
     * @param demandeStage
     */
    saveDemandeStage(demandeStage: any):Observable<ResponseApi>{
        return this._http.post(this.url+"add",demandeStage)
    }

    /**
     * modifier demande de stage
     * @param demandeStage
     * @param id
     */
    editDemandeStage(demandeStage: any, id: string):Observable<ResponseApi>{
        return this._http.post(this.url+"edit-demande-stage/"+id,demandeStage)
    }

    /**
     * verifier si l'utilisateur connecter est du Bureau DFC
     */
    isCurrentUserInDFCBureau():Observable<ResponseApi>{
        return this._http.get(this.url+"isCurrentUserInDFRBureau")
    }



    authorisationDeStage(data: any):Observable<ResponseApi>{
        // /autorisation-demande-stage/{id}
        return this._http.post(this.url+"autorisation-demande-stage",data)
    }

    uploadFileForAuthorization(id: string,data: any):Observable<ResponseApi>{
        return this._http.post(this.url_+"file/upload/"+id+"/demandeStage",data)
    }


    nombreDemandeStageAutoriserNonAutoriserEnregistrer():Observable<ResponseApi>{
        return this._http.get(this.url+"nombre-demande-autoriser-non-autoriser-enregistrer");
    }

}
