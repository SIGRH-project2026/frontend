import { Location } from "@angular/common";
import { Component, OnInit, TemplateRef, ViewChild, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { PermutationService } from "../../service/permutation.service";
import { PermutationDTO } from "../../model/Permutation";
import { CredentialsService } from "src/app/services/credentials.service";
import { ResponseApi2 } from "src/app/shared/models/ResponseApi";
import { FileService } from "src/app/shared/services/files/file.service";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-permutation',
  templateUrl: './edit-permutation.component.html',
  styleUrls: ['./edit-permutation.component.css']
})
export class EditPermutationComponent implements OnInit {
  
  infosBeneficiairesGroup = this._formBuilder.group({});
  infosDemandeursGroup = this._formBuilder.group({});

  demandePecForm!: FormGroup;
  idPermutation !: number
  permutation !: PermutationDTO
  motifModifForm !: FormGroup
  motifRejetForm !: FormGroup
  userInfos : any
  profilConnecte : any
  pourTraitement = false;
  aModifierForm !: FormGroup
  type : string = "emise"  
  closeResult = '';
  profile : any
  isProfOrFormateur: boolean =false;
  isDGPEEC : boolean= false
  apiUrl: string = environment.apiUrl;


  @ViewChild('rejetModal') rejetModal!: TemplateRef<any>;
  @ViewChild('amodifierModal') amodifierModal!: TemplateRef<any>;

  constructor(
    private _formBuilder: FormBuilder,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private readonly _fb: FormBuilder,
    private readonly _credentialService: CredentialsService,
    public modalService: NgbModal = inject(NgbModal),
    private readonly permutationService: PermutationService,
    private readonly fileService: FileService,
    private _httpClient: HttpClient


  ) {
    this.userInfos = this._credentialService.getUserInfos();
    this.profilConnecte = this.userInfos.profil
    this.profile = this.profilConnecte[0].code
    let prof = this.profilConnecte.find((pro : any) =>( (pro.code === "bureau-mo-rec") || (pro.code === "Chef-division-dgpeec")||
    (pro.code === "Représentant-IEF") || (pro.code === "Representant-IA") || (pro.code === "Chef-EFF") ||
    (pro.code === "Directeur-DRH") || (pro.code === "Chef-etablissement")|| (pro.code === "Chef-cfp")) )
        if(prof){
          console.log(prof)
          this.pourTraitement = true
          if(this.profile === 'Chef-division-dgpeec')
            this.isDGPEEC = true
      }
      if(this.profile === 'Professeur' || this.profile === 'Formateurs')
        this.isProfOrFormateur = true
  console.log('isDgpeec +++ ', this.isDGPEEC);
  
  }

  ngOnInit(): void {
    this.initForm();
    this.idPermutation = this.route.snapshot.params["idPermutation"]
    this.getOnePermutation()

  }

