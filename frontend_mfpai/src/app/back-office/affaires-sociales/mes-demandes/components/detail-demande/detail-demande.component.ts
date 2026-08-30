import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ActeService } from 'src/app/services/acteService.service';
import { CredentialsService } from 'src/app/services/credentials.service';
import { DemandePecService } from 'src/app/services/demandePecService';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { FileService } from 'src/app/shared/services/files/file.service';
import { DemandePecDTO } from '../../../models/DemandePecDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-demande',
  templateUrl: './detail-demande.component.html',
  styleUrls: ['./detail-demande.component.css']
})
export class DetailDemandeComponent implements OnDestroy {

  demandeId!:any;
  demande!:DemandePecDTO;
  isLoading = true;
  previewUrl: string | null = null;
  previewSafeUrl: SafeResourceUrl | null = null;
  previewName = '';
  previewType = '';

   constructor(
    private location: Location,
    private router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly demandePecService: DemandePecService,
    private readonly credentialService: CredentialsService,
    private readonly userService:UtilisateurService,
    private readonly fileService:FileService,
    private readonly demandeService:DemandePecService,
    private readonly sanitizer: DomSanitizer
  ) { 
    this.demandeId = this.activatedRoute.snapshot.paramMap.get('dataId')

  }

  ngOnInit(): void {
    this.getOneDemande();
   
  }
  
  goBack() {
    this.location.back()
  }


  getOneDemande(){
    this.demandePecService.getDemandePec(this.demandeId)
        .subscribe({
          next : (data : ResponseApi2) => {
            if(data.status?.includes("OK")){
              this.demande = data.payload;
            }
            this.isLoading = false;
          },
          error: () => this.isLoading = false
        });
}

  get statusClass(): string {
    const code = this.demande?.statutPriseEnCharge?.code?.toLowerCase() || 'default';
    return `status-${code}`;
  }

telecharger(item:string){
  //console.log(item);
  this.fileService.telecharger(item)
}

  visualiser(file: any): void {
    if (!file?.generatedName) return;
    this.closePreview();
    this.fileService.getFile(file.generatedName).subscribe({
      next: (blob: Blob) => {
        this.previewUrl = URL.createObjectURL(blob);
        this.previewSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
        this.previewName = file.originalName || file.generatedName;
        this.previewType = blob.type || file.fileType || '';
      },
      error: () => Swal.fire({ icon: 'error', text: 'Impossible d’ouvrir ce document.' })
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
  isPreviewSupported(): boolean { return this.isImagePreview() || this.previewType === 'application/pdf' || this.previewType.startsWith('text/'); }
  ngOnDestroy(): void { this.closePreview(); }

}
