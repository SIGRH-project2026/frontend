import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {Bureau, Direction, Division} from "../../../../../models/utilisateur";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ResponseApi} from "../../../../../models/response-api";
import {ReferencesService} from "../../../../../services/references.service";
import {ParametreService} from "../../../services/parametre.service";
import {CredentialsService} from "../../../../../services/credentials.service";

@Component({
  selector: 'app-list-bureaux',
  templateUrl: './list-bureaux.component.html',
  styleUrls: ['./list-bureaux.component.css']
})
export class ListBureauxComponent  implements OnInit {


  headers: string[] = ['Division', 'Bureaux',  'Statut',  'Action'];

  pageSize = 10;
  page = 0;
  totalPages = 0;
  size = 10;

  dataList: Bureau[] =[];
  collectionSize = this.dataList.length;

  text = '';
  closeResult = '';
  selectedBureau: string = '';
  division: Division[] =[];
  bureauForm!: FormGroup;
   modifBureau: any;
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
    this.listBureauAdvanced(0, 10, "", "");
    this.refreshData();
    this.initForm();

  }

  refreshData() {
    this.listBureauAdvanced(0, 10, "", "");
  }

  onCreateDivisionBureaux() {
    this.router.navigate(['add-division-bureaux'], { relativeTo: this.route.parent })
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

  openModalAddAgent(content: TemplateRef<any>, bureau: any) {

    this.modifBureau = bureau;


    this.bureauForm.patchValue({
      division: this.modifBureau?.division?.code,
      code: this.modifBureau?.code,
      label: this.modifBureau?.label
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

    this.referenceService.listDivisions().subscribe(response => {
      if (response.success) {
        this.division = response.data;
      }
    });


    this.bureauForm = this.formBuilder.group({
      division: [[], Validators.required],
      code: ['', Validators.required],
      label: ['', Validators.required],


    })
  }
  listBureauAdvanced(page: number, size: number, filter: string,statut: string){
    this.parametreService.listBureauAdvanced(page,  size,  filter, statut)
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


      this.parametreService.changeStatusBureau(data?.id).subscribe({
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
  onAddBureau() {
    this.closeModal();


    let formData = {
      division: {code: this.bureauForm.controls['division'].value},
      label: this.bureauForm.controls['label'].value,
      code:  this.bureauForm.controls['code'].value
    }



    this.parametreService.addBureau(formData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          html: `La <strong>Bureau </strong> a été crée avec succès.`,
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
  onupdateBureau() {
    this.closeModal();


    let formData = {
      division: {code: this.bureauForm.controls['division'].value},
      label: this.bureauForm.controls['label'].value,
      code:  this.bureauForm.controls['code'].value
    }



    this.parametreService.updateBureau(this.modifBureau?.id, formData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          html: `La <strong>Direction </strong> a été crée avec succès.`,
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
      this.listBureauAdvanced(+event.target['text']-1, this.size!, "", "");
    }

  }
  onStatusChange(event: any) {
    const selectedValue = event.target.value;

    this.listBureauAdvanced(0, this.size, '', selectedValue);
  }


}






