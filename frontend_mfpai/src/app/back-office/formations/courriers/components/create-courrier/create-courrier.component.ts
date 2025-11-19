import { Location } from '@angular/common';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Bureau, Direction, Division, Service} from "../../../../../models/utilisateur";
import {ReferencesService} from "../../../../../services/references.service";
import {CourrierService} from "../../../../../services/courrier.service";
import {AlertService} from "../../../../../shared/commons/alert.service";
import {Demande} from "../../../../../models/demande.interface";
import {NgxSpinnerService} from "ngx-spinner";
import {Console} from "console";


@Component({
  selector: 'app-create-courrier',
  templateUrl: './create-courrier.component.html',
  styleUrls: ['./create-courrier.component.css']
})
export class CreateCourrierComponent {
    courrierForm!: FormGroup;
    directions!: Direction[]
    divisions!: Division[]
    bureaux!: Bureau[]
    services!: Service[]
    isOk = true;
    initOk = true;
    listTypeDemande!: Demande []

 constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private referenceService: ReferencesService,
    private courrierService: CourrierService,
    private alert : AlertService,
    private spinner: NgxSpinnerService
  ){}

    ngOnInit(): void {
     // this.listTypeDemandeCourrierByDivisionAndNomTypeCourrier("DFC","ENTRANT")
        this.initForm()
        this.getAllDirection()

    }


    shoOtherOption = false;
    onSelectedDirection(){
     if (this.courrierForm.value["directionCode"] === ''){
         this.initOk = true
     }else{
         this.getDivisionByDirectionCode(this.courrierForm.value["directionCode"])

         this.courrierForm.value["directionCode"] === "AUD" ? this.isOk = true : this.isOk = false;
         // this.getServiceByBureauCode()
         this.initOk = false;
     }

    }

    listTypeDemandeCourrierByDivisionAndNomTypeCourrier(divisionCode:string, nomTypeCourrier:string){
        this.spinner.show();
     this.courrierService.listTypeDemandeCourrierByDivisionAndNomTypeCourrier(divisionCode,nomTypeCourrier)
         .subscribe((res)=>{
             this.listTypeDemande = res.payload
             console.log(this.listTypeDemande)
             this.spinner.hide()
         })
    }

    division = ''
    onSelectedDivision(){
        this.division = this.courrierForm.value['divisionCode']
        console.log(this.courrierForm.value['divisionCode'])
        if (this.courrierForm.value["divisionCode"] === 'Courrier_DRH'){
            this.shoOtherOption = true;
        }
        if (this.courrierForm.value['divisionCode'] != '' && this.courrierForm.value['typeCourrier'] != ''){
            console.log("ddddddddddd-----ddddddddd")

            this.listTypeDemandeCourrierByDivisionAndNomTypeCourrier(this.courrierForm.value['divisionCode'],this.courrierForm.value['typeCourrier'])
            this.getBureauByDivisionCode()
        }


    }



    // getServiceByBureauCode(){
    //     if (this.courrierForm.value["directionCode"] === ''){
    //         this.initOk = true
    //     }else{
    //         this.referenceService.listServiceByDirectionCode(this.courrierForm.value["directionCode"]).subscribe((res)=>{
    //             this.services = res.data
    //         })
    //     }
    //
    // }

    getDivisionByDirectionCode(code: string){
        this.spinner.show();
        this.referenceService.listDivisionByDirectionCode(code).subscribe((res)=>{
            this.divisions = res.data
            this.spinner.hide();

        })
    }

    getBureauByDivisionCode(){
        this.spinner.show();
        this.referenceService.listBureauByCode(this.courrierForm.value["divisionCode"]).subscribe((res)=>{
            this.bureaux = res.data
            this.spinner.hide();
        })
    }
    getAllDirection(){
        this.spinner.show()
        this.referenceService.listDirections().subscribe((res)=>{

            if (res.status === 'OK'){
                this.directions = res.data
                this.spinner.hide()
            }else{
                this.spinner.hide()
            }

        })
    }

  onSaveCourrier(){
      if (this.showOtherField && this.courrierForm.value['otherField'] == '' ){
          this.alert.showAlert({status: "EXCEPTION", message: "Veuillez renseigner les champs requisffff.", titre: "Enregistrement Courrier."});
      }else{
          if (this.courrierForm.valid) {
              this.saveCourrier(this.courrierForm.value)
              // Implement your form submission logic here
          }else{
              this.alert.showAlert({status: "EXCEPTION", message: "Veuillez renseigner les champs requis.", titre: "Enregistrement Courrier."});
          }
      }

  }



  saveCourrier(data: any){

        this.spinner.show()
      this.courrierService.saveCourrier(data).subscribe((res)=>{

         if(res.status === 'OK'){
             this.spinner.hide()
             Swal.fire({
                 icon: 'success',
                 html: 'Le courrier a été enregistré avec succès.',
                 showConfirmButton: false,
                 timer: 2000
             }).then(() => {
                 this.location.back();
             })
         }else{
             this.spinner.hide()
             this.alert.showAlert({status: res.status, message: res.message, titre: "Enregistrement Courrier."});

         }
     })
  }



  initForm(){
      this.courrierForm = this.formBuilder.group({
          reference: ['', Validators.required],
          codeDemandeCourrier: ['', Validators.required],
          directionCode: ['', Validators.required],
          typeCourrier: ['', Validators.required],
          divisionCode: [''],
          otherField: [''],
          // bureauCode: [''],
          // serviceCode: ['']
      });
  }

  onReset() {
    this.location.back();
  }

    onSelectedTypeCourrier() {

        if (this.courrierForm.value['divisionCode'] != '' && this.courrierForm.value['typeCourrier'] != ''){
            this.listTypeDemandeCourrierByDivisionAndNomTypeCourrier(this.courrierForm.value['divisionCode'],this.courrierForm.value['typeCourrier'])
        }
    }



    showOtherField = false;
    onSelectedTypeDemande() {
        this.courrierForm.value['codeDemandeCourrier'] == 'other' ? this.showOtherField = true : this.showOtherField = false;
    }
}
