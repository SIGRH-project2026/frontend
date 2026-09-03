import { Component, TemplateRef, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { ResponseApi2 } from "src/app/shared/models/ResponseApi";
import { ActeDTO } from "../../mes-demandes/components/models/ActeDTO";
import { ActeService } from "src/app/services/acteService.service";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilisateurService } from "src/app/services/utilisateur.service";
import { CredentialsService } from "src/app/services/credentials.service";
import { FileService } from "src/app/shared/services/files/file.service";
import Swal from "sweetalert2";
import { PieceJointes } from "../../models/dossier-agent/pieceJointes";
import { UserDTOs } from "src/app/models/UserDTOs";
import { NgxSpinnerService } from "ngx-spinner";
import { Profil } from "src/app/models/utilisateur";
import { TypeActeDTO } from "../../mes-demandes/components/models/TypeActeDTO";
import { TypeAADTO } from "../../mes-demandes/components/models/TypeAADTO ";
import { TypeAGDTO } from "../../mes-demandes/components/models/TypeAGDTO ";
import { Location } from "@angular/common";

@Component({
  selector: "app-liste-demandes-recus",
  templateUrl: "./liste-demandes-recus.component.html",
  styleUrls: ["./liste-demandes-recus.component.css"],
})
export class ListeDemandesRecusComponent {
  headers!: string[];
  page = 1;
  pageSize = 10;
  actList: ActeDTO[] = [];
  listInProcess:ActeDTO[]=[];
  demandeList!: any[];
  pageOptions: any = { page: 0, size: 10 };
  filtreAvanceForm!: FormGroup;
  retourForm!: FormGroup;
  joinForm!: FormGroup;
  collapsed: boolean = false;
  closeResult = "";
  date: string = "";
  typeActe: string = "";
  typeActes: TypeActeDTO[] = [];
  codeTypeActe: string = "";
  statutActe: string = "";
  reference: string = "";
  referenceActe: string = "";
  matricule:string="";
  idAgent!: number;
  userInfos: any;
  agent!: UserDTOs;
  userId: any;
  acte!: ActeDTO;
  userDTO!:UserDTOs;
  acteT!: ActeDTO;
  traitement: string = "";
  modalReference: NgbModalRef | undefined;
  searchQuery: string = "";
  filteredItems: any[] = [];
  modifModiForm!:FormGroup;
  modifRejetForm!:FormGroup;
  acteChecked: boolean = false;
  collectionSize = 0
  idActe: any;
  typeUserId !: string;
  minDate!: string;
  minDate2!: string;
  maxDate !: string
  profil!:Profil;
  acteTypeAGTypeSortie : string = "";
  acteTypeAATypeSortie : string = "";
  maxYears!: number;
  fromDashboard : boolean= false
  dashStatut!:any;
  dashCodeType!:any;
  dashType!:any;

  ngOnInit(): void {
    // Initialize data and headers
    this.headers = [
      "N° Référence",
      "Matricule",
      "Prénom",
      "Nom",
      "Acte",
      "Date Demande",
      "Type d'acte",
      "Statut",
      "Action",
    ];
    this.listAct();
    this.initForm();
    this.initRetourForm();
    this.initModifForm();
    this.initRejetForm();
    this.getTypeActes();

  }

  getTypeActes(): void {
    this.acteService.listTypeActe().subscribe({
      next: (data: ResponseApi2) => {
        if (data.status?.includes("OK")) {
          this.typeActes = data.payload ?? [];
        }
      },
    });
  }

  constructor(
      public modalService: NgbModal = inject(NgbModal),
      private route: ActivatedRoute,
      private router: Router,
      private readonly acteService: ActeService,
      private readonly _fb: FormBuilder,
      private readonly credentialService: CredentialsService,
      private readonly userService: UtilisateurService,
      private readonly fileService: FileService,
      private readonly spinner: NgxSpinnerService,
      private readonly activatedRoute: ActivatedRoute,
      private location: Location,



  ) {
    this.userInfos = this.credentialService.getUserInfos();
    this.userId = this.userInfos.id;
    this.getTraitrant(this?.userId);
    this.dashStatut = this.activatedRoute.snapshot.paramMap.get('statut');
    this.dashCodeType = this.activatedRoute.snapshot.paramMap.get('codeType');
    this.dashType = this.activatedRoute.snapshot.paramMap.get('type');

  }


