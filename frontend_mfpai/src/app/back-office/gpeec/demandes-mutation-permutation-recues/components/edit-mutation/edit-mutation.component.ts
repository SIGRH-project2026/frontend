import { Location } from "@angular/common";
import { Component, OnInit, TemplateRef, ViewChild, inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { MutationService } from "../../services/mutation.service";
import { ResponseApi2 } from "src/app/shared/models/ResponseApi";
import { MutationDTO } from "../../models/mutationDTO";

@Component({
  selector: 'app-edit-mutation',
  templateUrl: './edit-mutation.component.html',
  styleUrls: ['./edit-mutation.component.css']
})
export class EditMutationComponent implements OnInit {
  
  infosBeneficiairesGroup = this._formBuilder.group({});
  infosDemandeursGroup = this._formBuilder.group({});

  demandePecForm!: FormGroup;

    
  closeResult = '';
  idMutation : any
  mutation: MutationDTO = new MutationDTO;
  @ViewChild('rejetModal') rejetModal!: TemplateRef<any>;
  @ViewChild('amodifierModal') amodifierModal!: TemplateRef<any>;


  constructor(
    private _formBuilder: FormBuilder,
    private location: Location,
    private router: Router,
    private readonly _fb: FormBuilder,
    public modalService: NgbModal = inject(NgbModal),
    private readonly mutationService : MutationService,
    private readonly _activatedRoute : ActivatedRoute
  ) {
    this._activatedRoute.snapshot.paramMap.get('dataId')
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.demandePecForm = this._fb.group({});
  }

  getOneMutation(){
    this.mutationService.get(this.idMutation)
        .subscribe({
          next : (data : ResponseApi2) =>{
            if(data.status?.includes("OK"))
            this.mutation = data.payload
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
    Swal.fire({
      icon: 'success',
      html: 'Demande de mutation <b>(N° RÉFÉRENCE)</b> rejetée.',
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
    Swal.fire({
      icon: 'success',
      html: 'Demande de mutation <b>(N° RÉFÉRENCE)</b> modifiée avec succès.',
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
          html: 'Demande de mutation <b>(N° RÉFÉRENCE)</b> validée avec succès.',
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




