import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActeService } from 'src/app/services/acteService.service';
import { ActeDTO } from '../../mes-demandes/components/models/ActeDTO';
import { UserDTOs } from 'src/app/models/UserDTOs';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { environment } from 'src/environments/environment';
import { FileService } from 'src/app/shared/services/files/file.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-view-demande-recus',
  templateUrl: './view-demande-recus.component.html',
  styleUrls: ['./view-demande-recus.component.css']
})
export class ViewDemandeRecusComponent {
  actId: any;
  idNumber!:number;
  acte : ActeDTO = new ActeDTO();
  agent!:UserDTOs;
  fileUrl = environment.apiUrl + "file/download"
  uploadurl="C:/Users/hthiam/Desktop/Gainde2000/SIGRH_MFPAI/docs/files/";
  fileContent: any;
  previewUrl: string | null = null;
  previewSafeUrl: SafeResourceUrl | null = null;
  previewName = '';
  previewType = '';

  
  constructor(
    private location: Location,
    private router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly acteService: ActeService,
    private readonly fileService:FileService,
    private readonly sanitizer: DomSanitizer,
    ) { 
      this.actId = this.activatedRoute.snapshot.paramMap.get('demandeId')
    }

  ngOnInit(): void {
    this.getOneDemande();
   
  }

  getOneDemande(){
    this.acteService.getActe(this.actId)
        .subscribe({
          next : (data : ResponseApi2) => {
            if(data.status?.includes("OK")){
              this.acte = data.payload;
              //console.log({acte:this.acte});
             // console.log({acte:this.acte});
            }
          }
        });
}
 

telecharger(item:string){
  //console.log(item);
  this.fileService.telecharger(item)
}

  getPredBordereau(fileName:string){
    this.fileService.getFile(fileName).subscribe(file => {
      // Créer un Blob à partir de la réponse du fichier
      const fileBlob = new Blob([file], { type: file.type });
    
      // Vous pouvez maintenant utiliser fileBlob pour d'autres opérations
      //console.log('Fichier récupéré sous forme de Blob:', fileBlob);
    
      // Par exemple, vous pourriez l'enregistrer ou l'envoyer ailleurs
      // saveAs(fileBlob, fileName); // si vous utilisez file-saver par exemple
    }, error => {
      console.error('Erreur lors de la récupération du fichier', error);
    });
  }

visualiser(fileName: string): void {
  this.fileService.getFile(fileName).subscribe(file => {
    const blobUrl = URL.createObjectURL(file);
    // Créer un élément d'ancrage invisible dans le document
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    // Définir l'URL de l'ancrage sur l'URL blob et déclencher un clic
    anchor.href = blobUrl;
  
  });
}


visualiser2(file: any): void {
  const fileName = typeof file === 'string' ? file : file?.generatedName;
  if (!fileName) return;

  this.closePreview();
  this.fileService.getFile(fileName).subscribe({
    next: (blob: Blob) => {
      this.previewUrl = URL.createObjectURL(blob);
      this.previewSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
      this.previewName = file?.originalName || fileName;
      this.previewType = blob.type || file?.fileType || '';
    },
    error: () => this.fileService.showSwal('error', 'Impossible d’ouvrir ce document.')
  });
}

closePreview(): void {
  if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
  this.previewUrl = null;
  this.previewSafeUrl = null;
  this.previewName = '';
  this.previewType = '';
}

isImagePreview(): boolean { return this.previewType.startsWith('image/'); }

isPreviewSupported(): boolean {
  return this.isImagePreview() || this.previewType === 'application/pdf' || this.previewType.startsWith('text/');
}

getFileExtension(file: any): string {
  const name = file?.originalName || file?.generatedName || file || '';
  return (name.includes('.') ? name.split('.').pop() : 'DOC').toUpperCase();
}

formatFileSize(size?: number | null): string {
  return size ? `${size} Ko` : '';
}










/* b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}
 */








  goBack() {
    this.location.back()
  }
}
