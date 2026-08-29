import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {ReferencesService} from "../../../../../services/references.service";
import {ParametreService} from "../../../services/parametre.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Ia, Ief, Region} from "../../../../../models/utilisateur";
import {NgxSpinnerService} from "ngx-spinner";
import {ResponseApi} from "../../../../../models/response-api";
import {CredentialsService} from "../../../../../services/credentials.service";

@Component({
  selector: 'app-liste-ief',
  templateUrl: './liste-ief.component.html',
  styleUrls: ['./liste-ief.component.css']
})
export class ListeIefComponent  implements OnInit {


  headers: string[] = ['Région', 'IA',  'IEF','Statut',  'Action'];
  page = 1;
  pageSize = 10;
  statut = '';

  region: Region[]=[];
  ia: Ia[]=[];

  iEFliteList: Ief[] = [];

  collectionSize = this.iEFliteList.length;
  text = '';
  closeResult = '';
  iEFForm!: FormGroup;
  modifIEF: any;
   userInfos: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private referenceService: ReferencesService,
    private parametreService: ParametreService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public modalService: NgbModal = inject(NgbModal),

    private credentialsService: CredentialsService,

  ) {
    this.userInfos = this.credentialsService.getUserInfos();
  }

  ngOnInit(): void {
    this.listIEFdvanced(0, 10, "", "");
    this.refreshData();

    this.initForm();
  }

  refreshData() {
    this.page = 1;
    this.listIEFdvanced(this.page - 1, this.pageSize, "", this.statut);
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
      openModalAddAgent(content: TemplateRef<any>, ief: any) {

        this.modifIEF = ief;

        this.iEFForm.patchValue({
          region: this.modifIEF?.ia?.region?.code,
          ia: this.modifIEF?.ia?.code,
          code: this.modifIEF?.code,
          label: this.modifIEF?.label
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

    this.referenceService.listRegion().subscribe(response => {
      if (response.success) {
        this.region = response.data;
      }
    });


    this.referenceService.listIA().subscribe(response => {
      if (response.success) {
        this.ia = response.data;
      }
    });


    this.iEFForm = this.formBuilder.group({
      region: [[], Validators.required],
      ia: [[], Validators.required],
      code: ['', Validators.required],
      label: ['', Validators.required],


    })
  }

  listIEFdvanced(page: number, size: number, filter: string,statut: string){
    this.parametreService.listIEFAdvanced(page,  size,  filter, statut)
        .subscribe(data => {
          if (data?.status === 'OK') {

            this.iEFliteList = data?.payload;

            this.collectionSize = data.metadata?.totalElements ?? 0

          }
        });

  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onUpdateIEF() {
    this.closeModal();


    let formData = {
      region: {code: this.iEFForm.controls['region'].value},
      ia: {code: this.iEFForm.controls['ia'].value},
      label: this.iEFForm.controls['label'].value,
      code:  this.iEFForm.controls['code'].value
    }


    this.parametreService.updateIEF(this.modifIEF?.id, formData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          html: `L' <strong>IA </strong> a été crée avec succès.`,
          showConfirmButton: false,
          timer: 2000
        }).then(() => {

          this.refreshData();

        })

      },
      complete: () => {},
      error: (error) => {

        console.log(error)

        this.parametreService.showSwal('error', error?.error?.message);
      }
    })



  }

  onPageChange(page: number) {
    this.page = page;
    this.listIEFdvanced(page - 1, this.pageSize, "", this.statut);
  }

  onAddIEF() {
    this.closeModal();


    let formData = {
      region: {code: this.iEFForm.controls['region'].value},
      ia: {code: this.iEFForm.controls['ia'].value},
      label: this.iEFForm.controls['label'].value,
      code:  this.iEFForm.controls['code'].value
    }



    this.parametreService.addIEF(formData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          html: `L' <strong>IEF </strong> a été crée avec succès.`,
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
      this.parametreService.changeStatusIEF(data?.id).subscribe({
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
              html: `L'ief <b>${data?.label}</b> a été ${this.text.toLowerCase()}.`,
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

  onViewImage(imageUrl: string, title: string) {
    Swal.fire({
      imageUrl: imageUrl,
      imageWidth: 720,
      imageAlt: title
    });
  }

  getListIA(code: any): void {

    if(code) {
      this.spinner.show()
      this.referenceService.listIAByCode(code)
          .subscribe(response => {

            if (response.success) {
              this.ia = response.data;
              this.spinner.hide()
            }
          });
      this.spinner.hide()
    }
  }

  onStatusChange(event: any) {
    this.statut = event.target.value;
    this.page = 1;
    this.listIEFdvanced(0, this.pageSize, '', this.statut);
  }

}

const DATA: any[] = [
  {
    id: 1,
    ref: '23032',
    Region: "Dakar",
    ia: 'Formation',
    ief: 'Formation',
    status: true,

  },
  {
    id: 2,
    ref: '23032',
    Region: 'Thies',
    ia: 'Formation',
   ief: 'Formation',
    status: false,
  },
  {
    id: 3,
    ref: '23032',
    Region: "Tamba",
    ia: '23032',
    ief : 'qce',
    status: true,
  }
];