  listAct() {
    // Vérification si l'utilisateur est dans le dashboard
    // console.log({type:this.dashCodeType})
    if (this.router.url.includes('dashboard')) {
      this.fromDashboard=true;
      // console.log('je viens du DashBoard et voici mon type:',this.dashCodeType)
      if (this.dashStatut === "InProcess") {
        this.listActInProcess();
      } else {
        if(this.dashStatut=="all")
          this.statutActe = "";
        else
          this.statutActe=this.dashStatut
        this.acteService
            .listActes(this.page - 1, this.pageSize, 0, this.reference, this.date, this.dashType,this.dashCodeType, this.statutActe, this.matricule)
            .subscribe({
              next: (data: ResponseApi2) => {
                if (data.status?.includes("OK")) {
                  this.actList = data.payload;
                  if (data.metadata) {
                    this.collectionSize = data.metadata.totalElements;
                  }
                }
              },
            });
      }
    } else {
      // Si l'utilisateur n'est pas dans le dashboard
      this.acteService
          .listActes(this.page - 1, this.pageSize, 0, this.reference, this.date, this.typeActe,this.codeTypeActe, this.statutActe, this.matricule)
          .subscribe({
            next: (data: ResponseApi2) => {
              if (data.status?.includes("OK")) {
                this.actList = data.payload;
                if (data.metadata) {
                  this.collectionSize = data.metadata.totalElements;
                }
              }
            },
          });
    }
  }

  listActInProcess() {
    this.acteService
        .listActesInProcess(this.page - 1, this.pageSize, 0, this.reference, this.date,this.dashCodeType, this.dashType, this.matricule)
        .subscribe({
          next: (data: ResponseApi2) => {
            if (data.status?.includes("OK")) {
              this.actList = data.payload;
              if (data.metadata) {
                this.collectionSize = data.metadata.totalElements;
              }
            }
          },
        });
  }



  getTraitrant(id:number){
    this.spinner.show()
    this.acteService.getOneUser(id)
        .subscribe((data: any) => {
          if (data.success) {
            //console.log({utilisateur:data.data});
            this.userDTO=data.data;
            this.profil=this.userDTO.profils[0];
            // console.log({this:this.profil})
            this.typeUserId = this.userDTO.typeUser
            this.spinner.hide()
          } else {
          }
        });
  }
  telechargerBordereau(bordereau:string){
    this.fileService.telecharger(bordereau)
  }

  // Définir une méthode pour vérifier si un profil contient le libellé "Chef-Division"
  hasChefDivisionProfile(profiles: Profil[]): boolean {
    return profiles && profiles.some(profile => profile.label ==='Chef-Division');
  }


  matchSearchQuery(demande: any): boolean {
    const searchValue = this.searchQuery.toLowerCase();
    let agent = demande.agent;
    let typeAA = demande.typeAA;
    let typeAG = demande.typeAG;
    let typeActe = demande.typeActe;
    let statutActe = demande.statutActe;
    if (
        typeAA != null &&
        Object.values(typeAA).some(
            (value) =>
                value != null && value.toString().toLowerCase().includes(searchValue)
        )
    ) {
      return true;
    }
    if (
        typeAG != null &&
        Object.values(typeAG).some(
            (value) =>
                value != null && value.toString().toLowerCase().includes(searchValue)
        )
    ) {
      return true;
    }
    return (
        Object.values(demande).some(
            (value) =>
                value != null && value.toString().toLowerCase().includes(searchValue)
        ) ||
        Object.values(agent).some(
            (value) =>
                value != null && value.toString().toLowerCase().includes(searchValue)
        ) ||
        Object.values(typeActe).some(
            (value) =>
                value != null && value.toString().toLowerCase().includes(searchValue)
        ) ||
        Object.values(statutActe).some(
            (value) =>
                value != null && value.toString().toLowerCase().includes(searchValue)
        )
    );
  }

