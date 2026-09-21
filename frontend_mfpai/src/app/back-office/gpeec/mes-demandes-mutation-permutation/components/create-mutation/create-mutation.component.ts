
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserDTOs } from "src/app/models/UserDTOs";
import { CredentialsService } from "src/app/services/credentials.service";
import { ReferencesService } from "src/app/services/references.service";
import { UtilisateurService } from "src/app/services/utilisateur.service";
import Swal from "sweetalert2";
import { MutationDTO } from "../../../demandes-mutation-permutation-recues/models/mutationDTO";
import { MutationService } from "../../../demandes-mutation-permutation-recues/services/mutation.service";
import { ResponseApi2 } from "src/app/shared/models/ResponseApi";
import { Bureau, Direction, Division, Service } from "src/app/models/utilisateur";
import {NgxSpinnerService} from "ngx-spinner";
import { FileService } from "src/app/shared/services/files/file.service";

@Component({
    selector: "app-create-mutation",
    templateUrl: "./create-mutation.component.html",
    styleUrls: ["./create-mutation.component.css"],
})
export class CreateMutationComponent implements OnInit {

    infosBeneficiairesGroup = this._formBuilder.group({});
    infosDemandeursGroup = this._formBuilder.group({});


    demandePecForm!: FormGroup;
    centralRegionForm!: FormGroup;
    userInfos : any
    user : UserDTOs  = new UserDTOs()
    region: any;
    ia: any;
    codeIA: any;
    ief: any;
    etablissement: any;
    typeDestinationSouhaitee = "SEL";
    direction: Direction [] = [];
    service: Service[] = [];
    division: Division[] = [];

    bureau: Bureau[] = [];
    CheckDivision: any;
    piecesJointesFiles: File[] = [];
    constructor(
        private _formBuilder: FormBuilder,
        private location: Location,
        private router: Router,
        private readonly _fb: FormBuilder,
        private readonly _credentialService: CredentialsService,
        private readonly _userService: UtilisateurService,
        private readonly referenceService: ReferencesService,
        private readonly mutationService : MutationService,
        private readonly fileService: FileService,
        private spinner: NgxSpinnerService,
    ) {

      this.userInfos = this._credentialService.getUserInfos();
      this.typeDestinationSouhaitee = this.userInfos.profil[0].typeProfile

    }

    ngOnInit(): void {
        this.initForm();
        this.getUserDetail()
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

    get f1(): { [p: string]: AbstractControl } {
        return this.demandePecForm!.controls;
    }
    directionSelected(event : any){
        this.CheckDivision = event
        console.log({checkDiv : this.CheckDivision});

    }
    onSaveDemande() {
        const activeForm = this.typeDestinationSouhaitee === 'DEC' ? this.demandePecForm : this.centralRegionForm;
        if (activeForm.invalid) {
            activeForm.markAllAsTouched();
            Swal.fire({ icon: 'warning', text: 'Veuillez renseigner tous les champs obligatoires.' });
            return;
        }
        this.spinner.show();
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
        mutation.idUserdemandeur = this.userInfos.id
        mutation.destinataireType = this.typeDestinationSouhaitee



        {
           // console.log("demandePecForm ", this.centralRegionForm)
            this.mutationService.post(mutation)
                .subscribe({
                        next : (data : ResponseApi2) =>{
                          //  console.log({ddd : data});

                            if(data.status?.includes('OK')){
                                this.uploadPiecesJointes(data.payload?.id);
                            }
                        },
                        error: () => {
                            this.spinner.hide();
                            Swal.fire({
                                icon: 'error',
                                text: 'La demande de mutation n’a pas pu être soumise. Veuillez réessayer.'
                            });
                        }
                    }

                )}


    }

    uploadPiecesJointes(idMutation: number | undefined) {
        if (!idMutation || this.piecesJointesFiles.length === 0) {
            this.spinner.hide();
            Swal.fire({
                icon: "success",
                html: "La demande de mutation a été soumise avec succès.",
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                this.location.back();
            });
            return;
        }
        this.fileService.storeMultipleFiles(idMutation, 'mutationDemande', this.piecesJointesFiles)
            .subscribe({
                next: () => {
                    this.spinner.hide();
                    Swal.fire({
                        icon: "success",
                        html: "La demande de mutation a été soumise avec succès.",
                        showConfirmButton: false,
                        timer: 2000,
                    }).then(() => {
                        this.location.back();
                    });
                },
                error: () => {
                    this.spinner.hide();
                    Swal.fire({
                        icon: 'warning',
                        text: 'La demande de mutation a été soumise mais l’envoi du document a échoué. Veuillez le joindre ultérieurement.'
                    });
                }
            });
    }

    onSelectFiles(event: { addedFiles: any }, filesArray: File[]) {
        filesArray.push(...event.addedFiles);
    }

    onRemoveFile(event: File, filesArray: File[]) {
        filesArray.splice(filesArray.indexOf(event), 1);
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
                    html: "L’enregistrement  a été annulé avec succès.",
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
    getUserDetail(){
        this.spinner.show();
        this._userService.getOneUser(this.userInfos.id)
            .subscribe({
                next : (data : any) =>{
                    this.user = data.data
                    this.typeDestinationSouhaitee = this.user.typeUser
                    this.spinner.hide();
                }
            })
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
}
