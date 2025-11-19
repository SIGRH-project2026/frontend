import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {DemandeStage, Discipline, NiveauScolaire} from "../../../../../models/demande-stage.interface";
import {Bureau, Direction, Division, Service} from "../../../../../models/utilisateur";
import {DemandeStageService} from "../../../../../services/demande-stage.service";
import {ReferencesService} from "../../../../../services/references.service";
import {CredentialsService} from "../../../../../services/credentials.service";
import {AlertService} from "../../../../../shared/commons/alert.service";
import {ActivatedRoute} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-edit-demande',
  templateUrl: './edit-demande.component.html',
  styleUrls: ['./edit-demande.component.css']
})
export class EditDemandeComponent {

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
  idDemandeStage: string | null = ""
  demandeStage_!: DemandeStage
  // demandeStage!: DemandeStageRequest

  constructor(
      private _formBuilder: FormBuilder,
      private location: Location,
      private demandeStageService: DemandeStageService,
      private referenceService: ReferencesService,
      private credential: CredentialsService,
      private spinner: NgxSpinnerService,
      private alert : AlertService,
      private route: ActivatedRoute,
  ) { }

  /**
   * methode d'initialisation
   */
  ngOnInit(): void {

    this.idDemandeStage = this.route.snapshot.paramMap.get('dataId')
    this.getDemande()

    this.getAllDisciplineStage();
    this.getAllDirection();
    this.getNiveauScolarite()


  }


  /**
   * Recuperation demande de stage
   */
  getDemande(){
    this.spinner.show();
    console.log("=======================")
    this.demandeStageService.getDemande(this.idDemandeStage).subscribe((res)=>{
      if (res.status === 'OK'){
        this.demandeStage_ = res.payload
        console.log("=====================")
        console.log(this.demandeStage_)
        if (this.demandeStage_.direction){
          if (this.demandeStage_.direction.code === "DRH"){
            this.isOk = false
            this.initOk = false;
            this.getDivisionByDirectionCode("DRH")

            if (this.demandeStage_.division){
              this.referenceService.listBureauByCode(this.demandeStage_.division.code).subscribe((res)=>{
                this.bureaux = res.data
              })
              // this.referenceService.listBureauByCode(this.demandeStage_.division.code).subscribe((res)=>{
              //   this.bureaux = res.data
              // })
            }
          }
        }



        this.spinner.hide();
        this.initForm();

      }else{
        this.spinner.hide();
      }


    })
  }

  /**
   * recuperation niveau scolarite
   */
  getNiveauScolarite(){
    this.demandeStageService.getAllNiveauScolarite().subscribe((res)=>{
      this.niveauScolarites = res.payload
    })
  }

  /**
   * initiation formulaire
   */
  initForm(){
    this.demandeForm = this._formBuilder.group({
      prenomDemandeur: [this.demandeStage_.prenomDemandeur, Validators.required],
      nomDemandeur: [this.demandeStage_.nomDemandeur, Validators.required],
      dateNaissance: [this.demandeStage_.dateNaissance, Validators.required],
      lieuDeNaissance: [this.demandeStage_.lieuDeNaissance, Validators.required],
      mail: [this.demandeStage_.mail, ],
      tel: [this.demandeStage_.tel, Validators.required],
      adresse: [this.demandeStage_.adresse, ],
      objet: [this.demandeStage_.objet, Validators.required],
      codeNiveauScolaire: ["", Validators.required],
      disciplineStage: [this.demandeStage_.disciplineStage],
      autreDiscipline: [''],
      directionCode: [''],
      divisionCode: [""],
      bureauCode: [''],
      serviceCode: [''],
      dateDebut: [this.demandeStage_.dateDebut, ],
      dateFin: [this.demandeStage_.dateDebut, ],
      justificatifs: [this.demandeStage_.justificatfs],
      commentaire: [this.demandeStage_.commentaire]
    });
  }


