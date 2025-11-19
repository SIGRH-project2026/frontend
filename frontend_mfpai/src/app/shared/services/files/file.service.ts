import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, Observable, throwError} from "rxjs";
import { ResponseApiData } from 'src/app/models/response-api.model';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  apiUrl: string = environment.apiUrl;
  endpoint : string = 'files'

  constructor(private _httpClient: HttpClient) { }
    
 /*  getAll = (): Observable<ResponseApi2> =>{
    return this._httpClient.get(`${this.apiUrl}${this.endpoint}/list`)
  }
 */
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

  storeSingle(idAppartenance:number, files:File[],type:string)
  {
    const formData = new FormData();
    //or (let i = 1; i < files.length; i++) {
      formData.append('file', files[0]);  
  //s  }
    return this._httpClient.post(`${this.apiUrl}${this.endpoint}/file/singleUpload/${idAppartenance}/${type}`,formData ).pipe(
      catchError(this.handleError)
    );
  }

  storeSingleDiplomeFile(idAppartenance:number,file: File[]){
    console.log(" XXXXXX entrer service diplome store");
    const formData = new FormData();
    formData.append('file', file[0]);
    return this._httpClient.post(`${this.apiUrl}file/upload_diplome/${idAppartenance}`,formData).pipe(
      catchError(this.handleError)
    );
  }

  storeSingleAvancementFile(idAppartenance:number,file: File[]){
    console.log("YYYY entrer service avancement store");
    const formData = new FormData();
    formData.append('file', file[0]);
    console.log("avancement formData ",formData);
    
    return this._httpClient.post(`${this.apiUrl}file/upload_avancement/${idAppartenance}`,formData).pipe(
      catchError(this.handleError)
    );
  }

  storeSingleEtatcivilFile(idAppartenance:number,file: File[]){    
    const formData = new FormData();
    formData.append('file', file[0]);
    return this._httpClient.post(`${this.apiUrl}file/upload_etat_civil/${idAppartenance}`,formData).pipe(
      catchError(this.handleError)
    );
  }

  storeSingleActeFile(idAppartenance:number,file: File[]){    
    const formData = new FormData();
    formData.append('file', file[0]);
    return this._httpClient.post(`${this.apiUrl}file/upload_acte/${idAppartenance}`,formData).pipe(
      catchError(this.handleError)
    );
  }

  storeSingleImputationFile(idAppartenance:number,file: File){
    const formData = new FormData();
    formData.append('file', file);
      
    return this._httpClient.post(`${this.apiUrl}file/upload_imputation/${idAppartenance}`,formData).pipe(
      catchError(this.handleError)
    );
  }

  storeSingleBordereauFile(idTraitement:number,file: File){
    const formData = new FormData();
    formData.append('file', file);
      
    return this._httpClient.post(`${this.apiUrl}file/bordereauPermutation/${idTraitement}`,formData).pipe(
      catchError(this.handleError)
    );
  }


  storeFile(idAppartenance:number, files:File[])  {
    const formData = new FormData();
    //or (let i = 1; i < files.length; i++) {
      formData.append('file', files[0]);  
  //s  }
    return this._httpClient.post(`${this.apiUrl}${this.endpoint}/file/upload/${idAppartenance}`,formData ).pipe(
      catchError(this.handleError)
    );
  }

  storeMultipleFiles(idAppartenance:number,type:string,files:File[])  {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);  
    }
    
    console.log(formData)
    return this._httpClient.post(`${this.apiUrl}file/upload/${idAppartenance}/${type}`,formData ).pipe(
      catchError(this.handleError)
    );
  }

  download(fileName:string){
    console.log(fileName)
    return this._httpClient.get(`${this.apiUrl}file/download/${fileName}`).pipe(
      catchError(this.handleError)
    );
  }


  telecharger(filename:string){
    console.log("Telechargeons");
    this._httpClient.get(`${this.apiUrl}file/download/${filename}`, {
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


 /*  storeSingleImputationFile(idAppartenance: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);


    return this._httpClient.post(`${this.apiUrl}file/upload_imputation/${idAppartenance}`,formData).pipe(
        catchError(this.handleError)
    );
  } */




    // Fonction pour générer l'URL du fichier
  getFileUrl(fileName: string): string {
    return `${this.apiUrl}/file/file/${fileName}`;
  }

  // Fonction pour récupérer le fichier en tant que blob
  getFile(fileName: string): Observable<Blob> {
    const url = `${this.apiUrl}file/view/${fileName}`;
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    });
    return this._httpClient.get(url, { responseType: 'blob' });
  }



  openPdfInNewTab(fileName:string) {
    const url = `${this.apiUrl}file/view/${fileName}`;
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    });
    this._httpClient.get(url, {responseType:'blob',
     // headers:headers
    }).
    subscribe(blob =>{const url = window.URL.createObjectURL(blob);
      window.open(url,'_blank');
    });
  }


  storeBordereaux(idAppartenance:number, files:File[])
  {
   // console.log({files:files})
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);  
    }
    console.log(formData)
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    });
    return this._httpClient.post(`${this.apiUrl}file/bordereau/${idAppartenance}`,formData ).pipe(
      catchError(this.handleError)
    );
  }
  
}
