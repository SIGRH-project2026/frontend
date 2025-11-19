import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {Discipline, NiveauScolaire} from "../../../../../models/demande-stage.interface";
import {DemandeStageService} from "../../../../../services/demande-stage.service";
import {ReferencesService} from "../../../../../services/references.service";
import {Bureau, Direction, Division, Service} from "../../../../../models/utilisateur";
import {DemandeStageRequest} from "../../../../../models/demande-stage-request.interface";
import {CredentialsService} from "../../../../../services/credentials.service";
import {AlertService} from "../../../../../shared/commons/alert.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-nouvelle-demande',
  templateUrl: './nouvelle-demande.component.html',
  styleUrls: ['./nouvelle-demande.component.css']
})
export class NouvelleDemandeComponent implements OnInit {


  infosBeneficiairesGroup = this._formBuilder.group({});
  infosDemandeursGroup = this._formBuilder.group({});
  discipleStages: Discipline[] = []


  selectedDiscipline: string = '';
  piecesJointesFiles: File[] = [];
  demandeForm!: FormGroup;
  isOk = true;
  initOk = true;
  directions!: Direction[]
  divisions!: Division[]
  bureaux!: Bureau[]
  services!: Service[]
  niveauScolarites!: NiveauScolaire[]
  // demandeStage!: DemandeStageRequest

  constructor(
    private _formBuilder: FormBuilder,
    private location: Location,
    private demandeStageService: DemandeStageService,
    private referenceService: ReferencesService,
    private credential: CredentialsService,
    private spinner: NgxSpinnerService,
    private alert : AlertService,
  ) { }

  ngOnInit(): void {
    this.getAllDisciplineStage();
    this.initForm();
    this.getAllDirection();
    this.getNiveauScolarite()
  }

  getNiveauScolarite(){
    this.demandeStageService.getAllNiveauScolarite().subscribe((res)=>{
      this.niveauScolarites = res.payload
    })
  }

  initForm(){
    this.demandeForm = this._formBuilder.group({
      prenomDemandeur: ['', Validators.required],
      nomDemandeur: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      lieuDeNaissance: ['', Validators.required],
      mail: [''],
      tel: ['', Validators.required],
      adresse: [''],
      objet: ['', Validators.required],
      codeNiveauScolaire: ['', Validators.required],
      disciplineStage: [''],
      autreDiscipline: [''],
      directionCode: ['',],
      divisionCode: [''],
      bureauCode: [''],
      serviceCode: [''],
      dateDebut: [''],
      dateFin: [''],
      justificatifs: [''],
      commentaire: ['']
    });
  }



  onSelectedDirection(){
    if (this.demandeForm.value["directionCode"] === ''){
      this.initOk = true
    }else{

      this.getDivisionByDirectionCode(this.demandeForm.value["directionCode"])
      this.demandeForm.value["directionCode"] === "DRH" ? this.isOk = false : this.isOk = true;

      this.getServiceByBureauCode()
      this.initOk = false;
    }

  }

  onSelectedDivision(){
    this.getBureauByDivisionCode()

  }



  getServiceByBureauCode(){
    if (this.demandeForm.value["directionCode"] === ''){
      this.initOk = true

    }else{
      this.referenceService.listServiceByDirectionCode(this.demandeForm.value["directionCode"]).subscribe((res)=>{
        this.services = res.data
      })
    }

  }

  getDivisionByDirectionCode(code: string){
    this.spinner.show();
    this.referenceService.listDivisionByDirectionCode(code).subscribe((res)=>{
      this.divisions = res.data
      this.spinner.hide();
    })
  }

  getBureauByDivisionCode(){
    this.spinner.show();
    this.referenceService.listBureauByCode(this.demandeForm.value["divisionCode"]).subscribe((res)=>{
      this.bureaux = res.data
      this.spinner.hide();
    })
  }
  getAllDirection(){
    this.referenceService.listDirections().subscribe((res)=>{
      this.directions = res.data

    })
  }

