import { Component, inject, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {Speciality} from "../../../../../models/utilisateur";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReferencesService} from "../../../../../services/references.service";
import {ParametreService} from "../../../services/parametre.service";
import {ResponseApi} from "../../../../../models/response-api";
import {CredentialsService} from "../../../../../services/credentials.service";

@Component({
  selector: 'app-liste-specialite',
  templateUrl: './liste-specialite.component.html',
  styleUrls: ['./liste-specialite.component.css']
})
export class ListeSpecialiteComponent {

  headers: string[] = [ 'Spécialité',  'Statut',  'Action'];
  pageSize = 10;
  page = 0;
  totalPages = 0;
  size = 10;

  dataList: Speciality[] =[];
  collectionSize = this.dataList.length;

  text = '';
  closeResult = '';
   modifSpecialite: any;
   specialtyForm!: FormGroup;
   userInfos: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private referenceService: ReferencesService,
    private parametreService: ParametreService,
    public modalService: NgbModal = inject(NgbModal),

    private credentialsService: CredentialsService,

  ) {
    this.userInfos = this.credentialsService.getUserInfos();
  }

  ngOnInit(): void {
    this.listSpecialityAdvanced(0, 10, "", "");
    this.refreshData();
    this.initForm();
  }

  refreshData() {
    this.listSpecialityAdvanced(0, 10, "", "");
  }

  onCreateRecrutement() {
    this.router.navigate(['add-recrutement'], { relativeTo: this.route.parent })
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
  openModalAddAgent(content: TemplateRef<any>, specialuty: any) {

    this.modifSpecialite = specialuty;


    this.specialtyForm.patchValue({
      code: this.modifSpecialite?.code,
      label: this.modifSpecialite?.label
    })

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size:'l', centered: true }).result.then(
			(result) => {
        this.closeResult = `Closed with: ${result}`;
       
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  initForm() {


    this.specialtyForm = this.formBuilder.group({
      code: ['', Validators.required],
      label: ['', Validators.required],


    })
  }
  listSpecialityAdvanced(page: number, size: number, filter: string,statut: string){
    this.parametreService.listSpecialityAdvanced(page,  size,  filter, statut)
        .subscribe(data => {
          if (data?.status === 'OK') {

            this.dataList = data?.payload;

            this.collectionSize = data.metadata?.totalElements ?? 0
            this.size = data.metadata?.size ?? 0


          }
        });

  }
  changeStatus(data: any): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgba(29, 74, 123, 1)',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {


      this.parametreService.changeStatusSpeciality(data?.id).subscribe({
        next: (response: ResponseApi) => {

          if (result.isConfirmed) {
            if (!data.statut) {
              this.text = "Activé";
              data.statut = true
            } else {
              this.text = "Désactivé";
              data.statut = false
            }

            Swal.fire({
              title: this.text,
              html: `Le Spécialité <b>${data?.label}</b> a été ${this.text.toLowerCase()}.`,
              icon: 'success',
              timer: 1500,
              showCancelButton: false,
              showConfirmButton: false
            })
          }
        }
      });

    })
  }
  closeModal() {
    this.modalService.dismissAll();
  }
  onAddSpeciality() {
    this.closeModal();


    let formData = {
      label: this.specialtyForm.controls['label'].value,
      code:  this.specialtyForm.controls['code'].value
    }




    this.parametreService.addSpeciality(formData).subscribe({
      next: response => {

        Swal.fire({
          icon: 'success',
          html: `La <strong>Spécialité </strong> a été crée avec succès.`,
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.refreshData();
        })

      },
      complete: () => {},
      error: (error) => {

        this.parametreService.showSwal('error', error?.error?.message);
      }
    })

  }
  onUpdateSpeciality() {
    this.closeModal();


    let formData = {
      label: this.specialtyForm.controls['label'].value,
      code:  this.specialtyForm.controls['code'].value
    }



    this.parametreService.updateSpeciality(this.modifSpecialite?.id, formData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          html: `La <strong>Spécialité </strong> a été crée avec succès.`,
          showConfirmButton: false,
          timer: 2000
        }).then(() => {

          this.refreshData();
          // this.router.navigate(['/parametrage/directions']);
        })

      },
      complete: () => {},
      error: (error) => {

        console.log(error)

        this.parametreService.showSwal('error', error?.error?.message);
      }
    })

  }
  refreshData1(event: any) {
    this.totalPages = +event.target['text'] - 1;
    // if (event.target['text'] != undefined && event.target['text'] != "« «" && event.target['text'] != "«" && event.target['text'] != "»" && event.target['text'] != "» »") {
    if (event.target['text'] != undefined ) {
      this.listSpecialityAdvanced(+event.target['text']-1, this.size!, "", "");
    }

  }
  onStatusChange(event: any) {
    const selectedValue = event.target.value;

    this.listSpecialityAdvanced(0, this.size, '', selectedValue);
  }


}

