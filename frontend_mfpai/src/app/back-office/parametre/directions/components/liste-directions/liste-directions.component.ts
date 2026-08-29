import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReferencesService} from "../../../../../services/references.service";
import {Direction, Region} from "../../../../../models/utilisateur";
import {ParametreService} from "../../../services/parametre.service";
import {ResponseApi} from "../../../../../models/response-api";
import {CredentialsService} from "../../../../../services/credentials.service";

@Component({
  selector: 'app-liste-directions',
  templateUrl: './liste-directions.component.html',
  styleUrls: ['./liste-directions.component.css']
})
export class ListeDirectionsComponent implements OnInit {

  headers: string[] = [ 'Service',  'Statut',  'Action'];
  page = 1;
  pageSize = 10;
  statut = '';
  region: Region[]=[];
  dataList: Direction[] =[];


  //directionaliteList: any;
  collectionSize = 0;
  text = '';
  closeResult = '';
  directionForm!: FormGroup;
  modifDirection!: Direction;
   userInfos: any ;


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
    this.refreshData();

    this.initForm();
  }

  refreshData() {
    this.page = 1;
    this.listDirectionAdvanced(this.page - 1, this.pageSize, "", this.statut);
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

  openModalAddAgent(content: TemplateRef<any>, direction: any) {
       this.modifDirection = direction;

       this.directionForm.patchValue({
         region: this.modifDirection?.region?.code,
         code: this.modifDirection?.code,
         label: this.modifDirection?.label
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

  onViewImage(imageUrl: string, title: string) {
    Swal.fire({
      imageUrl: imageUrl,
      imageWidth: 720,
      imageAlt: title
    });
  }


  initForm() {

      this.referenceService.listRegion().subscribe(response => {
        if (response.success) {
          this.region = response.data;
        }
      });


       this.directionForm = this.formBuilder.group({
        region: [[], Validators.required],
         code: ['', Validators.required],
         label: ['', Validators.required],


      })
    }
  listDirectionAdvanced(page: number, size: number, filter: string,statut: string){
    this.parametreService.listDirectionAdvanced(page,  size,  filter, statut)
        .subscribe(data => {
          if (data?.status === 'OK') {

            this.dataList = data?.payload;

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


      this.parametreService.changeStatusDirection(data?.id).subscribe({
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
  onAddDirecion() {
    this.closeModal();


    let formData = {
      region: {code: this.directionForm.controls['region'].value},
      label: this.directionForm.controls['label'].value,
      code:  this.directionForm.controls['code'].value
    }



      this.parametreService.addDirection(formData).subscribe({
        next: response => {
          Swal.fire({
            icon: 'success',
            html: `La <strong>Direction </strong> a été crée avec succès.`,
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            this.listDirectionAdvanced(0, 10, "", "");
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
      region: {code: this.directionForm.controls['region'].value},
      label: this.directionForm.controls['label'].value,
      code:  this.directionForm.controls['code'].value
    }



    this.parametreService.updateDirection(this.modifDirection?.id, formData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          html: `La <strong>Direction </strong> a été crée avec succès.`,
          showConfirmButton: false,
          timer: 2000
        }).then(() => {

          this.listDirectionAdvanced(0, 10, "", "");
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
  onPageChange(page: number) {
    this.page = page;
    this.listDirectionAdvanced(page - 1, this.pageSize, "", this.statut);
  }

  onStatusChange(event: any) {
    this.statut = event.target.value;
    this.page = 1;
    this.listDirectionAdvanced(0, this.pageSize, '', this.statut);
  }

}

