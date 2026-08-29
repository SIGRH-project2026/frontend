import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Ia, Region} from "../../../../../models/utilisateur";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReferencesService} from "../../../../../services/references.service";
import {ParametreService} from "../../../services/parametre.service";
import {ResponseApi} from "../../../../../models/response-api";
import {CredentialsService} from "../../../../../services/credentials.service";

@Component({
  selector: 'app-list-ia',
  templateUrl: './list-ia.component.html',
  styleUrls: ['./list-ia.component.css']
})
export class ListIaComponent  implements OnInit {

  headers: string[] = ['Région', 'IA',  'Statut',  'Action'];
  page = 1;
  pageSize = 10;
  statut = '';

  region: Region[]=[];

  ialiteList: Ia[] = [];

  collectionSize = this.ialiteList.length;
  text = '';
  closeResult = '';

  iaForm!: FormGroup;
  modifIA!: Ia;
   userInfos: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private referenceService: ReferencesService,
    private parametreService: ParametreService,
    private formBuilder: FormBuilder,
    public modalService: NgbModal = inject(NgbModal),

    private credentialsService: CredentialsService,

  ) {
    this.userInfos = this.credentialsService.getUserInfos();
  }

  ngOnInit(): void {
    this.listIAAdvanced(0, 10, "", "");
    this.refreshData();

    this.initForm();
  }

  refreshData() {
    this.page = 1;
    this.listIAAdvanced(this.page - 1, this.pageSize, "", this.statut);
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




  openModal(content: TemplateRef<any>, ia: any) {
    this.modifIA = ia;

    this.iaForm.patchValue({
      region: this.modifIA?.region?.code,
      code: this.modifIA?.code,
      label: this.modifIA?.label
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


    this.iaForm = this.formBuilder.group({
      region: [[], Validators.required],
      code: ['', Validators.required],
      label: ['', Validators.required],


    })
  }

  listIAAdvanced(page: number, size: number, filter: string,statut: string){
    this.parametreService.listIAAdvanced(page,  size,  filter, statut)
        .subscribe(data => {
          if (data?.status === 'OK') {

            this.ialiteList = data?.payload;

            this.collectionSize = data.metadata?.totalElements ?? 0

          }
        });

  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onUpdateIA() {
    this.closeModal();


    let formData = {
      region: {code: this.iaForm.controls['region'].value},
      label: this.iaForm.controls['label'].value,
      code:  this.iaForm.controls['code'].value
    }



    this.parametreService.updateIA(this.modifIA?.id, formData).subscribe({
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
    this.listIAAdvanced(page - 1, this.pageSize, "", this.statut);
  }

  onAddIA() {
    this.closeModal();


    let formData = {
      region: {code: this.iaForm.controls['region'].value},
      label: this.iaForm.controls['label'].value,
      code:  this.iaForm.controls['code'].value
    }



    this.parametreService.addIA(formData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          html: `La <strong>IA </strong> a été crée avec succès.`,
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
      this.parametreService.changeStatusIA(data?.id).subscribe({
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
              html: `L'ia <b>${data?.label}</b> a été ${this.text.toLowerCase()}.`,
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


  onStatusChange(event: any) {
    this.statut = event.target.value;
    this.page = 1;
    this.listIAAdvanced(0, this.pageSize, '', this.statut);
  }

  onViewImage(imageUrl: string, title: string) {
    Swal.fire({
      imageUrl: imageUrl,
      imageWidth: 720,
      imageAlt: title
    });
  }



}

const DATA: any[] = [
  {
    id: 1,
    ref: '23032',
    Region: "Dakar",
    ia: 'Formation',
    status: true,

  },
  {
    id: 2,
    ref: '23032',
    Region: 'Thies',
    ia: 'Formation',
    status: false,
  },
  {
    id: 3,
    ref: '23032',
    Region: "Tamba",
    ia: '23032',
    status: true,
  }
];
