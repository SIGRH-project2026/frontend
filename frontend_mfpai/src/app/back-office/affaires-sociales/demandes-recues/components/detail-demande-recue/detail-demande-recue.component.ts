import { Location } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CredentialsService } from 'src/app/services/credentials.service';
import { DemandePecService } from 'src/app/services/demandePecService';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { FileService } from 'src/app/shared/services/files/file.service';
import Swal from 'sweetalert2';
import { DemandePecDTO } from '../../../models/DemandePecDTO';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detail-demande-recue',
  templateUrl: './detail-demande-recue.component.html',
  styleUrls: ['./detail-demande-recue.component.css']
})
export class DetailDemandeRecueComponent implements OnInit, OnDestroy {

  @Input() typeView: "Visualiser" | "Traiter" = "Visualiser";
  
  closeResult = '';

  @ViewChild('rejetModal') rejetModal!: TemplateRef<any>;
  @ViewChild('amodifierModal') amodifierModal!: TemplateRef<any>;

  selectedDiscipline: string = '';
  piecesJointesFiles: File[] = [];
  demandeId!:any;
  modifModiForm!:FormGroup;
  modifRejetForm!:FormGroup;
  demande!:DemandePecDTO;
  isLoading = true;
  previewUrl: string | null = null;
  previewSafeUrl: SafeResourceUrl | null = null;
  previewName = '';
  previewType = '';
  userInfos: any;
  userId:any;

  constructor(
    private location: Location,
    private router: Router,
    private readonly _fb : FormBuilder,
    public modalService: NgbModal = inject(NgbModal),
    private readonly activatedRoute: ActivatedRoute,
    private readonly demandePecService: DemandePecService,
    private readonly credentialService: CredentialsService,
    private readonly userService:UtilisateurService,
    private readonly fileService:FileService,
    private readonly demandeService:DemandePecService,
    private readonly sanitizer: DomSanitizer
  ) {
    this.demandeId = this.activatedRoute.snapshot.paramMap.get('dataId')
    this.userInfos = this.credentialService.getUserInfos();
    this.userId=this.userInfos.id;

    /*if(this.userInfos)
    console.log({mess:this.userInfos});

     */
   }

  ngOnInit(): void {
    this.getOneDemande();
    this.initModifForm();
    this.initRejetForm();
  }

  initModifForm(): void {
    this.modifModiForm = this._fb.group({
      motifModification:['']
    });
  }

  initRejetForm(): void {
    this.modifRejetForm = this._fb.group({
      motifRejetDemande:['',Validators.required]
    });
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
 // console.log(item);
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

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: '520px', centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  onReset() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous annuler l\'enregistrement ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          html: 'L’enregistrement  a été annulé avec succès.',
          icon: 'success',
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false
        }).then(() => {
          this.location.back();
        })
      }
    });
  }

  onRejet() {
 
    Swal.fire({
      title: 'Rejet de la demande',
      text: 'Voulez-vous confirmer le rejet ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        this.openModal(this.rejetModal);
      }
    });
  }

  onSaveRejet() {
     console.log({modif:this.modifRejetForm.value.motifRejetDemande})
    this.demandePecService.traiterPec(this.demandeId,this.userId,"rejeter","",this.modifRejetForm.value.motifRejetDemande)
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK")){
          this.demande = data.payload;
        }
      }
    });
    Swal.fire({
      icon: 'success',
      html: 'Demande prise en charge rejetée avec succès.',
      showConfirmButton: false,
      timer: 3000
    }).then(() => {
      this.location.back();
      this.closeModal();
    })
  }

  onModifier() {
    Swal.fire({
      title: 'Modifier de la demande',
      text: 'Voulez-vous confirmer la modification ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        this.openModal(this.amodifierModal);
      }
    });
  }
  onSaveModifier() {
    console.log("Valeur du motif de la modification:", this.modifModiForm.value.motifModification);
    this.demandePecService.traiterPec(this.demandeId,this.userId,"modifier",this.modifModiForm.value.motifModification,"")
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK")){
          this.demande = data.payload;
         // console.log({demande:this.demande});
        }
      }
    });
    Swal.fire({
      icon: 'success',
      html: 'Demande prise en charge modifiée avec succès.',
      showConfirmButton: false,
      timer: 3000
    }).then(() => {
      this.location.back();
      this.closeModal();
    })
  }

  onValid() {
    this.demandePecService.traiterPec(this.demandeId,this.userId,"valider","","")
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK")){
          this.demande = data.payload;
          //console.log({acte:this.demande});
        }
      }
    });
    Swal.fire({
      title: 'Validation',
      text: 'Voulez-vous confirmer la validation ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          html: 'Demande prise en charge validée avec succès.',
          icon: 'success',
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false
        }).then(() => {
          this.location.back();
        })
      }
    });
  }

  goBack() {
    this.location.back()
  }
}