  onSelectedType(event: any) {
    this.typeActe = event;
    this.acteService
        .listActes(this.page - 1, this.pageSize, 0, "", "", this.typeActe,"", "","")
        .subscribe({
          next: (data: ResponseApi2) => {
            if (data.status?.includes("OK")) {
              this.actList = data.payload;
            }
          },
        });
  }

  onSearchMat(event:any){
    this.matricule=event;
    //console.log({mat:this.matricule});
    this.acteService
        .listActes(this.page - 1, this.pageSize, 0, "", "","","", "",this.matricule)
        .subscribe({
          next: (data: ResponseApi2) => {
            if (data.status?.includes("OK")) {
              this.actList = data.payload;
            }
          },
        });
  }

  getOneDemande(id: number) {
    this.acteService.getActe(id).subscribe({
      next: (data: ResponseApi2) => {
        if (data.status?.includes("OK")) {
          // console.log(data)
          this.acteT = data.payload;
        }
      },
    });
  }



  refreshData() {
    this.actList = this.actList
        .map((user: any, i: any) => ({ id: i + 1, ...user }))
        .slice(
            (this.page - 1) * this.pageSize,
            (this.page - 1) * this.pageSize + this.pageSize
        );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return "by pressing ESC";
      case ModalDismissReasons.BACKDROP_CLICK:
        return "by clicking on a backdrop";
      default:
        return `with: ${reason}`;
    }
  }
  openModalSearch(content: TemplateRef<any>) {
    this.modalService
        .open(content, {
          ariaLabelledBy: "modal-basic-title",
          size: "lg",
          centered: true,
        })
        .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
    );
  }

  files: File[] = [];
  onSelect(event: { addedFiles: any }) {
    this.files.push(...event.addedFiles);
    this.retourForm.patchValue({ files: this.files });
    this.retourForm.get('files')?.updateValueAndValidity();
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
    this.retourForm.patchValue({ files: this.files.length > 0 ? this.files : null });
    this.retourForm.get('files')?.updateValueAndValidity();
  }

  get f(): { [p: string]: AbstractControl } {
    return this.modifRejetForm!.controls;
  }


  checkConstraintsValidation4(): void {
    Object.keys(this.f).forEach(field => {
      const control = this.modifRejetForm!.get(field);
      control!.markAsTouched({onlySelf: true});
    });
  }

  get f1(): { [p: string]: AbstractControl } {
    return this.modifModiForm!.controls;
  }


  checkConstraintsValidation(): void {
    Object.keys(this.f).forEach(field => {
      const control = this.modifModiForm!.get(field);
      control!.markAsTouched({onlySelf: true});
    });
  }

  initForm(): void {
    this.filtreAvanceForm = this._fb.group({
      referenceActe: [""],
      dateDemandeActe: [""],
      typeActe: [""],
    });
  }

  initModifForm(): void {
    this.modifModiForm = this._fb.group({
      motifModification:['',Validators.required]
    });
  }

  initRejetForm(): void {
    this.modifRejetForm = this._fb.group({
      motifRejetDemande:['',Validators.required]
    });
  }


  getUser() {
    this.acteService.getAgentActe(this.userId).subscribe({
      next: (data: ResponseApi2) => {
        if (data.status?.includes("OK")) {
          this.agent = data.payload;
        }
        // Nettoyer le formulaire après la recherche réussie
        this.filtreAvanceForm.reset();
      },
    });
  }
  onSearch() {
    this.acteService
        .listActes(
            this.page - 1,
            this.pageSize,
            0,
            this.filtreAvanceForm.value.referenceActe,
            this.filtreAvanceForm.value.dateDemandeActe,
            this.filtreAvanceForm.value.typeActe,
            "",
            "",
            ""
        )
        .subscribe({
          next: (data: ResponseApi2) => {
            if (data.status?.includes("OK")) {
              this.actList = data.payload;
            }
            this.filtreAvanceForm.reset();
          },
        });
  }

  modifier(idActe: number, idAgent: number) {
    //console.log({motif:this.modifModiForm.value.motifModification})
    this.acteService.traiterActe(idActe, this.userId, "modifier",this.modifModiForm.value.motifModification,"").subscribe({
      next: (data: ResponseApi2) => {
        if (data.status?.includes("OK")) {
          this.acte = data.payload;
          //console.log({ acte: this.acte });
        }
      },
    });
    window.location.reload();
  }

  recuDRH(idActe: number) {
    //console.log("Reçu DRH");
    this.acteService.traiterActe(idActe, this.userId, "rec-drh","","").subscribe({
      next: (data: ResponseApi2) => {
        if (data.status?.includes("OK")) {
          this.acte = data.payload;
          //console.log(this.acte);
        }
      },
    });
    window.location.reload();
  }

  encoursDGCAA(idActe: number) {
    console.log("encours DGCAA");
    this.acteService.traiterActe(idActe, this.userId, "encoursDCCAA","","").subscribe({
      next: (data: ResponseApi2) => {
        if (data.status?.includes("OK")) {
          this.acte = data.payload;
          // console.log(this.acte);
        }
      },
    });
    window.location.reload();
  }

  rejeter(idActe: number, idAgent: number) {
    //console.log({motif:this.modifRejetForm.value.motifRejetDemande});
    this.acteService.traiterActe(idActe, this.userId, "rejeter","",this.modifRejetForm.value.motifRejetDemande)
        .subscribe({
          next: (data: ResponseApi2) => {
            if (data.status?.includes("OK")) {
              this.acte = data.payload;
            }
          },
        });
    window.location.reload();
  }

  genererBordereau(id: number, idAgent: number) {}
  storeFile(id: number) {
    this.fileService.storeMultipleFiles(id, "acte", this.files).subscribe({
      next: (data: ResponseApi2) => {
        if (data.status?.includes("OK")) {
          // console.log({ files: data });
        }
      },
    });
  }


  storeBordereau(id:number){
    //console.log("On store le bordereau")
    this.fileService.storeBordereaux(id,this.files).subscribe({
      next: (data: ResponseApi2) => {
        if (data.status?.includes("OK")) {
          // console.log("on est Ok")
          //this.acte.bordereaux.concat(data.payload)
          // console.log({acte:this.acte.bordereaux})
          //console.log({ files: data });
        }
      },
    });
  }

  initJoinForm(){
    this.joinForm = this._fb.group({
      files: [null, Validators.required]
    });
  }

  initRetourForm(): void {
    this.retourForm = this._fb.group({
      dateDebut: [null,Validators.required],
      dateFin: [null,Validators.required],
      codetypeActe :[''],
      files: [null, Validators.required]
    });
    this.retourForm.get('codetypeActe')?.valueChanges.subscribe((codetypeActe) => {
      this.adjustDateValidators(codetypeActe);
    });

    this.retourForm.get('dateDebut')?.valueChanges.subscribe((data :  any) =>{

      this.validateDate();

    });
    this.retourForm.get('dateFin')?.valueChanges.subscribe(() => {

      this.validateDate();
    });

  }
  adjustDateValidators(codetypeActe: string): void {
    const dateDebut = this.retourForm.get('dateDebut');
    const dateFin = this.retourForm.get('dateFin');

    if (codetypeActe === 'DMPD' || codetypeActe === 'DMPS' || codetypeActe === 'DASTN' || codetypeActe === 'DDF') {
      dateDebut?.setValidators(Validators.required);
      dateFin?.setValidators(Validators.required);
    } else {
      dateDebut?.clearValidators();
      dateFin?.clearValidators();
    }

    dateDebut?.updateValueAndValidity();
    dateFin?.updateValueAndValidity();
  }

  requiresDates(): boolean {
    const codetypeActe = this.retourForm.get('codetypeActe')?.value;
    return codetypeActe === 'DMPD'
        || codetypeActe === 'DMPS'
        || codetypeActe === 'DASTN'
        || codetypeActe === 'DDF'
        ||codetypeActe === 'DCM'
        || codetypeActe === 'DCA'
        ||codetypeActe === 'DCMAT';
  }

  validateDate(): void {
    const dateDebut = this.retourForm.get('dateDebut')?.value;
    const dateFin = this.retourForm.get('dateFin')?.value;
    const codetypeActe = this.retourForm.get('codetypeActe')?.value;

    /* if (codetypeActe === 'DMPD' || codetypeActe === 'DMPS' ||
      codetypeActe === 'DASTN' || codetypeActe === 'DDF'|| codetypeActe === 'DCM' || codetypeActe === 'DCA' ||codetypeActe === 'DCMAT' ) { */
    if ( this.requiresDates()&& dateDebut && dateFin) {
      const startDate = new Date(dateDebut);
      const endDate = new Date(dateFin);
      switch (codetypeActe) {
        case 'DMPD':
          this.maxYears = 3;
          break;
        case 'DMPS':
        case 'DASTN':
          this.maxYears = 4;
          break;
        case 'DDF':
          this.maxYears = 5;
          break;
        default:
          this.maxYears = 3;
          break;
      }

      if (!this.dateRetour(startDate, endDate, this.maxYears)) {
        this.retourForm.get('dateFin')?.setErrors({ 'dateRange': true });
      } else {
        this.retourForm.get('dateFin')?.setErrors(null);
      }

    } else {
      this.retourForm.get('dateFin')?.setErrors(null);
    }

  }

  dateRetour(date1: Date, date2: Date, years: number): boolean {
    const startDate = date1 < date2 ? date1 : date2;
    const endDate = date1 < date2 ? date2 : date1;
    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const diffInYears = diffInDays / 365.25;
    return diffInYears <= years;
  }


  openModalSearchValidation(
      idAgent: number,
      acte: ActeDTO,
      content: TemplateRef<any>
  ) {
    this.acteT=acte
    //console.log({acte:this.acteT})
    this.idActe = acte.id
    if(acte.typeActe.codeActe==='aa'){
      this.retourForm.patchValue({
        codetypeActe: acte.typeAA?.code
      });
    }else{
      this.retourForm.patchValue({
        codetypeActe: acte.typeAG?.code
      });
    }
    this.modalService
        .open(content, {
          ariaLabelledBy: "modal-basic-title",
          size: "lg",
          centered: true,
        })
        .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
    );
  }



  openJointureModal(acte: ActeDTO,content: TemplateRef<any>){
    this.acteT=acte
    //console.log({acte:this.acteT})
    this.idActe = acte.id
    this.modalService
        .open(content, {
          ariaLabelledBy: "modal-basic-title",
          size: "lg",
          centered: true,
        })
        .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
    );
  }

  estInferieurDeuxMois(dateDebut: Date, dateFin: Date): boolean {
    const differenceEnMilliseconds = dateFin.getTime() - dateDebut.getTime();
    const differenceEnJours = differenceEnMilliseconds / (1000 * 3600 * 24); // Conversion en jours
    return differenceEnJours <= 60; // Vérifie si la différence est inférieure ou égale à 60 jours
  }


  validationPartielle(idActe: number, idAgent: number) {
    const dateDebutValue = this.retourForm.value.dateDebut;
    const dateFinValue = this.retourForm.value.dateFin;
    if(this.estInferieurDeuxMois(dateDebutValue,dateFinValue)){
      this.acteService.validerCen(this.idActe, this.userId, this.retourForm.value).subscribe({
        next: (data: ResponseApi2) => {
          if (data.status?.includes("OK")) {
            this.acte = data.payload;
          }
        },
      });
    }
  }
  profilContientCode(p: Profil, code: string): boolean {
    return p.code?.includes(code) ?? false;
  }




  valideDiv(){
    this.storeBordereau(this.idActe);
    //console.log({pass1:"passons"});
    this.acteService
        .validerDiv(this.idActe, this.userId)
        .subscribe({
          next: (data: ResponseApi2) => {
            if (data.status?.includes("OK")) {
              //console.log({pass2:"passons"});
              this.acte=data.payload;
              Swal.fire({
                icon: "success",
                html: "Validation effectuée avec success.",
                showConfirmButton: false,
                timer: 2000,
              }).then(() => {
                // Fermer le modal après l'affichage du message popup de succès
                this.modalService.dismissAll();
                // Rediriger vers la page des demandes reçues après la fermeture du message popup
                this.router.navigate(["carrieres/demandes-recues"]);
                // Recharger la page après la fermeture du message popup
                window.location.reload();
              });
            }
            /* this.router.navigate(["carrieres/demandes-recues"]);
                          window.location.reload(); */
          },
        });
  }

  dateObligatoire(valeur:string){
    const champ = this.retourForm.controls[valeur]
    const date:Date = this.retourForm.value[valeur]
    // console.log("code:"+this.retourForm.value.codetypeActe)
    //console.log({ans:this.maxYears})
    return champ.touched &&  isNaN(new Date(date).getTime())

  }
  dateInvalide(valeur:string){
    let newDate:Date=this.retourForm.value.dateDebut;
    newDate.setDate(newDate.getDate()-1)
    //console.log(newDate)
    if(valeur=="dateFin")
      newDate=new Date(this.retourForm.value["dateDebut"])
    const champ = this.retourForm.controls[valeur]
    const date:Date = new Date(this.retourForm.value[valeur])
    //console.log("date",date.valueOf())
    //console.log("newDate",newDate.valueOf())
    return champ.touched && date.valueOf()<newDate.valueOf()
  }



  valider() {
    const dateDebutValue = this.retourForm.value.dateDebut;
    const dateFinValue = this.retourForm.value.dateFin;
    const codetypeActe=this.retourForm.value.codetypeActe;
    // console.log({ idAct: codetypeActe });
    this.acteService
        .validerCen(this.idActe, this.userId, this.retourForm.value)
        .subscribe({
          next: (data: ResponseApi2) => {
            if (data.status?.includes("OK")) {
              this.storeFile(this.idActe);
              Swal.fire({
                icon: "success",
                html: "Validation effectuée avec success",
                showConfirmButton: false,
                timer: 2000,
              }).then(() => {
                // Fermer le modal après l'affichage du message popup de succès
                this.modalService.dismissAll();
                // Rediriger vers la page des demandes reçues après la fermeture du message popup
                this.router.navigate(["carrieres/demandes-recues"]);
                // Recharger la page après la fermeture du message popup
                window.location.reload();
              });
            }
          },
        });
  }


  telecharger(id: number) {
    this.acteService.getActe(id).subscribe({
      next: (data: ResponseApi2) => {
        if (data.status?.includes("OK")) {
          this.acte = data.payload;
          if (this.acte.pieceJointes.length > 0) {
            const num = this.acte.pieceJointes.length;
            const dernierElement = this.acte.pieceJointes[num - 1];
            ///console.log("Dernier élément dans piecesJointes:", dernierElement);
            // Maintenant on utilise dernierElement
            this.fileService.telecharger(dernierElement.generatedName);
          } else {
            console.log("Aucun élément dans piecesJointes.");
          }
        }
      },
    });
  }

  async envoyerFPMultiple(): Promise<void> {
    const actes: number[] = this.actList.filter(acte => acte.checked).map(acte => acte.id);
    // console.log({ idsActesSelectionnes: actes });
    const result = await Swal.fire({
      title: "Confirmation",
      text: "Voulez-vous envoyer ces actes à la fonction publique ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgba(29, 74, 123, 1)",
      cancelButtonColor: "#FF4D4F",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    });

    if (result.isConfirmed) {
      // try {
      //    console.log("on envoiiiiiiiiiiiiiiiiiie");
      await this.acteService.aEnvoyerFP(actes, this.userId).subscribe({
            next: (data: ResponseApi2) => {
              if (data.status?.includes("OK")) {
                // Si l'envoi réussit, affiche le message de confirmation
                Swal.fire({
                  text: `Les actes ont été transmis avec succès.`,
                  icon: "success",
                  timer: 1500,
                  showCancelButton: false,
                  showConfirmButton: false,
                }).then(() => {
                  // Fermer le modal après l'affichage du message popup de succès
                  this.modalService.dismissAll();
                  // Rediriger vers la page des demandes reçues après la fermeture du message popup
                  this.router.navigate(["carrieres/demandes-recues"]);
                  // Recharger la page après la fermeture du message popup
                  window.location.reload();
                });
              }
              // Réinitialise la propriété checked de chaque élément de actList à false
              this.actList.forEach((demande) => (demande.checked = false));
              /*    } catch (error) {
                     // Si l'envoi échoue, affiche un message d'erreur
                     Swal.fire({
                         text: `Une erreur s'est produite lors de la transmission des actes.`,
                         icon: "error",
                     });
                 } */
            }
          }
      )}
  }


  checkAll() {
    this.acteChecked = this.actList.some((demande) => demande.checked);
  }
  envoyerActes(idsActesSelectionnes: number[]): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Simuler un envoi réussi
        resolve();
      }, 1000); // Simule un délai d'attente de 1 seconde
    });
  }

  openModalTraitement( idActe: number, content: TemplateRef<any>) {
    this.idActe = idActe
    //console.log({idActe:idActe})
    this.modalService
        .open(content, {
          ariaLabelledBy: "modal-basic-title",
          size: "lg",
          centered: true,
        })
        .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
    );

  }

  openTraitementRejet(idActe: number,content: TemplateRef<any>
  ) {
    this.idActe=idActe;
    //console.log({idActe:idActe})
    Swal.fire({
      title: "Confirmation",
      text: "Souhaitez-vous confirmer le rejet ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgba(29, 74, 123, 1)",
      cancelButtonColor: "#FF4D4F",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        this.openModalTraitement(idActe, content);
      }
    });
  }

  onSaveTraitementRejet() {
    //console.log("Saving reject")
    this.rejeter(this.idActe,this.userId);
    Swal.fire({
      html: `Demande d'acte <b>`+  this.acte.referenceActe +  `</b> a éte rejeté.`,
      icon: "success",
      timer: 1500,
      showCancelButton: false,
      showConfirmButton: false,
    }).then((result) => {
      this.modalService.dismissAll();
    });
  }

  onSaveTraitementModifier() {
    this.modifier(this.idActe,this.userId);
    //console.log({acte:this.acte})
    Swal.fire({
      html: `Demande d'acte <b>`+  this.acte.referenceActe +  `</b> a éte renvoyé pour modification.`,
      icon: "success",
      timer: 1500,
      showCancelButton: false,
      showConfirmButton: false,
    }).then((result) => {
      this.modalService.dismissAll();
    });
  }
//
  getDuree( codeActe : string, typeActeAA ?: string, typeActeAG ?: string) : number{
    let duree = 3
    //console.log({code:codeActe})
    //console.log({type1:typeActeAA})
    //console.log({code:typeActeAG})
    return duree
  }



  forTraitement() : boolean {
    //console.log({sortie:this.acteTypeAATypeSortie})
    //console.log({sortie:this.acteTypeAGTypeSortie})
    if(this.acteTypeAGTypeSortie==='STEM' || this.acteTypeAATypeSortie=='STEM')
      return true


    return false
  }


  goBack() {
    this.location.back();
  }
}
