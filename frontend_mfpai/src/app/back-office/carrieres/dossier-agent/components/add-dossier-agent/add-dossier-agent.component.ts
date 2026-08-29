import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ListDossierAgentComponent } from '../list-dossier-agent/list-dossier-agent.component';
import { CarriereService } from 'src/app/services/carriere.service';
import { DossierAgentService } from '../../../services/dossier-agent/dossier-agent.service';
import { DossierAgent, DossierAgentDto } from '../../../models/dossier-agent/dossier-agent';
import { Diplome } from '../../../models/dossier-agent/diplome';
import { Avancement } from '../../../models/dossier-agent/avancement';
import { SituationAdministrative } from '../../../models/dossier-agent/situationAdministrative';
import { FileService } from 'src/app/shared/services/files/file.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PieceJointes } from '../../../models/dossier-agent/pieceJointes';
import { EtatCivil } from '../../../models/dossier-agent/etatCivil';
import { ReferencesService } from 'src/app/services/references.service';
import { ActeService } from 'src/app/services/acteService.service';
import { log } from 'console';


@Component({
    selector: 'app-add-dossier-agent',
    templateUrl: './add-dossier-agent.component.html',
    styleUrls: ['./add-dossier-agent.component.css']
})
export class AddDossierAgentComponent  implements OnInit{

    //var Filiere
    headers4!: string[];
    userList!: any[];
    //var dossier
    headers!: string[];
    page = 1;
    newDossier: DossierAgent[] = [];
    listDossier!: DossierAgent[];
    dossierForm!: FormGroup;
    firstStepForm!: FormGroup;
    //var diplome
    headers2!: string[];
    newDiplome: Diplome[] = [];
    listDiplome: Diplome[] = [];
    listDiplomes2 : Diplome[] = []
    diplomForm!: FormGroup;
    //var avancement
    headers3!: string[];

    matricule: any;
    donnee: any;
    dipList!:any[];
    corpsGradeList!:any[];

    alldata:any;

    listEtatCivil : EtatCivil[] = []
    listEtatCivil2 : EtatCivil[] = []
    newEtatCivil : EtatCivil[] = [];

    listSituationAdministrative: SituationAdministrative[]=[];
    listSituationAdministrative2: SituationAdministrative[]=[];
    newSituationAdministrative: SituationAdministrative[] = [];

    file!: File[];

    corps !:any[]
    grade!:any[]

    actes !: any[]
    typeActe !: any[]
    acteIsNull: boolean = false;
    diplomeIsNull: boolean = false;



    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private _formBuilder: FormBuilder,
        private dossierDossierAgentService: DossierAgentService,
        private fileService : FileService,
        private _httpClient: HttpClient,
        private referenceService : ReferencesService,
        private acteService : ActeService