  /**
   * recuperation de la direction
   */

  onSelectedDirection(){
    this.getDivisionByDirectionCode(this.demandeForm.value["directionCode"])
    this.demandeForm.value["directionCode"] === "DRH" ? this.isOk = false : this.isOk = true;
    this.getServiceByDirectionCode()
    this.initOk = false;
  }

  /**
   *
   */
  onSelectedDivision(){
    this.getBureauByDivisionCode()

  }


  /**
   * rcuperation service via la direction
   */
  getServiceByDirectionCode(){
    this.referenceService.listServiceByDirectionCode(this.demandeForm.value["directionCode"]).subscribe((res)=>{
      this.services = res.data
    })
  }

  /**
   * recuperation division via code direction
   * @param code
   */
  getDivisionByDirectionCode(code: string){
    this.referenceService.listDivisionByDirectionCode(code).subscribe((res)=>{
      this.divisions = res.data
    })
  }

  /**
   * recuperation des bureau via la division
   */
  getBureauByDivisionCode(){
    this.referenceService.listBureauByCode(this.demandeForm.value["divisionCode"]).subscribe((res)=>{
      this.bureaux = res.data
    })
  }

  /**
   * recupèration des direction
   */
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

  /**
   * enregistrement demande
   */
  setDemandeStageValue(): void {

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
    this.demandeStage.dateDebut = this.demandeForm.value.dateDebut;
    this.demandeStage.dateFin = this.demandeForm.value.dateFin;
    this.demandeStage.commentaire = this.demandeForm.value.commentaire;

  }

  /**
   * enregistrement demande de stage
   */
  onSaveDemande() {
    this.spinner.show()
    if (this.demandeForm.valid){
      this.setDemandeStageValue()
      const formData = new FormData();
      this.piecesJointesFiles.forEach(file => {
        formData.append('files', file);
      });
      this.demandeStageService.editDemandeStage(this.demandeStage, this.idDemandeStage!).subscribe((res)=>{
        if (res.status === 'OK'){
          // on verifie s'il y a des pieces jointes
          if (this.piecesJointesFiles.length != 0){
            this.demandeStageService.uploadFile(this.idDemandeStage!,formData).subscribe((result)=>{
              if (res.status === 'OK'){
                this.spinner.hide()
                Swal.fire({
                  icon: 'success',
                  html: 'Les modifications ont été enregistrées avec succès.',
                  showConfirmButton: false,
                  timer: 3000
                }).then(() => {
                  this.location.back();
                })
              }else{
                this.spinner.hide()
                this.alert.showAlert({status: res.status, message: res.message, titre: "Modification Demande Stage"});
              }
            })
          }else{
            this.spinner.hide()
            Swal.fire({
              icon: 'success',
              html: 'Les modifications ont été enregistrées avec succès.',
              showConfirmButton: false,
              timer: 3000
            }).then(() => {
              this.location.back();
            })
          }


        }else{
          this.spinner.hide()
          this.alert.showAlert({status: res.status, message: res.message, titre: "Enregistrement Demande Stage"});
        }

      })


    }else{
      this.alert.showAlert({status: "EXCEPTION", message: "Veuillez renseigner tous les champs svp", titre: "Modification Demande Stage"});
    }




  }

  /**
   * recuperation de laliste des discipline de stage
   */
  getAllDisciplineStage(){
    this.demandeStageService.getAllDisciplineStage().subscribe((res)=>{
      this.discipleStages = res.payload
    })
  }

  /**
   * recuperation code discipline
   * @param value
   */
  onDisciplineChange(value: string) {
    this.selectedDiscipline = value;
  }

  /**
   * recuperation fichiers
   * @param event
   * @param filesArray
   */
  onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
    filesArray.push(...event.addedFiles);
  }

  /**
   * suppression fichier
   * @param event
   * @param filesArray
   */
  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
  }


  /**
   * vider champs formulaire modification demande de stage
   */
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