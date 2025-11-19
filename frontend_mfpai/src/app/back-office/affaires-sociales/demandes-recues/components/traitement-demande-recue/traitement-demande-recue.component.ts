import { Location } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CredentialsService } from 'src/app/services/credentials.service';
import { DemandePecService } from 'src/app/services/demandePecService';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { FileService } from 'src/app/shared/services/files/file.service';
import Swal from 'sweetalert2';
import { DemandePecDTO } from '../../../models/DemandePecDTO';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';

@Component({
  selector: 'app-traitement-demande-recue',
  templateUrl: './traitement-demande-recue.component.html',
  styleUrls: ['./traitement-demande-recue.component.css']
})
export class TraitementDemandeRecueComponent implements OnInit {

  closeResult = '';

  @ViewChild('rejetModal') rejetModal!: TemplateRef<any>;
  @ViewChild('amodifierModal') amodifierModal!: TemplateRef<any>;

  selectedDiscipline: string = '';
  piecesJointesFiles: File[] = [];
  demandeId!:any;
  demande!:DemandePecDTO;
  userInfos: any;
  userId:any;


  constructor(
    private location: Location,
    private router: Router,
    public modalService: NgbModal = inject(NgbModal),
    private readonly activatedRoute: ActivatedRoute,
    private readonly demandePecService: DemandePecService,
    private readonly credentialService: CredentialsService,
    private readonly userService:UtilisateurService,
    private readonly fileService:FileService,
    private readonly demandeService:DemandePecService
  ) { 
    this.demandeId = this.activatedRoute.snapshot.paramMap.get('dataId')
    this.userInfos = this.credentialService.getUserInfos();
    this.userId=this.userInfos.id;
    if(this.userInfos)
    console.log({mess:this.userInfos});

  }

  ngOnInit(): void {
    this.getOneDemande();
  }


  getOneDemande(){
    this.demandePecService.getDemandePec(this.demandeId)
        .subscribe({
          next : (data : ResponseApi2) => {
            if(data.status?.includes("OK")){
              this.demande = data.payload;
              console.log({acte:this.demande});
            }
          }
        });
}

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
    this.demandePecService.traiterPec(this.demandeId,this.userId,"rejeter","","")
        .subscribe({
          next : (data : ResponseApi2) => {
            if(data.status?.includes("OK")){
              this.demande = data.payload;
              console.log({acte:this.demande});
            }
          }
        });
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
    this.demandePecService.traiterPec(this.demandeId,this.userId,"modifier","","")
    .subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK")){
          this.demande = data.payload;
          console.log({acte:this.demande});
        }
      }
    });
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


