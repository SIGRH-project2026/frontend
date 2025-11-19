import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ResponseApi2 } from "src/app/shared/models/ResponseApi";
import Swal from "sweetalert2";
import { MutationService } from "../../../demandes-mutation-permutation-recues/services/mutation.service";
import { MutationDTO } from "../../../demandes-mutation-permutation-recues/models/mutationDTO";
import { ReferencesService } from "src/app/services/references.service";

import { Service, Division, Bureau, Direction } from "src/app/models/utilisateur";

@Component({
  selector: 'app-edit-mutation',
  templateUrl: './edit-mutation.component.html',
  styleUrls: ['./edit-mutation.component.css']
})
export class EditMutationComponent implements OnInit {

  infosBeneficiairesGroup = this._formBuilder.group({});
  infosDemandeursGroup = this._formBuilder.group({});

  demandePecForm!: FormGroup;
  centralRegionForm!: FormGroup;
  idMutation: any;
  mutation: MutationDTO = new MutationDTO();
  region: any;
  ia: any;
  codeIA: any;
  ief: any;
  etablissement: any;
  direction: Direction [] = [];
  service: Service[] = [];
  division: Division[] = [];

  bureau: Bureau[] = [];
  CheckDivision: any;
  typeDestinationSouhaitee = "SEL";
  constructor(
      private _formBuilder: FormBuilder,
      private location: Location,
      private router: Router,
      private readonly _fb: FormBuilder,
      private readonly mutationService : MutationService,
      private readonly _activatedRoute : ActivatedRoute,
      private readonly referenceService: ReferencesService,
  ) {
    this.idMutation = this._activatedRoute.snapshot.paramMap.get('dataId')


  }
  ngOnInit(): void {
    this.initForm();
    this.getOneMutation()
  }
  get f1(): { [p: string]: AbstractControl } {
    return this.demandePecForm!.controls;
  }
  onLevelSelected(event : any){
    this.typeDestinationSouhaitee = this.demandePecForm.value.typeDestinationSouhaitee

  }
  initForm(): void {
    this.demandePecForm = this._fb.group({
      typeDestinationSouhaitee : ['SEL'],
      region:  ['', Validators.required],
      etablissement:  ['',  Validators.required],
      ia:  ['', Validators.required],
      ief:  [''],
      commentaire : ['', Validators.required]
    });
    this.centralRegionForm = this._fb.group({
      region:  ['', Validators.required],
      division:  [''],
      bureau:  [''],
      direction:  ['', Validators.required],
      services : [''],
      commentaire : ['', Validators.required]
    });

    this.referenceService.listRegion().subscribe(response => {
      if(response.success)
        this.region = response.data;
    });
    this.referenceService.listDirections().subscribe(response => {
      if(response.success)
        this.direction = response.data;
    });
    this.referenceService.listService().subscribe(response => {
      if(response.success)
        this.service = response.data;

    });

    this.referenceService.listDivisions().subscribe(response => {
      if(response.success)
      {this.division = response.data;
      }

    });

  }
  getOneMutation(){
    this.mutationService.get(this.idMutation)
        .subscribe({
          next : (data : ResponseApi2) =>{
            if(data.status?.includes("OK"))
            {
              this.mutation = data.payload
              this.typeDestinationSouhaitee = this.mutation.destinataireType
              this.typeDestinationSouhaitee = this.mutation.demandeur.typeUser
            }

          }
        })
  }
  onSaveDemande() {
    let mutation : MutationDTO = new MutationDTO()
    if(this.typeDestinationSouhaitee === 'DEC')
    {
      let reg = this.region.find(( rg : any) => rg.code == this.demandePecForm.value.region)
      if(reg)
        mutation.regionSouhaitee = reg
      let _ia = this.ia.find((ia : any) => ia.code == this.demandePecForm.value.ia)
      if(_ia)
        mutation.iaSouhaitee = _ia
      let _ief = this.ief.find(( ief : any) => ief.code == this.demandePecForm.value.ief)
      if(_ief)
        mutation.iefSouhaitee = _ief

      let _etab = this.etablissement.find(( etb : any) => etb.code == this.demandePecForm.value.etablissement)
      if(_etab)
        mutation.etablissementSouhaitee = _etab
      mutation.commentaire  = this.demandePecForm.value.commentaire

    }else{
      let reg = this.region.find(( rg : any) => rg.code == this.centralRegionForm.value.region)
      if(reg)
        mutation.regionSouhaitee = reg

      let dir = this.direction.find((dir : any) => dir.code == this.centralRegionForm.value.direction)
      if(dir)
        mutation.directionSouhaitee = dir


      let serv = this.service.find(( ser : any) => ser.code == this.centralRegionForm.value.services)
      if(serv)
        mutation.serviceSouhaite = serv

      let bur = this.bureau.find(( bur : any) => bur.code == this.centralRegionForm.value.bureau)
      if(bur)
        mutation.bureauSouhaite = bur


      let div = this.division.find(( div : any) => div.code == this.centralRegionForm.value.division)
      if(div)
        mutation.divisionSouhaitee = div

      mutation.commentaire  = this.centralRegionForm.value.commentaire
    }

    mutation.destinataireType = this.typeDestinationSouhaitee



    if(this.demandePecForm.valid || this.centralRegionForm.valid)
      this.mutationService.patch(this.idMutation, mutation)
          .subscribe({
            next : (data : ResponseApi2) =>{
              if(data.status?.includes('OK'))
                Swal.fire({
                  icon: "success",
                  html: "La demande de mutation a été enregistrée avec succès.",
                  showConfirmButton: false,
                  timer: 2000,
                }).then(() => {
                  this.router.navigate(["gpeec/mes-demandes-mutation-permutation"]);
                });
            }
          })

  }

  onReset() {
    Swal.fire({
      title: "Confirmation",
      text: "Voulez-vous annuler l'enregistrement ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1D4A7B",
      cancelButtonColor: "#FF4D4F",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          html: "L’enregistrement a été annulé avec succès.",
          icon: "success",
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        }).then(() => {
          this.location.back();
        });
      }
    });
  }

  getListIA(code: any): void {

    this.referenceService.listIAByCode(code)
        .subscribe(response => {

          if (response.success) {
            this.ia = response.data;
          }
        });
  }
  getListEF(code: any): void {

    this.codeIA = code;
    this.referenceService.listIEFByCode(code)
        .subscribe(response => {

          if (response.success) {

            this.ief = response.data;
          }
        });
  }
  getListEtabByIA(code: any): void {

    this.referenceService.listEtablissementByIACode(code)
        .subscribe(response => {

          if (response.success) {

            this.etablissement = response.data;
          }
        });
  }

  getListEtablissement(code: any): void {

    if(code) {
      this.referenceService.listEtablissementByCode(code)
          .subscribe(response => {

            if (response.success) {
              this.etablissement = response.data;
            }
          });
    }else {

      this.referenceService.listEtablissementByIACode( this.codeIA )
          .subscribe(response => {

            if (response.success) {

              this.etablissement = response.data;
            }
          });
    }


  }

  getListBureau(code: any): void {
    if(code){
      this.referenceService.listBureauByCode(code)
          .subscribe(response => {
            if (response.success) {
              this.bureau = response.data;

            }
          });
    }
  }
  directionSelected(event : any){
    this.CheckDivision = event
    console.log({checkDiv : this.CheckDivision});

  }
}