  files: File[] = [];
  onSelect(event: { addedFiles: any; }) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event: File) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  getOnePermutation(){
    this.permutationService.getOne(this.idPermutation).subscribe(
      {
        next : (data) => {
          if(data.success){
            console.log(data)
            this.permutation = data.data
          }
        },
        error : (err) => {
          console.log(err)
      }
      }
    )
  }

  initForm(): void {
    this.demandePecForm = this._fb.group({});
    this.motifModifForm = this._fb.group({
      motifModif:['', Validators.required],
    });
    this.motifRejetForm = this._fb.group({
      motifRejet: ['', Validators.required],
    });
    this.aModifierForm = this._fb.group({
      amodifier: ['', Validators.required],
    });
  }

  onSaveDemande() {
    Swal.fire({
      icon: "success",
      html: "La demande de permutation a été enregistrée avec succès.",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
     this.location.back();
    });
  }

  onReset() {
    this.location.back();

   /*  Swal.fire({
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
    }); */
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

  modifier(){
    let id = this.permutation.id
    let action = "SOUMISE"
    let motif = this.aModifierForm.value.amodifier
    this.permutationService.traitement(id, action, motif, this.type).subscribe({
      next : (data)=>{
        if(data.success){
          console.log(data);
          Swal.fire({
            icon: 'success',
            html: `Demande de permutation <b>${id}</b> soumise à nouveau avec succès.`,
            showConfirmButton: false,
            timer: 3000
          }).then(() => {
            this.location.back();
            this.closeModal();
          })
        }
      },
      error : (err)=>{
        console.log(err);
        Swal.fire({
          icon: 'error',
          html: 'Une erreur est survenue lors de la soumission de la demande.Veuillez rééssayer!',
          showConfirmButton: false,
          timer: 3000
        }).then(() => {
          //this.location.back();
          this.closeModal();
        })
      }                           
    })

    }

  onSaveRejet() {
    let id = this.permutation.id
    let motif = this.motifRejetForm.value.motifRejet
    let action = "REJETER"
    this.permutationService.traitement(id, action, motif, this.type).subscribe({
      next : (data)=>{
        if(data.success){
          console.log(data);
          Swal.fire({
            icon: 'success',
            html: `Demande de permutation <b>${id}</b> rejété avec succès.`,
            showConfirmButton: false,
            timer: 3000
          }).then(() => {
            this.location.back();
            this.closeModal();
          })
        }
      },
      error : (err)=>{
        console.log(err);
        Swal.fire({
          icon: 'error',
          html: 'Une erreur est survenue lors du rejet de la demande.Veuillez rééssayer!',
          showConfirmButton: false,
          timer: 3000
        }).then(() => {
          //this.location.back();
          this.closeModal();
        })
      }                           
    })
  }

  onAccept() { 
    Swal.fire({
      title: 'Acceptation',
      text: 'Souhaitez-vous accepter cette demande ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        let id = this.permutation.id
        let action = "ACCEPTER"
        if(this.pourTraitement)
          action = "VALIDER"
        let motif = ""
        this.permutationService.traitement(id, action, motif, this.type).subscribe({
          next : (data)=>{
            if(data.success){
              console.log(data);
              Swal.fire({
                html:`Demande de permutation <b>${id}</b> accepté avec succès`,
                icon: 'success',
                timer: 1500,
                showCancelButton: false,
                showConfirmButton: false
              }).then(() => {
                this.location.back();
              })
            }
          },
          error : (err)=>{
            console.log(err);
            Swal.fire({
              html: "Une erreur est survenue lors de l'acceptation de la demande.Veuillez rééssayer!.",
              icon: 'error',
              timer: 1500,
              showCancelButton: false,
              showConfirmButton: false
            }).then(() => {
              this.location.back();
            })
          }
        })
      }
    });
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
    let id = this.permutation.id
    let motif = this.motifModifForm.value.motifModif
    let action = "AMODIFIER"
    this.permutationService.traitement(id, action, motif, this.type).subscribe({
      next : (data)=>{
        if(data.success){
          console.log(data);
          Swal.fire({
            icon: 'success',
            html: `Demande de permutation <b>${id}</b> modifié avec succès.`,
            showConfirmButton: false,
            timer: 3000
          }).then(() => {
            this.location.back();
            this.closeModal();
          })
        }
      },
      error : (err)=>{
        console.log(err);
        Swal.fire({
          icon: 'error',
          html: 'Une erreur est survenue lors de la modification de la demande.Veuillez rééssayer!',
          showConfirmButton: false,
          timer: 3000
        }).then(() => {
          //this.location.back();
          this.closeModal();
        })
      }                           
    })
  }

  storeFile(id:number, file : File){
    this.fileService.storeSingleBordereauFile(id,file).
    subscribe({
      next : (data : ResponseApi2) => {
        if(data.status?.includes("OK"))
          {
           // console.log({files : data});
          }
      }
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
        let id = this.permutation.id
        let action = "VALIDER"
        let motif = ""
        if(this.profile ==='Chef-division-dgpeec' || this.profile === 'bureau-mo-rec')
          action = "TRAITEE"
          this.permutationService.traitement(id, action, motif, this.type).subscribe({
          next : (data)=>{
            if(data.success){
              console.log("Données traitement permutation === ",data);
              if(!this.isDGPEEC && !this.isProfOrFormateur && this.files)
                this.storeFile(data.data.traitementPermutation.id, this.files[0])
              Swal.fire({
                html: `Demande de permutation <b>${id}</b> validée avec succès.`,
                icon: 'success',
                timer: 1500,
                showCancelButton: false,
                showConfirmButton: false
              }).then(() => {
                this.location.back();
              })
            }
          },
          error : (err)=>{
            console.log(err);
            Swal.fire({
              html: "Une erreur est survenue lors de la validation de la demande. Veuillez rééssayer!.",
              icon: 'error',
              timer: 1500,
              showCancelButton: false,
              showConfirmButton: false
            }).then(() => {
              this.location.back();
            })
          }
        })
      }
    });
  }

  visualiser2(fileName: string): void {
    this.fileService.openPdfInNewTab(fileName)
  };

  Telecharger(filename:string){
    
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

  goBack() {
    this.location.back()
  }
}