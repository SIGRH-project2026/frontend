import { Component, OnDestroy, OnInit, TemplateRef, inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import { DeconectedDTO, Profil } from "../../../../../models/utilisateur";
import { CredentialsService } from "../../../../../services/credentials.service";
import { ListeUtilisateurStateService } from "../../../../../services/liste-utilisateur-state.service";
import { ReferencesService } from "../../../../../services/references.service";
import { UtilisateurService } from "../../../../../services/utilisateur.service";

interface SearchData {
  filter?: string;
  matricule: string;
  prenom: string;
  nom: string;
  profile?: string;
  region: string;
  ia: string;
  ief: string;
  etablissement: string;
  typeSystemeEnseignement?: string;
}

@Component({
  selector: "app-list-utilisateur",
  templateUrl: "./list-utilisateur.component.html",
  styleUrls: ["./list-utilisateur.component.css"],
})
export class ListUtilisateurComponent implements OnInit, OnDestroy {
  /** Clé d'identification de l'état de recherche conservé en mémoire. */
  private static readonly STATE_KEY = "utilisateurs-niveau-deconcentre";

  headers!: string[];
  page = 0;
  pageSize = 10;

  totalPages = 0;
  size = 10;
  userList: DeconectedDTO[] = [];
  collectionSize = this.userList.length;
  collapsed: boolean = false;
  text = "";
  closeResult = "";
  alertService: any;
  pageOptions: any = { totalPages: 0, size: 10 };
  filterValue = "";
  profils: Profil[] = [];
  structure: any;
  codeIA: any;
  searchData!: SearchData;
  region: any;
  ief: any;
  ia: any;
  cfp: any;
  etablissement: any;
  searchForm!: FormGroup;

  profile: any;
  isSearchResult = false;
  isSearchUser = false;
  grade: any;
  corpsGrade: any;

  advancedSearchForm!: FormGroup;
  speciality: any;
  userInfos: any;

  // Import (charger liste d'utilisateurs)
  importFile: File | null = null;
  importResult: any = null;
  importLoading = false;
  importErrorsPage = 1;
  importErrorsPageSize = 10;

  // Détection/suppression des doublons de matricule
  duplicateReport: any = null;
  duplicateLoading = false;
  duplicatesPage = 1;
  duplicatesPageSize = 10;

  regionCode: string = "";
  iaCode: string = "";
  iefCode: string = "";
  etablissementCode: string = "";
  specialiteCode: string = "";
  corpsCode: string = "";
  gradeCode: string = "";
  matriculeCode: string = "";
  prenomCode: string = "";
  nomCode: string = "";
  dateNaissanceCode: string = "";
  cniCode: string = "";
  telephoneCode: string = "";
  emailCode: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public modalService: NgbModal = inject(NgbModal),
    private userService: UtilisateurService,
    private spinner: NgxSpinnerService,
    private referenceService: ReferencesService,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private listeStateService: ListeUtilisateurStateService,
  ) {}

  ngOnInit(): void {
    // Initialize data and headers
    this.headers = [
      "Matricule",
      "Prénom",
      "Nom",
      "Profil",
      "Etablissement",
      "Statut",
      "Action",
    ];
    this.userInfos = this.credentialsService.getUserInfos();

    //  this.listUtilisateurDecoPage(this.page, this.pageSize, "", "", "", "", "", "", "", "", "", "", "", "", "", "");

    this.lookingSearchForm();
    //  this.refreshData();
    // this.listUtilisateur(this.pageOptions, this.filterValue);
    // this.listUtilisateurAdvanced(this.searchData);
    /* this.listUtilisateursAdvanced(
             this.totalPages,
             this.size,
             '',
             '',
             this.searchData?.matricule,
             this.searchData?.prenom,
             this.searchData?.nom,
             this.searchData?.region,
             this.searchData?.ia,
             this.searchData?.ief,
             this.searchData?.etablissement);
     
           this.searchForm = this.formBuilder.group({
               matricule: ['' ],
               prenom: [''],
               nom: [''],
               region: [''],
               ia: [''],
               ief: [''],
               etablissement: [''],
     
           });
     
         */

    this.referenceService.listProfilesDEC().subscribe((response) => {
      if (response.success) this.profils = response.data;
    });

    this.referenceService.listRegion().subscribe((response) => {
      if (response.success) this.region = response.data;
    });

    this.referenceService.listcorpsGrade().subscribe((response) => {
      if (response.success) this.corpsGrade = response.data;
    });

    this.referenceService.listSpeciality().subscribe((response) => {
      if (response.success) this.speciality = response.data;
    });

    this.referenceService.lisStructure().subscribe((response) => {
      if (response.success) this.structure = response.data;
    });

    // Restaure la recherche précédente si l'on revient d'une autre page
    // (ex. détail ou modification d'un utilisateur). L'état est perdu au
    // rechargement complet de la page.
    const savedState = this.listeStateService.get(
      ListUtilisateurComponent.STATE_KEY,
    );
    if (savedState) {
      this.restoreSearchState(savedState);
    }
  }

  ngOnDestroy(): void {
    // Conserve les critères de recherche et la pagination pour les restaurer
    // au retour sur la liste (tant que la page n'est pas actualisée).
    this.listeStateService.save(ListUtilisateurComponent.STATE_KEY, {
      formValue: this.advancedSearchForm?.value,
      isSearchUser: this.isSearchUser,
      page: this.page,
      pageSize: this.pageSize,
    });
  }

  /** Restaure le formulaire de recherche puis relance la requête correspondante. */
  private restoreSearchState(savedState: any): void {
    if (savedState.formValue) {
      this.advancedSearchForm.patchValue(savedState.formValue);

      // Recharge les listes déroulantes dépendantes des valeurs restaurées.
      const { structure, region, ia, ief, corps } = savedState.formValue;
      if (structure) {
        this.getStruct(structure);
      }
      if (region) {
        this.getListIA(region);
      }
      if (ia) {
        this.getListEF(ia);
      }
      if (ief) {
        this.getListEtablissement(ief);
      } else if (ia) {
        this.getListEtabByIA(ia);
      }
      if (corps) {
        this.getGradeFromCorps(corps);
      }
    }
    this.isSearchUser = savedState.isSearchUser;
    this.page = savedState.page ?? 0;
    this.pageSize = savedState.pageSize ?? 10;

    if (this.isSearchUser) {
      // Relance la recherche avec les critères restaurés : résultats
      // conservés et données à jour (utile après une modification).
      this.listUtilisateurDecoPage(
        this.page,
        this.pageSize,
        this.advancedSearchForm.value["region"],
        this.advancedSearchForm.value["ia"],
        this.advancedSearchForm.value["ief"],
        this.advancedSearchForm.value["etablissement"],
        this.advancedSearchForm.value["typeSystemeEnseignement"],
        this.advancedSearchForm.value["specialite"],
        this.advancedSearchForm.value["corps"],
        this.advancedSearchForm.value["grade"],
        this.advancedSearchForm.value["matricule"],
        this.advancedSearchForm.value["prenom"],
        this.advancedSearchForm.value["nom"],
        this.advancedSearchForm.value["dateNaissance"],
        this.advancedSearchForm.value["cni"],
        this.advancedSearchForm.value["telephone"],
        this.advancedSearchForm.value["email"],
      );
    }
  }

  getListIA(code: any): void {
    this.referenceService.listIAByCode(code).subscribe((response) => {
      if (response.success) {
        this.ia = response.data;
      }
    });
  }

  getListEF(code: any): void {
    this.codeIA = code;
    this.referenceService.listIEFByCode(code).subscribe((response) => {
      if (response.success) {
        this.ief = response.data;
      }
    });
  }

  getListEtabByIA(code: any): void {
    this.referenceService
      .listEtablissementByIACode(code)
      .subscribe((response) => {
        if (response.success) {
          this.etablissement = response.data;
        }
      });
  }

  getListCFP(code: any): void {
    this.referenceService.listCFPByCode(code).subscribe((response) => {
      if (response.success) {
        this.cfp = response.data;
      }
    });
  }

  getGradeFromCorps(code: any) {
    this.referenceService.listGradeByCode(code).subscribe((response) => {
      if (response.success) {
        this.grade = response.data;
        console.log(this.grade);
      }
    });
  }

  getListEtablissement(code: any): void {
    this.referenceService
      .listEtablissementByCode(code)
      .subscribe((response) => {
        if (response.success) {
          this.etablissement = response.data;
        }
      });
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
        },
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

  getStruct(code: any) {
    if (code) {
      this.spinner.show();
      this.referenceService
        .listEtablissementByEFFCode(code)
        .subscribe((response) => {
          if (response.success) {
            this.etablissement = response.data;
            this.spinner.hide();
          }
        });

      this.spinner.hide();
    }
  }

  refreshData() {
    //  this.listUtilisateurAdvancedSearch(this.pageOptions, this.searchData);
    //this.listUtilisateurAdvancedProfile(this.pageOptions?.totalPages, this.size, this.filterValue, '', this.searchData?.matricule, this.searchData?.prenom, this.searchData?.nom, this.searchData?.region, this.searchData?.ia, this.searchData?.ief,this.searchData?.etablissement);
    this.listUtilisateursAdvanced(
      this.pageOptions?.totalPages,
      this.size,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    );

    /*  const  matricule  = this.searchData?.matricule !== undefined ? this.searchData?.matricule : '';
          const   prenom =  this.searchData?.prenom !== undefined ? this.searchData?.prenom : '';
          const   nom =  this.searchData?.nom !== undefined ? this.searchData?.nom : '';
          const    region =   this.searchData?.region !== undefined ? this.searchData?.region : '';
          const    ia =   this.searchData?.ia !== undefined ? this.searchData?.ia : '';
          const    ief =   this.searchData?.ief !== undefined ? this.searchData?.ief : '';
          const    etablissement =   this.searchData?.etablissement !== undefined ? this.searchData?.etablissement : '';
          const    profile =   this.searchData?.profile !== undefined ? this.searchData?.profile : '';
    
          this.listUtilisateurAdvancedProfile(this.pageOptions?.totalPages, this.pageOptions?.size, '', profile, matricule, prenom, nom, region, ia, ief, etablissement);
    
    
         */
  }

  onCreateUser() {
    this.router.navigate(["create-utilisateur"], {
      relativeTo: this.route.parent,
    });
  }
  onEditUser(user: any) {
    this.router.navigate([user.id, "edit-utilisateur"], {
      relativeTo: this.route.parent,
    });
  }

  onViewUser(user: any) {
    this.router.navigate([user.id, "detail-utilisateur"], {
      relativeTo: this.route.parent,
    });
  }

  /*  onSearch(): void {
  
          this.listUtilisateurAdvancedSearch(this.pageOptions, this.searchData)
  
      }
  */

  listUtilisateurAdvancedProfile(
    page: number,
    size: number,
    filter: string,
    profile: string,
    matricule: string,
    prenom: string,
    nom: string,
    region: string,
    ia: string,
    ief: string,
    etablissement: string,
    typeSystemeEnseignement: string,
  ): void {
    this.spinner.show();
    this.userService
      .listUtilisateurDeconectedAdvanced(
        page,
        size,
        filter,
        profile,
        matricule,
        prenom,
        nom,
        region,
        ia,
        ief,
        etablissement,
        typeSystemeEnseignement,
      )
      .subscribe((data) => {
        if (data?.status === "OK") {
          this.userList = data?.payload;
          this.spinner.hide();

          this.collectionSize = data.metadata?.totalElements ?? 0;
          this.pageSize = data.metadata?.size ?? 0;
        } else {
          this.alertService.showAlert({
            status: data?.status,
            message: data?.message,
            titre: "Utilisateurs",
          });
        }
      });
  }

  onSearch() {
    const matricule =
      this.searchData?.matricule !== undefined
        ? this.searchData?.matricule
        : "";
    const prenom =
      this.searchData?.prenom !== undefined ? this.searchData?.prenom : "";
    const nom = this.searchData?.nom !== undefined ? this.searchData?.nom : "";
    const region =
      this.searchData?.region !== undefined ? this.searchData?.region : "";
    const ia = this.searchData?.ia !== undefined ? this.searchData?.ia : "";
    const ief = this.searchData?.ief !== undefined ? this.searchData?.ief : "";
    const etablissement =
      this.searchData?.etablissement !== undefined
        ? this.searchData?.etablissement
        : "";
    const typeSystemeEnseignement =
      this.searchData?.typeSystemeEnseignement !== undefined
        ? this.searchData?.typeSystemeEnseignement
        : "";
    const profile =
      this.searchData?.profile !== undefined ? this.searchData?.profile : "";
    this.listUtilisateurAdvancedProfile(
      this.pageOptions?.totalPages,
      this.pageOptions?.size,
      this.filterValue,
      profile,
      matricule,
      prenom,
      nom,
      region,
      ia,
      ief,
      etablissement,
      typeSystemeEnseignement,
    );
  }

  refreshData1(event: any) {
    this.totalPages = +event.target["text"] - 1;
    if (
      event.target["text"] != undefined &&
      event.target["text"] != "««" &&
      event.target["text"] != "«" &&
      event.target["text"] != "»" &&
      event.target["text"] != "»»"
    ) {
      this.listUtilisateurAdvanced(this.searchData);
    }
  }

  onResetfiltre() {
    this.isSearchResult = !this.isSearchResult;
    this.searchForm.reset();
    this.refreshData();
  }

  onAdvancedSearch() {
    this.searchData = {
      matricule: this.searchForm.controls["matricule"].value,
      prenom: this.searchForm.controls["prenom"].value,
      nom: this.searchForm.controls["nom"].value,
      //  profile:  searchForm.controls['profile'].value !== '' ? searchForm.controls['profile'].value : undefined,
      region: this.searchForm.controls["region"].value,
      ia: this.searchForm.controls["ia"].value,
      ief: this.searchForm.controls["ief"].value,
      etablissement: this.searchForm.controls["etablissement"].value,
      typeSystemeEnseignement:
        this.searchForm.controls["typeSystemeEnseignement"].value,
    };

    // this.listUtilisateursAdvanced(this.pageOptions?.totalPages, this.pageOptions?.size,'', '',this.searchData?.matricule,this.searchData?.prenom, this.searchData?.nom,   this.searchData?.region, this.searchData?.ia, this.searchData?.ief, this.searchData?.etablissement);

    this.listUtilisateursAdvanced(
      this.pageOptions?.totalPages,
      this.pageOptions?.size,
      "",
      "",
      this.searchData?.matricule,
      this.searchData?.prenom,
      this.searchData?.nom,
      this.searchData?.region,
      this.searchData?.ia,
      this.searchData?.ief,
      this.searchData?.etablissement,
      this.searchData?.typeSystemeEnseignement,
    );
    // this.listUtilisateurAdvanced( this.searchData)

    this.isSearchResult = true;
    this.modalService.dismissAll();
  }

  onSearchProfile() {
    this.listUtilisateurAdvancedSearchProfile(this.searchData);
  }

  listUtilisateurAdvancedSearch(pageOptions: any, searchData: any): void {
    this.spinner.show();
    // console.log(this.totalPages)
    this.userService
      .listUtilisateurDeconectedAdvanced(
        this.totalPages,
        this.size,
        this.filterValue,
        searchData?.profile !== undefined ? searchData?.profile : "",
        searchData?.matricule !== undefined ? searchData?.matricule : "",
        searchData?.prenom !== undefined ? searchData?.prenom : "",
        searchData?.nom !== undefined ? searchData?.nom : "",
        searchData?.region !== undefined ? searchData?.region : "",
        searchData?.ia !== undefined ? searchData?.ia : "",
        searchData?.ief !== undefined ? searchData?.ief : "",
        searchData?.etablissement !== undefined
          ? searchData?.etablissement
          : "",
        searchData?.typeSystemeEnseignement !== undefined
          ? searchData?.typeSystemeEnseignement
          : "",
      )
      .subscribe((data) => {
        if (data?.status === "OK") {
          setTimeout(() => {
            this.userList = data?.payload;
            //  this.spinner.hide();

            this.collectionSize = data.metadata?.totalElements ?? 0;
            this.pageSize = data.metadata?.size ?? 0;
          }, 2000);
        } else {
          this.alertService.showAlert({
            status: data?.status,
            message: data?.message,
            titre: "Utilisateurs",
          });
        }
      });
  }
  listUtilisateurAdvancedSearchProfile(searchData: any): void {
    //  this.spinner.show()

    //  console.log(this.profile)
    this.userService
      .listUtilisateurDeconectedAdvanced(
        this.pageOptions?.totalPages,
        this.pageOptions?.size,
        "",
        this.profile,
        searchData?.matricule !== undefined ? searchData?.matricule : "",
        searchData?.prenom !== undefined ? searchData?.prenom : "",
        searchData?.nom !== undefined ? searchData?.nom : "",
        searchData?.region !== undefined ? searchData?.region : "",
        searchData?.ia !== undefined ? searchData?.ia : "",
        searchData?.ief !== undefined ? searchData?.ief : "",
        searchData?.etablissement !== undefined
          ? searchData?.etablissement
          : "",
        searchData?.typeSystemeEnseignement !== undefined
          ? searchData?.typeSystemeEnseignement
          : "",
      )
      .subscribe((data) => {
        if (data?.status === "OK") {
          setTimeout(() => {
            this.userList = data?.payload;
            //  this.spinner.hide();

            this.collectionSize = data.metadata?.totalElements ?? 0;
            this.pageSize = data.metadata?.size ?? 0;
          }, 2000);
        } else {
          this.alertService.showAlert({
            status: data?.status,
            message: data?.message,
            titre: "Utilisateurs",
          });
        }
      });
  }

  listUtilisateurAdvanced(searchData: any): void {
    this.spinner.show();

    this.userService
      .listUtilisateurDeconectedAdvanced(
        this.totalPages,
        this.size,
        this.filterValue,

        searchData?.profile !== undefined ? searchData?.profile : "",
        searchData?.matricule !== undefined ? searchData?.matricule : "",
        searchData?.prenom !== undefined ? searchData?.prenom : "",
        searchData?.nom !== undefined ? searchData?.nom : "",
        searchData?.region !== undefined ? searchData?.region : "",
        searchData?.ia !== undefined ? searchData?.ia : "",
        searchData?.ief !== undefined ? searchData?.ief : "",
        searchData?.etablissement !== undefined
          ? searchData?.etablissement
          : "",
        searchData?.typeSystemeEnseignement !== undefined
          ? searchData?.typeSystemeEnseignement
          : "",
      )
      .subscribe((data) => {
        if (data?.status === "OK") {
          setTimeout(() => {
            this.userList = data?.payload;
            this.spinner.hide();

            this.collectionSize = data.metadata?.totalElements ?? 0;
            this.pageSize = data.metadata?.size ?? 0;
          }, 2000);
        } else {
          this.alertService.showAlert({
            status: data?.status,
            message: data?.message,
            titre: "Utilisateurs",
          });
        }
      });
  }

  listUtilisateursAdvanced(
    page: number,
    size: number,
    filter: string,
    profile: string,
    matricule: string,
    prenom: string,
    nom: string,
    region: string,
    ia: string,
    ief: string,
    etablissement: string,
    typeSystemeEnseignement?: string,
  ): void {
    matricule = matricule !== undefined ? matricule : "";
    prenom = prenom !== undefined ? prenom : "";
    nom = nom !== undefined ? nom : "";
    profile = profile !== undefined ? profile : "";
    region = region !== undefined ? region : "";
    ia = ia !== undefined ? ia : "";
    ief = ief !== undefined ? ief : "";
    etablissement = etablissement !== undefined ? etablissement : "";
    typeSystemeEnseignement = typeSystemeEnseignement ?? "";

    this.userService
      .listUtilisateurDeconectedAdvanced(
        page,
        size,
        filter,
        profile,
        matricule,
        prenom,
        nom,
        region,
        ia,
        ief,
        etablissement,
        typeSystemeEnseignement,
      )
      .subscribe((data) => {
        this.spinner.show();
        if (data?.status === "OK") {
          setTimeout(() => {
            this.userList = data?.payload;
            this.spinner.hide();

            this.collectionSize = data.metadata?.totalElements ?? 0;
            this.pageSize = data.metadata?.size ?? 0;
          }, 2000);
        } else {
          this.alertService.showAlert({
            status: data?.status,
            message: data?.message,
            titre: "Utilisateurs",
          });
        }
      });
  }

  listUtilisateur(pageOptions: any, filterValue: any): void {
    this.spinner.show();
    this.userService
      .listUtilisateurDeconected(
        pageOptions?.page,
        pageOptions?.size,
        filterValue,
      )
      .subscribe((data) => {
        if (data?.status === "OK") {
          //  this.spinner.show();
          setTimeout(() => {
            this.userList = data?.payload;
            this.spinner.hide();

            this.collectionSize = data.metadata?.totalElements ?? 0;
            this.pageSize = data.metadata?.size ?? 0;
          }, 2000);
        } else {
          this.alertService.showAlert({
            status: data?.status,
            message: data?.message,
            titre: "Utilisateurs",
          });
        }
      });
  }

  changeStatus(user: any): void {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgba(29, 74, 123, 1)",
      cancelButtonColor: "#FF4D4F",
      confirmButtonText: "Confirmer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.changeStatus(user?.id).subscribe({
          next: (response) => {
            if (!user.status) {
              this.text = "Activé";
              user.status = true;
            } else {
              this.text = "Désactivé";
              user.status = false;
            }

            Swal.fire({
              title: this.text,
              text: `L'utilisateur ${user.prenom + " " + user.nom} a été ${this.text}.`,
              icon: "success",
              timer: 1500,
              showCancelButton: false,
              showConfirmButton: false,
            });
          },
        });
      }
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  lookingSearchForm() {
    this.advancedSearchForm = this.formBuilder.group({
      region: [""],
      ia: [""],
      ief: [""],
      etablissement: [""],
      specialite: [""],
      matricule: [""],
      structure: [""],
      corps: [""],
      grade: [""],
      prenom: [""],
      nom: [""],
      dateNaissance: [""],
      cni: [""],
      telephone: [""],
      email: [""],
    });
  }

  onCancle() {
    console.log("ici");
    this.advancedSearchForm.reset();
    this.listUtilisateurDecoPage(
      0,
      10,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    );
    this.closeModal();
  }

  onSearchUser() {
    this.listUtilisateurDecoPage(
      this.page,
      this.pageSize,
      this.advancedSearchForm.value["region"],
      this.advancedSearchForm.value["ia"],
      this.advancedSearchForm.value["ief"],
      this.advancedSearchForm.value["etablissement"],
      this.advancedSearchForm.value["typeSystemeEnseignement"],
      this.advancedSearchForm.value["specialite"],
      this.advancedSearchForm.value["corps"],
      this.advancedSearchForm.value["grade"],
      this.advancedSearchForm.value["matricule"],
      this.advancedSearchForm.value["prenom"],
      this.advancedSearchForm.value["nom"],
      this.advancedSearchForm.value["dateNaissance"],
      this.advancedSearchForm.value["cni"],
      this.advancedSearchForm.value["telephone"],
      this.advancedSearchForm.value["email"],
    );

    this.isSearchUser = !this.isSearchUser;

    this.closeModal();
  }

  onAdvancedSearchForm() {
    this.listUtilisateurDecoPage(
      0,
      this.size,
      this.advancedSearchForm.value["region"],
      this.advancedSearchForm.value["ia"],
      this.advancedSearchForm.value["ief"],
      this.advancedSearchForm.value["etablissement"],
      this.advancedSearchForm.value["typeSystemeEnseignement"],
      this.advancedSearchForm.value["specialite"],
      this.advancedSearchForm.value["corps"],
      this.advancedSearchForm.value["grade"],
      this.advancedSearchForm.value["matricule"],
      this.advancedSearchForm.value["prenom"],
      this.advancedSearchForm.value["nom"],
      this.advancedSearchForm.value["dateNaissance"],
      this.advancedSearchForm.value["cni"],
      this.advancedSearchForm.value["telephone"],
      this.advancedSearchForm.value["email"],
    );

    this.closeModal();
  }

  listUtilisateurDecoPage(
    page: number,
    size: number,
    region: string,
    ia: string,
    ief: string,
    etablissement: string,
    typeSystemeEnseignement: string,
    specialite: string,
    corps: string,
    grade: string,
    matricule: string,
    prenom: string,
    nom: string,
    dateNaissance: string,
    cni: string,
    telephone: string,
    email: string,
  ) {
    this.userService
      .getAllDecoUser(
        page,
        size,
        region,
        ia,
        ief,
        etablissement,
        typeSystemeEnseignement,
        specialite,
        corps,
        grade,
        matricule,
        prenom,
        nom,
        dateNaissance,
        cni,
        telephone,
        email,
      )
      .subscribe((data) => {
        if (data?.status === "OK") {
          this.userList = data?.payload;

          this.spinner.hide();

          this.collectionSize = data.metadata?.totalElements ?? 0;
          this.size = data.metadata?.size ?? 0;
        } else {
          this.alertService.showAlert({
            status: data?.status,
            message: data?.message,
            titre: "Utilisateurs",
          });
        }
      });
  }

  listUtilisateurDecoPaging() {
    this.spinner.show();

    this.userService
      .getAllDecoUser(
        this.page,
        this.pageSize,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      )
      .subscribe((data) => {
        if (data?.status === "OK") {
          // console.log(data);
          this.userList = data?.payload;

          this.spinner.hide();

          this.collectionSize = data.metadata?.totalElements ?? 0;
          this.size = data.metadata?.size ?? 0;
        } else {
          this.alertService.showAlert({
            status: data?.status,
            message: data?.message,
            titre: "Utilisateurs",
          });
        }
      });
  }

  refreshData2() {
    this.listUtilisateurDecoPaging();
  }

  // ==========================================================================
  // Import en masse d'utilisateurs (Charger liste)
  // ==========================================================================

  get pagedImportErrors(): any[] {
    const errors = this.importResult?.errors ?? [];
    const start = (this.importErrorsPage - 1) * this.importErrorsPageSize;
    return errors.slice(start, start + this.importErrorsPageSize);
  }

  onOpenImport(content: TemplateRef<any>) {
    this.importFile = null;
    this.importResult = null;
    this.importLoading = false;
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      scrollable: true,
    });
  }

  onOpenDuplicates(content: TemplateRef<any>) {
    this.duplicateReport = null;
    this.duplicateLoading = false;
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
      backdrop: "static",
      scrollable: true,
    });
  }

  onImportFileSelected(event: any) {
    const files: FileList = event?.target?.files;
    this.importFile = files && files.length > 0 ? files[0] : null;
  }

  onSubmitImport() {
    if (!this.importFile) {
      return;
    }
    this.importLoading = true;
    this.spinner.show();
    this.userService.importUtilisateursDeconected(this.importFile).subscribe({
      next: (response: any) => {
        this.importLoading = false;
        this.spinner.hide();
        if (response?.success) {
          this.importResult = response.data;
          this.importErrorsPage = 1;
          // Rafraîchir la liste affichée si une recherche est active
          if (this.isSearchUser) {
            this.refreshData2();
          }
        } else {
          this.userService.showSwal("error", response?.message);
        }
      },
      error: (error) => {
        this.importLoading = false;
        this.spinner.hide();
        this.userService.showSwal(
          "error",
          error?.error?.message ??
            "Une erreur est survenue lors de l'import du fichier.",
        );
      },
    });
  }

  downloadImportTemplate() {
    const headers = [
      "matricule",
      "prenom",
      "nom",
      "email",
      "telephone",
      "adresse",
      "sexe",
      "situationMatrimoniale",
      "nationalite",
      "lieuDeNaissance",
      "dateNaissance",
      "cni",
      "profil",
      "corps",
      "grade",
      "fonction",
      "specialite",
      "structure",
      "typePoste",
      "typeMatricule",
      "region",
      "ia",
      "ief",
      "etablissement",
      "typeSystemeEnseignement",
      "nombreEnfants",
    ];
    const exampleRow = [
      "SN123456",
      "Awa",
      "Diop",
      "awa.diop@example.sn",
      "770000000",
      "Dakar",
      "F",
      "Célibataire",
      "Sénégalaise",
      "Dakar",
      "1990-01-15",
      "1234567890123",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "IA Dakar",
      "IEF Dakar Ville",
      "Lycée Blaise Diagne",
      "Secondaire Général",
      "0",
    ];
    const csvContent =
      headers.join(";") + "\n" + exampleRow.join(";") + "\n";
    const blob = new Blob(["﻿" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "modele_import_utilisateurs.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // ==========================================================================
  // Détection / suppression des doublons de matricule
  // ==========================================================================

  get pagedDuplicateGroups(): any[] {
    const groupes = this.duplicateReport?.groupes ?? [];
    const start = (this.duplicatesPage - 1) * this.duplicatesPageSize;
    return groupes.slice(start, start + this.duplicatesPageSize);
  }

  onDetectDuplicates() {
    this.duplicateLoading = true;
    this.duplicateReport = null;
    this.spinner.show();
    this.userService.findDuplicateUtilisateursDeconected().subscribe({
      next: (response: any) => {
        this.duplicateLoading = false;
        this.spinner.hide();
        if (response?.success) {
          this.duplicateReport = response.data;
          this.duplicatesPage = 1;
          if (!this.duplicateReport?.matriculesEnDoublon) {
            Swal.fire({
              icon: "success",
              html: "Aucun doublon de matricule détecté.",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        } else {
          this.userService.showSwal("error", response?.message);
        }
      },
      error: (error) => {
        this.duplicateLoading = false;
        this.spinner.hide();
        this.userService.showSwal(
          "error",
          error?.error?.message ??
            "Une erreur est survenue lors de la détection des doublons.",
        );
      },
    });
  }

  onRemoveDuplicates() {
    if (!this.duplicateReport?.matriculesEnDoublon) {
      return;
    }
    Swal.fire({
      title: "Êtes-vous sûr ?",
      html: `${this.duplicateReport.matriculesEnDoublon} matricule(s) en doublon seront nettoyés (l'enregistrement le plus ancien de chaque matricule est conservé, les autres seront <strong>définitivement supprimés</strong>).`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgba(29, 74, 123, 1)",
      cancelButtonColor: "#FF4D4F",
      confirmButtonText: "Confirmer la suppression",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.userService.removeDuplicateUtilisateursDeconected().subscribe({
          next: (response: any) => {
            this.spinner.hide();
            if (response?.success) {
              this.duplicateReport = response.data;
              this.duplicatesPage = 1;
              Swal.fire({
                icon: "success",
                html: `${response.data?.enregistrementsSupprimes ?? 0} doublon(s) supprimé(s).`,
                showConfirmButton: false,
                timer: 2000,
              });
              this.refreshData2();
            } else {
              this.userService.showSwal("error", response?.message);
            }
          },
          error: (error) => {
            this.spinner.hide();
            this.userService.showSwal(
              "error",
              error?.error?.message ??
                "Une erreur est survenue lors de la suppression des doublons.",
            );
          },
        });
      }
    });
  }
}