        //private dossierS : ListDossierAgentComponent,
    ) { }


    getActeFromTypeActe(code: any) {
        console.log("get acte by type acte ",code);

        if(code =="aa"){
            this.acteService.listAA().subscribe(
                data => {
                    if(data.status ==="OK")
                    {
                        this.actes = data.payload;
                        console.log(data)
                    }
                })
        }else{
            this.acteService.listAG().subscribe(
                data =>{
                    if(data.status ==="OK")
                    {
                        this.actes = data.payload;
                        console.log(data)
                    }
                }
            )
        }



    }
    get f(): { [p: string]: AbstractControl } {
        return this.dossierForm!.controls;
    }
    ngOnInit(): void {
        // Initialize data and headers
        this.headers = ['Numero acte','Date acte', 'Type acte ', 'Acte', 'Pièce jointe', 'Actions'];
        this.headers2 = ["Date d'obtention", 'Nom diplôme ', 'Pièce jointes', 'Actions'];
        this.headers3 = ["Date de prise de service ", 'Poste occupé', 'Pièce jointes', 'Actions'];
        this.headers4 = ["Nom fichier", 'Taille', 'Fichier', 'Actions'];
        this.initForm();


        this.getTypeActes()

        this.matricule = this.route.snapshot.params['matricule'];
        console.log("params #### ",this.matricule);
        this.dossierDossierAgentService.recherche(this.matricule)
            .subscribe({
                next :(data : any) =>{
                    if(data.success){
                        this.alldata=data.data;
                        this.donnee = data.data;

                        console.log("data", data)
                        this.newDiplome = data.data.diplomes;
                        this.listDiplome = data.data.diplomes;
                        this.listEtatCivil = data.data.etatCivil;
                        this.newEtatCivil = data.data.etatCivil;
                        this.listSituationAdministrative = data.data.situationAdministrative;
                        this.newSituationAdministrative = data.data.situationAdministrative;
                    }
                }
            })

        this.dossierDossierAgentService.getAllDipList()
            .subscribe({
                next:(data:any)=>{
                    if(data){
                        console.log(data.data);
                        this.dipList = data.data;
                    }
                }
            })

        this.dossierDossierAgentService.getAllCorpsGradeList()
            .subscribe({
                next:(data:any)=>{
                    if(data.success){
                        this.corpsGradeList = data.data;
                    }
                }
            })
    }

    getTypeActes(){
        this.acteService.listTypeActe().subscribe(
            data =>{
                if(data.status == "OK"){
                    console.log(data);
                    this.typeActe = data.payload
                }
            }
        )
    }

    /* gestion fichier */

    storeFileDiplome(id:number, file:File[]){
        console.log("file store diplome");

        this.fileService.storeSingleDiplomeFile(id, file).subscribe({
            next:(data:any)=>{
                if(data.success){
                    console.log(this.file);

                }
            }
        })
    }

    storeFileAvancement(id:number, file:File[]){
        this.fileService.storeSingleAvancementFile(id, file).subscribe({
            next:(data:any)=>{
                if(data.success){
                    console.log(this.file);

                }
            }
        })
    }

    storeFileEtatCivil(id:number, file:File[]){
        this.fileService.storeSingleEtatcivilFile(id, file).subscribe({
            next:(data:any)=>{
                if(data.success){
                    console.log(this.file);

                }
            }
        })
    }

    storeFileActe(id:number, file:File[]){
        this.fileService.storeSingleActeFile(id, file).subscribe({
            next:(data:any)=>{
                if(data.success){
                    console.log(this.file);
                }
            }
        })
    }

    handleFileInput(event: any): void {
        this.etatcivilFiles.push(event.target.files[0]);
        console.log('Nom du fichier:', this.etatcivilFiles[0].name);
        console.log('Type du fichier:', this.etatcivilFiles[0].type);
        console.log('Taille du fichier:', this.etatcivilFiles[0].size, 'octets');
        // Vous pouvez également accéder à d'autres propriétés du fichier selon vos besoins
    }


    Telecharger(filename : PieceJointes){
        //window.open(item);
        this._httpClient.get(`http://localhost:9080/api/v1/mfpai/file/download/${filename}`, {
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${localStorage.getItem("Token")}`
            },
            responseType: 'blob' // traiter la réponse comme un blob
        }).subscribe(
            (response: Blob) => {
                // Créer une URL pour le contenu blob afin de pouvoir l'ouvrir dans une nouvelle fenêtre ou le télécharger
                const blobUrl = URL.createObjectURL(response);

                // Créer un élément d'ancrage invisible dans le document
                const anchor = document.createElement('a');
                anchor.style.display = 'none';
                document.body.appendChild(anchor);

                // Définir l'URL de l'ancrage sur l'URL blob et déclencher un clic
                anchor.href = blobUrl;
                anchor.download = filename.downloadUrl; // Nom de fichier par défaut lors du téléchargement
                anchor.click();

                // Supprimer l'ancrage du document
                document.body.removeChild(anchor);

                // Libérer l'URL blob pour libérer la mémoire
                URL.revokeObjectURL(blobUrl);
            },
            (error) => console.log(error)
        );
    }
    /* fin */


    onCreateDossierAgent() {
        let dossierAgent : DossierAgentDto = new DossierAgentDto();
        dossierAgent.diplomes = this.listDiplome;
        dossierAgent.etatCivil = this.listEtatCivil;
        dossierAgent.situationAdministrative = this.listSituationAdministrative;
        console.log("donnees etats ==== ",this.newEtatCivil);

        dossierAgent.situationAdministrative = this.listSituationAdministrative;
        dossierAgent.utilisateurId = this.alldata.utilisateur.id;
        dossierAgent.id = this.alldata.id;
        this.dossierDossierAgentService.post(dossierAgent)
            .subscribe({
                next:(data:any)=>{
                    console.log(data);
                    this.listDiplomes2 = data.data.diplomesNoPiecejointes;
                    this.listEtatCivil2 = data.data.etatCivilsNoPiecesjointes;
                    this.listSituationAdministrative2 = data.data.situationAdministrativeNoPiecesjointes;
                    console.log("situation admin ::: ",data.data.situationAdministrativeNoPiecesjointes);

                    if(this.listDiplomes2.length>0){
                        for (let i=0; i<this.listDiplomes2.length; i++){
                            this.storeFileDiplome(this.listDiplomes2[i].id,[this.diplomesFilesFinal[i]])
                        }
                    }
                    console.log("list etat no fichier == ",this.listEtatCivil2);

                    if(this.listEtatCivil2.length>0){
                        console.log("debut add etat civil");

                        for (let k=0; k<this.listEtatCivil2.length; k++){

                            this.storeFileEtatCivil(this.listEtatCivil2[k].id, [this.etatcivilFiles[k]])
                        }
                    }
                    console.log("list situation admin no fichier == ",this.listSituationAdministrative2);


                    if(this.listSituationAdministrative2.length>0){
                        console.log("debut add acte");

                        for (let p=0; p<this.listSituationAdministrative2.length; p++){

                            this.storeFileActe(this.listSituationAdministrative2[p].id, [this.acteFilesFinal[p]])
                        }

                    }

                    if(this.alldata.id==0){
                        Swal.fire({
                            icon: 'success',
                            title: 'Création dossier',
                            html: 'Le dossier a été ajouté avec succès.',
                            showConfirmButton: false,
                            timer: 2000
                        }).then(() => {
                            this.router.navigate(['carrieres/dossier-agents']);
                        })
                    }else{
                        Swal.fire({
                            icon: 'success',
                            title: 'Modification dossier',
                            html: 'Le dossier a été modifié avec succès.',
                            showConfirmButton: false,
                            timer: 2000
                        }).then(() => {
                            this.router.navigate(['carrieres/dossier-agents']);
                        })
                    }

                },
                error: (error: HttpErrorResponse) => {
                    const message = error.error?.message
                        ?? 'Une erreur est survenue. Vérifiez vos informations.';
                    this.dossierDossierAgentService.showSwal('error', message);
                }
            })
    }
    // Initialize formulaire
    initForm() {
        this.dossierForm = this._formBuilder.group({
            dateActe : ['',Validators.required],
            typeActe: ['',Validators.required],
            acte: ['',Validators.required],
            numeroActe: ['',Validators.required],
            status: true // Actif default value
        });
        this.diplomForm = this._formBuilder.group(
            {
                //  id: [0],
                dipDateObtention: ['', Validators.required],
                dipNom: ['',Validators.required],
                filename: [''],
            }
        );
        this.firstStepForm = this._formBuilder.group({
            //situationMatrimoniale:[this.donnee?.situationMatrimoniale],
            nomFichier: ['',Validators.required],
            pieceJointe: ['',Validators.required]
        })

    }
    firstFormGroup = this._formBuilder.group({
        firstCtrl: [''],
    });
    secondFormGroup = this._formBuilder.group({
        secondCtrl: [''],
    });
    FormGroup3 = this._formBuilder.group({
        Ctrl3: [''],
    });
    FormGroup4 = this._formBuilder.group({
        Ctrl4: [''],
    });
    diplomesFiles: File[] = [];
    diplomesFilesFinal: File[] = [];

    acteFiles: File[] = [];
    acteFilesFinal: File[] = [];

    etatcivilFiles: File[] = [];
    onSelectDiplome(event: { addedFiles: any; }) {
        console.log(event);
        this.diplomesFiles.push(...event.addedFiles);
        console.log("liste diplome ------ ",this.diplomesFiles);
        this.diplomeIsNull = true

    }

    onSelectActe(event: { addedFiles: any; }) {
        console.log(event);
        this.acteFiles.push(...event.addedFiles);
        console.log("liste actes ------ ",this.acteFiles);
        console.log("acte is null before ", this.acteIsNull)
        this.acteIsNull = true
        console.log("acte is null after", this.acteIsNull)

    }

    onRemoveDiplome(event: File) {
        console.log(event);
        this.diplomesFiles.splice(this.diplomesFiles.indexOf(event), 1);
        this.diplomeIsNull = false
    }

    onRemoveActe(event: File) {
        console.log(event);
        this.acteFiles.splice(this.acteFiles.indexOf(event), 1);
        this.acteIsNull = false
    }

    avancementsFiles: File[] = [];
    onSelectAvancement(event: { addedFiles: any; }) {
        console.log(event);
        this.avancementsFiles.push(...event.addedFiles);
    }

    onRemoveAvancements(event: File) {
        console.log(event);
        this.avancementsFiles.splice(this.avancementsFiles.indexOf(event), 1);
    }

    onDeleteSituationDossier(index: number) {
        this.listSituationAdministrative[index].isDeleted = true;

        Swal.fire({
            title: 'Confirmation',
            text: 'Voulez-vous supprimer!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1D4A7B',
            cancelButtonColor: '#FF4D4F',
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Retiré',
                    html: ' élément retiré ',
                    icon: 'success',
                    timer: 1500,
                    showCancelButton: false,
                    showConfirmButton: false
                }).then(() => {
                    this.newSituationAdministrative.splice(index, 1)
                })
            }
        });
    }

    onDeleteDiplomeDossier(index: number) {
        this.listDiplome[index].isDeleted = true;

        Swal.fire({
            title: 'Confirmation',
            text: 'Voulez-vous supprimer!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1D4A7B',
            cancelButtonColor: '#FF4D4F',
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Retiré',
                    html: ' élément retiré ',
                    icon: 'success',
                    timer: 1500,
                    showCancelButton: false,
                    showConfirmButton: false
                }).then(() => {
                    this.newDiplome.splice(index, 1)
                })
            }
        });
    }

    onDeleteDossier(index: number) {
        this.listEtatCivil[index].isDeleted = true;
        Swal.fire({
            title: 'Confirmation',
            text: 'Voulez-vous supprimer!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1D4A7B',
            cancelButtonColor: '#FF4D4F',
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Retiré',
                    html: ' élément retiré ',
                    icon: 'success',
                    timer: 1500,
                    showCancelButton: false,
                    showConfirmButton: false
                }).then(() => {
                    this.newEtatCivil.splice(index, 1)
                })
            }
        });
    }


    addDiplomeReset(){
        this.diplomForm.reset()
    }

    addDossierReset(){
        this.dossierForm.reset()
    }

    addDossier() {
        const formValue = this.dossierForm.value;
        let sitAd: SituationAdministrative = new SituationAdministrative()
        sitAd.dateActe = formValue.dateActe
        sitAd.numeroActe = formValue.numeroActe
        sitAd.typeActe = {"id":0,"codeActe":formValue.typeActe,"libelleActe":""}
        formValue.typeActe==="aa" ?
            sitAd.acteAA= {"id":0,"code":formValue.acte,"libelle":"","typeSortie":"" }
            :
            sitAd.acteAG= {"id":0,"code":formValue.acte,"libelle":"","typeSortie":"" }

        sitAd.id=0

        this.newSituationAdministrative.push(sitAd);
        console.log("sit Ad ::: ",this.newSituationAdministrative);
        this.acteFilesFinal.push(this.acteFiles[0])
        this.onRemoveActe(this.acteFiles[0])

        Swal.fire({
            icon: 'success',
            title: 'Situation Administrative',
            html: 'La situation administrative a été ajouté avec succès.',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            // Réinitialiser le formulaire après l'ajout
            this.dossierForm.reset();
        })
    }

    addDiplome() {
        const formValue = this.diplomForm.value;
        let diplome: Diplome = new Diplome()
        diplome = formValue
        diplome.id = 0
        this.newDiplome.push(diplome);
        this.diplomesFilesFinal.push(this.diplomesFiles[0])
        this.onRemoveDiplome(this.diplomesFiles[0])
        console.log("dossier", formValue);
        Swal.fire({
            icon: 'success',
            title: 'nouveau diplome',
            html: ' Le diplome a été ajouté avec succès.',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            // Réinitialiser le formulaire après l'ajout
            this.diplomForm.reset();
        })
    }

    addEtatCivil(){
        const formValue = {
            ...this.firstStepForm.value,
            nomDoc:this.etatcivilFiles[0].name,
            taille:this.etatcivilFiles[0].size
        }
        console.log("data form ------> ",formValue);
        if(this.newEtatCivil===undefined)
            this.newEtatCivil = [];
        this.newEtatCivil.push(formValue)
        Swal.fire({
            icon: 'success',
            title: 'nouveau fichier',
            html: ' Le fichier a été ajouté avec succès.',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            // Réinitialiser le formulaire après l'ajout
            this.diplomForm.reset();
        })
    }

}