  demandeStage = {
  prenomDemandeur: '',
  nomDemandeur: '',
  dateNaissance: '',
  lieuDeNaissance: '',
  mail: '',
  tel: '',
  adresse: '',
  objet: '',
  codeNiveauScolaire: '',
  disciplineStage: '',
  directionCode: '',
  divisionCode: '',
  serviceCode: '',
  bureauCode: '',
  dateDebut: '',
  dateFin: '',
  commentaire: ''
};
  setDemandeStageValue(): void {
    if (this.piecesJointesFiles.length === 0){
      this.spinner.hide();
      this.alert.showAlert({status: "EXCEPTION", message: "Veuillez choisir piéces joints svp", titre: "Enregistrement Demande Stage"});
    }
    // Set the values of other fields in demandeStage from demandeForm

    this.demandeStage.prenomDemandeur = this.demandeForm.value.prenomDemandeur;
    this.demandeStage.nomDemandeur = this.demandeForm.value.nomDemandeur;
    this.demandeStage.dateNaissance = this.demandeForm.value.dateNaissance;
    this.demandeStage.lieuDeNaissance = this.demandeForm.value.lieuDeNaissance;
    this.demandeStage.mail = this.demandeForm.value.mail;
    this.demandeStage.tel = this.demandeForm.value.tel;
    this.demandeStage.adresse = this.demandeForm.value.adresse;
    this.demandeStage.objet = this.demandeForm.value.objet;
    this.demandeStage.codeNiveauScolaire = this.demandeForm.value.codeNiveauScolaire;
    this.selectedDiscipline === "AUTRES" ?
        this.demandeStage.disciplineStage = this.demandeForm.value.autreDiscipline :
        this.demandeStage.disciplineStage = this.demandeForm.value.disciplineStage;
    this.demandeStage.directionCode = this.demandeForm.value.directionCode;
    this.demandeStage.divisionCode = this.demandeForm.value.divisionCode;
    this.demandeStage.serviceCode = this.demandeForm.value.serviceCode;
    this.demandeStage.bureauCode = this.demandeForm.value.bureauCode;
    this.demandeStage.dateFin = this.demandeForm.value.dateFin;
    this.demandeStage.dateDebut = this.demandeForm.value.dateDebut;
    this.demandeStage.commentaire = this.demandeForm.value.commentaire;

  }
  onSaveDemande() {
    this.spinner.show();
    if (this.demandeForm.valid){
      this.setDemandeStageValue()
      const formData = new FormData();
      this.piecesJointesFiles.forEach(file => {
        formData.append('files', file);
      });
      this.demandeStageService.saveDemandeStage(this.demandeStage).subscribe((res)=>{
        if (res.status === 'OK'){
          this.demandeStageService.uploadFile(res.payload.id,formData).subscribe((result)=>{
            if (res.status === 'OK'){
              this.spinner.hide();
              Swal.fire({
                icon: 'success',
                html: 'Demande de stages a été enregistrée avec succès.',
                showConfirmButton: false,
                timer: 3000
              }).then(() => {
                this.location.back();
              })
            }else{
              this.spinner.hide();
              this.alert.showAlert({status: res.status, message: res.message, titre: "Enregistrement Demande Stage"});
            }
          })
        }else{
          this.spinner.hide();
          this.alert.showAlert({status:res.status, message: res.message, titre: "Enregistrement Demande Stage"});

        }

      })
    }else{
      this.spinner.hide();

      this.alert.showAlert({status: "EXCEPTION", message: "Veuillez renseigner tous les champs svp", titre: "Enregistrement Demande Stage"});
    }



  }

  getAllDisciplineStage(){
    this.spinner.show();
    this.demandeStageService.getAllDisciplineStage().subscribe((res)=>{
      this.discipleStages = res.payload
      this.spinner.hide();
    })
  }

  onDisciplineChange(value: string) {
    this.selectedDiscipline = value;
  }

   onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
    filesArray.push(...event.addedFiles);
  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
  }

  onReset() {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous annuler l\'enregistrement ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          html: 'L’enregistrement  a été annulé avec succès.',
          icon: 'success',
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false
        }).then(() => {
          this.location.back();
        })
      }
    });
  }
}

