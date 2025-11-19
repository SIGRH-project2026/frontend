import {Component, inject,OnInit, TemplateRef} from '@angular/core';
import {Bureau, Diplomes, Division, TypeDiplome} from "../../../../models/utilisateur";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ReferencesService} from "../../../../services/references.service";
import {ParametreService} from "../../services/parametre.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CredentialsService} from "../../../../services/credentials.service";
import Swal from "sweetalert2";
import {ResponseApi} from "../../../../models/response-api";

@Component({
  selector: 'app-diplome',
  templateUrl: './diplome.component.html',
  styleUrls: ['./diplome.component.css']
})
export class DiplomeComponent  implements OnInit {

  headers: string[] = ['Diplome', 'Type diplôme',  'Statut',  'Action'];

  pageSize = 10;
  page = 0;
  totalPages = 0;
  size = 10;

  dataList: Diplomes[] =[];
  collectionSize = this.dataList.length;

  text = '';
  closeResult = '';
  selectedBureau: string = '';
  typeDiplome: TypeDiplome[] =[];
  diplomesForm!: FormGroup;
  modifDiplome: any;
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
    this.listDiplomeAdvanced(0, 10, "", "");
    this.refreshData();
    this.initForm();

  }

  refreshData() {
    this.listDiplomeAdvanced(0, 10, "", "");
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

  openModalAddAgent(content: TemplateRef<any>, diplome: any) {

    this.modifDiplome = diplome;


    this.diplomesForm.patchValue({
      typeDiplome: this.modifDiplome?.typeDiplome?.code,
      code: this.modifDiplome?.code,
      label: this.modifDiplome?.label
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

    this.referenceService.listTypeDiplomes().subscribe(response => {
      if (response.success) {
        this.typeDiplome = response.data;
      }
    });


    this.diplomesForm = this.formBuilder.group({
      typeDiplome: [[], Validators.required],
      code: ['', Validators.required],
      label: ['', Validators.required],


    })
  }
  listDiplomeAdvanced(page: number, size: number, filter: string,statut: string){
    this.parametreService.listDiplomeAdvanced(page,  size,  filter, statut)
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


      this.parametreService.changeStatusDiplome(data?.id).subscribe({
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
  onAddDiplome() {
    this.closeModal();


    let formData = {
      typeDiplome: {code: this.diplomesForm.controls['typeDiplome'].value},
      label: this.diplomesForm.controls['label'].value,
      code:  this.diplomesForm.controls['code'].value
    }



    this.parametreService.addDiplome(formData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          html: `Le <strong>diplôme </strong> a été crée avec succès.`,
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
  onupdateDiplome() {
    this.closeModal();


    let formData = {
      typeDiplome: {code: this.diplomesForm.controls['typeDiplome'].value},
      label: this.diplomesForm.controls['label'].value,
      code:  this.diplomesForm.controls['code'].value
    }



    this.parametreService.updateDiplome(this.modifDiplome?.id, formData).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          html: `Le <strong>Diplome </strong> a été modifié avec succès.`,
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
      this.listDiplomeAdvanced(+event.target['text']-1, this.size!, "", "");
    }

  }
  onStatusChange(event: any) {
    const selectedValue = event.target.value;

    this.listDiplomeAdvanced(0, this.size, '', selectedValue);
  }

}
