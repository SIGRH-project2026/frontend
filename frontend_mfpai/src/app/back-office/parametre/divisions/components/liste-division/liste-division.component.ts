import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {ReferencesService} from "../../../../../services/references.service";
import {ParametreService} from "../../../services/parametre.service";
import {Direction, Division, Region} from "../../../../../models/utilisateur";
import {ResponseApi} from "../../../../../models/response-api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CredentialsService} from "../../../../../services/credentials.service";


@Component({
  selector: 'app-liste-division',
  templateUrl: './liste-division.component.html',
  styleUrls: ['./liste-division.component.css']
})
export class ListeDivisionComponent implements OnInit {


  headers: string[] = ['Direction', 'Division',  'Statut',  'Action'];
  page = 1;
  pageSize = 10;
  statut = '';
  region: Region[]=[];
  divisionList: Division[] =[];

  collectionSize = this.divisionList.length;
  text = '';
  closeResult = '';
  selectedDivision: string = '';
  divisionForm!: FormGroup;
  direction: Direction[] = [];

  modifDivision: any;
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
    this.listDivisionAdvanced(0, 10, "", "");
    this.refreshData();
    this.initForm();
  }


  initForm() {

    this.referenceService.listDirections().subscribe(response => {
      if (response.success) {
        this.direction = response.data;
      }
    });


    this.divisionForm = this.formBuilder.group({
      direction: ['', Validators.required],
      code: ['', Validators.required],
      label: ['', Validators.required],


    })
  }


  refreshData() {
    this.page = 1;
    this.listDivisionAdvanced(this.page - 1, this.pageSize, "", this.statut);
  }

  onCreateDivisionBureaux() {
    this.router.navigate(['add-division-bureaux'], { relativeTo: this.route.parent })
  }

  listDivisionAdvanced(page: number, size: number, filter: string,statut: string){
    this.parametreService.listDivisionAdvanced(page,  size,  filter, statut)
        .subscribe(data => {
          if (data?.status === 'OK') {

            this.divisionList = data?.payload;

            this.collectionSize = data.metadata?.totalElements ?? 0

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
      this.parametreService.changeStatusDivision(data?.id).subscribe({
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
              html: `La direction <b>${data?.label}</b> a été ${this.text.toLowerCase()}.`,
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

  onAddDivision() {
    this.closeModal();


    let formData = {
      direction: {code: this.divisionForm.controls['direction'].value},
      label: this.divisionForm.controls['label'].value,
      code:  this.divisionForm.controls['code'].value
    }



    this.parametreService.addDivision(formData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          html: `La <strong>Division </strong> a été crée avec succès.`,
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.listDivisionAdvanced(0, 10, "", "");
        })

      },
      complete: () => {},
      error: (error) => {

        this.parametreService.showSwal('error', error?.error?.message);
      }
    })

  }

  onUpdateDirecion() {
    this.closeModal();


    let formData = {
      direction: {code: this.divisionForm.controls['direction'].value},
      label: this.divisionForm.controls['label'].value,
      code:  this.divisionForm.controls['code'].value
    }


    this.parametreService.updateDivision(this.modifDivision?.id, formData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          html: `La <strong>Division </strong> a été crée avec succès.`,
          showConfirmButton: false,
          timer: 2000
        }).then(() => {

          this.listDivisionAdvanced(0, 10, "", "");
        })

      },
      complete: () => {},
      error: (error) => {

        console.log(error)

        this.parametreService.showSwal('error', error?.error?.message);
      }
    })

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
      openModalAddAgent(content: TemplateRef<any>, division: any) {

        this.modifDivision = division;

        this.divisionForm.patchValue({
          direction: this.modifDivision?.direction?.code,
          code: this.modifDivision?.code,
          label: this.modifDivision?.label
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

  onPageChange(page: number) {
    this.page = page;
    this.listDivisionAdvanced(page - 1, this.pageSize, "", this.statut);
  }


  onStatusChange(event: any) {
    this.statut = event.target.value;
    this.page = 1;
    this.listDivisionAdvanced(0, this.pageSize, '', this.statut);
  }

}




