import { Location } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {Bureau, Direction, Division, Service} from "../../../../../models/utilisateur";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReferencesService} from "../../../../../services/references.service";
import {ActivatedRoute} from "@angular/router";
import {DemandeStageService} from "../../../../../services/demande-stage.service";
import {DemandeStage} from "../../../../../models/demande-stage.interface";
import {AlertService} from "../../../../../shared/commons/alert.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-imputer-demande',
  templateUrl: './imputer-demande.component.html',
  styleUrls: ['./imputer-demande.component.css']
})
export class ImputerDemandeComponent  implements OnInit{
  directions!: Direction[]
  divisions!: Division[]
  bureaux!: Bureau[]
  demandeForm!: FormGroup;
  services!: Service[]
  isOk = true;
  initOk = true;
  idDemandeStage: string | null = ""
  demandeStage!: DemandeStage
  constructor(
    private location: Location,
    private referenceService: ReferencesService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private demandeStageService: DemandeStageService,
    private alert : AlertService,
    private spinner: NgxSpinnerService

  ){}

  ngOnInit(): void {
    this.idDemandeStage = this.route.snapshot.paramMap.get('dataId')

    this.initForm()
    this.getDemande()
    }

  getDemande(){
      this.spinner.show()
    this.demandeStageService.getDemande(this.idDemandeStage).subscribe((res)=>{
      if (res.status === 'OK'){
        this.demandeStage = res.payload
        if (this.demandeStage.direction.code === "DRH"){
          this.isOk = false
          this.initOk = false;
          this.getDivisionByDirectionCode("DRH")
        }
        this.getAllDirection()
        this.spinner.hide()
      }else{
        this.spinner.hide()
        this.alert.showAlert({status: "EXCEPTION", message: "Une erreur s'est produite lors du chargement des donnees.", titre: "Imputation Demande Stage"});
      }

    })
  }





  onSelectedDirection(){
    this.getDivisionByDirectionCode(this.demandeForm.value["directionCode"])
    this.demandeForm.value["directionCode"] === "AUD" ? this.isOk = true : this.isOk = false;
    this.getServiceByBureauCode()
    this.initOk = false;
  }

  initForm(){
    this.demandeForm = this._formBuilder.group({
      directionCode: ['', Validators.required],
      divisionCode: ['',Validators.required],
      bureauCode: ['',Validators.required],
      serviceCode: ['',Validators.required]
    });
  }

  onSelectedDivision(){
    this.getBureauByDivisionCode()

  }



  getServiceByBureauCode(){

    this.referenceService.listServiceByDirectionCode(this.demandeForm.value["directionCode"]).subscribe((res)=>{
      if (res.status === 'OK'){
        this.services = res.data
        this.spinner.hide()
      }
    })
  }

  getDivisionByDirectionCode(code: string){

    this.referenceService.listDivisionByDirectionCode(code).subscribe((res)=>{
      this.divisions = res.data
    })
  }

  getBureauByDivisionCode(){
    console.log(this.demandeForm.value["divisionCode"]);
    this.referenceService.listBureauByCode(this.demandeForm.value["divisionCode"]).subscribe((res)=>{
      this.bureaux = res.data
    })
  }
  getAllDirection(){
    this.referenceService.listDirections().subscribe((res)=>{
      this.directions = res.data

    })
  }

  onSaveDemande(){
    this.demandeStageService.imputationDemandeStage(this.idDemandeStage!, this.demandeForm.value).subscribe((res)=>{
      if (res.status === 'OK'){
        Swal.fire({
          icon: 'success',
          html: 'Demande de stages a été envoyée avec succès.',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.location.back();
        })
      }else{
        this.alert.showAlert({status: "EXCEPTION", message: "Veuillez renseigner tous les champs svp", titre: "Imputation Demande Stage"});
      }
    })

  }

  onReset() {
    this.location.back();
  }
}
