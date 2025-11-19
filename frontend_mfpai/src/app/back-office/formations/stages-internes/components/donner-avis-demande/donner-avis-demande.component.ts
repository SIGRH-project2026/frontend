import { Location } from '@angular/common';
import { Component, TemplateRef, inject } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router} from "@angular/router";
import {DemandeStageService} from "../../../../../services/demande-stage.service";
import {DemandeStage} from "../../../../../models/demande-stage.interface";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-donner-avis-demande',
  templateUrl: './donner-avis-demande.component.html',
  styleUrls: ['./donner-avis-demande.component.css']
})
export class DonnerAvisDemandeComponent {
  idDemandeStage: string | null = ""
  demandeStage!: DemandeStage;
  closeResult = '';
   constructor(
       private location: Location,
       private route: ActivatedRoute,
    private demandeService: DemandeStageService,
    public modalService: NgbModal = inject(NgbModal),
       private router: Router,
       private form: FormBuilder
   ) { }

  ngOnInit(){
    this.idDemandeStage = this.route.snapshot.paramMap.get('dataId')
    this.verifyIfConnectedUserCannCreateDemandeStage()
    this.getDemande()
      this.initForm()
  }

  downloadFile(fileName: string){
    this.demandeService.downloadFile(fileName)
  }

  autoriserDemandeStage = false;
  verifyIfConnectedUserCannCreateDemandeStage(){
    this.demandeService.isCurrentUserInDFCBureau().subscribe((res)=>{
      this.autoriserDemandeStage = res.payload
    })
  }


  getDemande(){
    this.demandeService.getDemande(this.idDemandeStage).subscribe((res)=>{
      this.demandeStage = res.payload
    })
  }
  autoriserDemander(){
     this.demandeService.autoriserDemande(this.idDemandeStage!)
         .subscribe((res)=>{

           if (res.status === 'OK'){
             Swal.fire({
               html: 'Demande autorisée avec succès.',
               icon: 'success',
               timer: 1500,
               showCancelButton: false,
               showConfirmButton: false
             }).then(() => {
               this.location.back();
             })
           }else{

           }
         })
  }



  formGiveAdvide!: FormGroup;
    initForm(){
      this.formGiveAdvide = this.form.group({
          motif: new FormControl('', [Validators.required])
      })
    }

  onNonAutoriser(content: TemplateRef<any>) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: '520px', centered: true }).result.then(
          (result) => {

              this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
              if (this.formGiveAdvide.valid){
                  this.demandeService.nonautoriserDemande(this.idDemandeStage, this.formGiveAdvide.value['motif'])
                      .subscribe((res)=>{

                          if (res.status === 'OK'){

                          }else{

                          }
                      })
                  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
              }

          },
      );


  }

  private getDismissReason(reason: any): any {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
                this.location.back();
		}

  }
  
  onReset() {
    this.location.back()
  }

  onAutoriser() {

    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous autoriser cette demande ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {

      if (result.isConfirmed) {
        this.autoriserDemander()
      }
    });
  }


  closeModal() {
    this.modalService.dismissAll();
  }
  
   onSaveDemande(){
    Swal.fire({
      icon: 'success',
      html: 'Demande non autorisée avec succès.',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      this.location.back();
      this.closeModal();
    })
  }

}
