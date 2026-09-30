import { Location } from "@angular/common";
import { Component, OnInit, TemplateRef, ViewChild, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { PermutationDTO } from "../../../mes-demandes-mutation-permutation/model/Permutation";
import { PermutationService } from "../../../mes-demandes-mutation-permutation/service/permutation.service";
import { CredentialsService } from "src/app/services/credentials.service";

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

  motifRejetForm !: FormGroup

  type : string =  "reçue"
  userInfos : any
  profilConnecte : any
  pourTraitement = false;
    
  closeResult = '';
  profile : any
  isProfOrFormateur: boolean =false;
  isDGPEEC : boolean= false

  @ViewChild('rejetModal') rejetModal!: TemplateRef<any>;
  @ViewChild('amodifierModal') amodifierModal!: TemplateRef<any>;

  constructor(
    private _formBuilder: FormBuilder,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private readonly _fb: FormBuilder,
    public modalService: NgbModal = inject(NgbModal),
    private readonly permutationService: PermutationService,
    private readonly _credentialService: CredentialsService,

  ) {
    this.userInfos = this._credentialService.getUserInfos();
    this.profilConnecte = this.userInfos.profil
    this.profile = this.profilConnecte[0].code
    let prof = this.profilConnecte.find((pro : any) =>( (pro.code === "bureau-mo-rec") || (pro.code === "Chef-division-dgpeec") || (pro.code === "Representant-IA") || (pro.code === "Représentant-IEF") || (pro.code === "Chef-etablissement")) )
    if(prof){
        console.log(prof)
        this.pourTraitement = true
        if(this.profile === 'Chef-division-dgpeec')
          this.isDGPEEC = true
      }
      if(this.profile === 'Professeur' || this.profile === 'Formateurs')
        this.isProfOrFormateur = true
  }

  ngOnInit(): void {
    this.idPermutation = this.route.snapshot.params["dataId"]
    this.initForm();
    console.log(this.idPermutation);
    this.getOnePermutation()
    
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
    this.motifRejetForm = this._fb.group({
      motifRejet: ['', Validators.required],
    });
  }

  champObligatoire(valeur:string){
    const champ = this.motifRejetForm.controls[valeur]

    return champ.touched && champ.hasError('required');
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
    /* Swal.fire({
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
      text: 'Souhaitez-vous refuser cette demande ?',
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
    let id = this.permutation.id
    let motif = this.motifRejetForm.value.motifRejet
    let action = "REJETER"
    this.permutationService.traitement(id, action, motif, this.type).subscribe({
      next : (data)=>{
        if(data.success){
          console.log(data);
          Swal.fire({
            icon: 'success',
            html: `Demande de permutation <b>${id}</b> rejetée.`,
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

  goBack() {
    this.location.back()
  }
}





