
import { Location } from "@angular/common";
import { Component, OnInit, TemplateRef, ViewChild, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";

import { ResponseApi2 } from "src/app/shared/models/ResponseApi";
import { MutationDTO } from "../../../demandes-mutation-permutation-recues/models/mutationDTO";
import { TraitementMutation } from "../../../demandes-mutation-permutation-recues/models/traitementMutation";
import { CredentialsService } from "src/app/services/credentials.service";
import { MutationService } from "../../../demandes-mutation-permutation-recues/services/mutation.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { FileService } from "src/app/shared/services/files/file.service";

@Component({
  selector: 'app-traitement-mutation',
  templateUrl: './traitement-mutation.component.html',
  styleUrls: ['./traitement-mutation.component.css']
})

export class TraitementMutationComponent implements OnInit {

  infosBeneficiairesGroup = this._formBuilder.group({});
  infosDemandeursGroup = this._formBuilder.group({});
  transmissionBordereauxGroup = this._formBuilder.group({});

  demandePecForm!: FormGroup;
  modifForm!: FormGroup;
  rejetcForm!: FormGroup;

  closeResult = '';
  idMutation : any
  mutation: MutationDTO = new MutationDTO;
  @ViewChild('rejetModal') rejetModal!: TemplateRef<any>;
  @ViewChild('amodifierModal') amodifierModal!: TemplateRef<any>;
  userInfos: any
  profilConnecte: any;
  profile: any;
  pourTraitementDGPEEC: boolean = false;
  piecesJointesFiles: File[] = [];
  dossierSigneFiles: File[] = [];
  submitting = false;
  disableAction = true
  get utiliseBordereau(): boolean {
    return ['Représentant-IEF', 'Representant-IA']
      .includes(this.profile);
  }
  get bordereauRecuVisible(): boolean {
    return !!this.mutation.currentBordereauTransmission
      && !['Chef-etablissement', 'Chef-cfp', 'Chef-EFF'].includes(this.profile);
  }
  constructor(
    private _formBuilder: FormBuilder,
    private location: Location,
    private router: Router,
    private readonly _fb: FormBuilder,
    public modalService: NgbModal = inject(NgbModal),
    private readonly mutationService : MutationService,
    private readonly _activatedRoute : ActivatedRoute,
    private readonly _credentialService: CredentialsService,
    private readonly fileService: FileService,
    private spinner: NgxSpinnerService,
  ) {
    this.idMutation = this._activatedRoute.snapshot.paramMap.get('dataId')

    this.userInfos = this._credentialService.getUserInfos();
    this.profilConnecte = this.userInfos.profil
    this.profile = this.profilConnecte[0].code
    let prof = this.profilConnecte.find((pro : any) =>( (pro.code === "Chef-division-dgpeec")) )

    if(prof){
      this.pourTraitementDGPEEC = true
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.getOneMutation()
  }

  initForm(): void {
    this.modifForm = this._fb.group({
      motifModification:  ['', Validators.required],
    });
    this.rejetcForm = this._fb.group({
      motifReject:  ['', Validators.required],
    });

  }
  getOneMutation(){
    this.mutationService.get(this.idMutation)
        .subscribe({
          next : (data : ResponseApi2) =>{
            if(data.status?.includes("OK")) {
              this.mutation = data.payload;
              // Le rôle de cette étape ne dépend pas de l'ordre des profils du compte.
              this.profile = this.mutation.profilDevantTraiter;
              this.pourTraitementDGPEEC = this.profile === 'Chef-division-dgpeec';
            }
          }
        })
  }
  onSaveDemande() {
    Swal.fire({
      icon: "success",
      html: "La demande de mutation a été enregistrée avec succès.",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      this.router.navigate(["gpeec/demande-mutation-permutation"]);
    });
  }

  onReset() {
    Swal.fire({
      title: "Confirmation",
      text: "Voulez-vous annuler l'enregistrement ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1D4A7B",
      cancelButtonColor: "#FF4D4F",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          html: "L’enregistrement a été annulé avec succès.",
          icon: "success",
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        }).then(() => {
          this.location.back();
        });
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
    let traitementMutation : TraitementMutation = new TraitementMutation()
    traitementMutation.motif = this.rejetcForm.value.motifReject
    traitementMutation.codeStatutMutation = "REJETER"
    traitementMutation.idTraiteur = this.userInfos.id
    if(traitementMutation.motif && traitementMutation.motif !="")
      this.mutationService.Traitement(this.mutation.id, this.piecesJointesFiles[0], traitementMutation)
          .subscribe({
            next : (data : ResponseApi2) =>{
              if(data.status?.includes('OK'))
                console.log({datR : data})
              Swal.fire({
                icon: 'success',
                html: 'Demande de mutation <b>'+ this.mutation.numeroRef +'</b> rejetée.',
                showConfirmButton: false,
                timer: 3000
              }).then(() => {
                this.location.back();
                this.closeModal();
              })
            }
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
    let traitementMutation : TraitementMutation = new TraitementMutation()
    traitementMutation.motif = this.modifForm.value.motifModification
    traitementMutation.codeStatutMutation = "AMODIFIER"
    traitementMutation.idTraiteur = this.userInfos.id

    if(traitementMutation.motif && traitementMutation.motif !="")
      this.mutationService.Traitement(this.mutation.id, this.piecesJointesFiles[0], traitementMutation)
          .subscribe({
            next : (data : ResponseApi2) =>{
              if(data.status?.includes('OK'))
                console.log({datM : data})
              Swal.fire({
                icon: 'success',
                html: 'Demande de mutation <b>'+ this.mutation.numeroRef +'</b> modifiée avec succès.',
                showConfirmButton: false,
                timer: 3000
              }).then(() => {
                this.location.back();
                this.closeModal();
              })
            }
          })

  }

  onValid() {
    if (this.submitting) return;
    if (this.utiliseBordereau && !this.piecesJointesFiles.length) {
      Swal.fire({icon: 'warning', text: 'Veuillez joindre le bordereau de réception et de transmission.'});
      return;
    }
    if (!this.dossierSigneFiles.length) {
      Swal.fire({icon: 'warning', text: 'Téléchargez le dossier, signez-le puis déposez la version signée avant de transmettre.'});
      return;
    }
    let traitementMutation : TraitementMutation = new TraitementMutation()
    traitementMutation.motif = "Accepter par le chef : avant transmission pour signature par le ministre"
    traitementMutation.codeStatutMutation = this.nextStatus(this.profile)
    traitementMutation.idTraiteur = this.userInfos.id

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
        this.submitting = true;
        this.spinner.show()
        this.mutationService.Traitement(this.mutation.id, this.utiliseBordereau ? this.piecesJointesFiles[0] : undefined, traitementMutation, this.dossierSigneFiles[0])
            .subscribe({
              next : (data : ResponseApi2) =>{
                this.submitting = false;
                this.spinner.hide();
                if(data.status?.includes('OK'))
                  Swal.fire({
                    html: 'Demande de mutation <b>'+ this.mutation.numeroRef +'</b> validée avec succès.',
                    icon: 'success',
                    timer: 1500,
                    showCancelButton: false,
                    showConfirmButton: false
                  }).then(() => {
                    this.spinner.hide()
                    this.location.back();
                  })
                else Swal.fire({icon: 'error', text: data.message || 'La transmission a échoué.'});
              },
              error: () => {
                this.submitting = false;
                this.spinner.hide();
                Swal.fire({icon: 'error', text: 'Le dossier n’a pas été transmis. Veuillez réessayer.'});
              }
            });
      }
    })

  }

  goBack() {
    this.location.back()
  }

  telechargerDossier(fileName: string) { this.fileService.telecharger(fileName); }
  selectionnerDossier(event: { addedFiles: File[] }) { this.dossierSigneFiles = event.addedFiles.slice(0, 1); }

  visualiserPieceJointe(doc: any) {
    if (doc?.generatedName)
      this.fileService.openPdfInNewTab(doc.generatedName);
  }

  telechargerPieceJointe(doc: any) {
    if (doc?.generatedName)
      this.fileService.telecharger(doc.generatedName);
  }

  nextStatus(profilTraitant : string) : string{
    let statut = ""
    if(profilTraitant?.includes("Chef-service") )
      profilTraitant =  "Chef-service"

    if(profilTraitant?.includes("Chef-division") && profilTraitant !=="Chef-division-dgpeec")
      profilTraitant = "Chef-division"

    switch(profilTraitant){
      case "Chef-etablissement": 
          if(this.mutation.origineDemandeurLog.ief)
            statut = "REC-CE-IEF"
          else statut = "REC-CE-IA"
        break;
    
    case "Représentant-IEF":
          statut = "REC-IEF"
        break;
    case "Representant-IA":
          statut = "REC-IA";
        break;

      case "Représentant-IEF":
        statut = "REC-IEF"
        break;
      case "Representant-IA":
        statut = "REC-IA";
        break;

      case "Directeur-DRH":
        statut = "REC-DRH"
        break;

      case "Chef-division":
        statut = "REC-DIV"
        break;
      case "Chef-service":
        statut = "REC-SERV"
        break;
      case "Chef-division-dgpeec":
        statut = "REC-DGPEEC"
        break;
      case "Chef-EFF":
          statut = "REC-DR-EFF"
          break;
      case "Chef-cfp":
        statut = "REC-DR-CFP"
        break;
      default : break;

    }
    return statut;
  }

  onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
    this.disableAction = false
    if(this.piecesJointesFiles.length == 0)
      filesArray.push(...event.addedFiles);
  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
    if(this.piecesJointesFiles.length == 0)
      this.disableAction = true
  }
}
