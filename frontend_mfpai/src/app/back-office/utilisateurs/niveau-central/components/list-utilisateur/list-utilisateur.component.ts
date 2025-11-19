import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {UtilisateurService} from "../../../../../services/utilisateur.service";
import {CentralLevel, DeconectedDTO, Profil} from "../../../../../models/utilisateur";

import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {ResponseApi} from "../../../../../models/response-api";
import {NgxSpinnerService, Spinner} from "ngx-spinner";
import {ReferencesService} from "../../../../../services/references.service";
import {CredentialsService} from "../../../../../services/credentials.service";

interface SearchData {
    filter?: string,
    profile?: string ,
    matricule: string ,
    prenom: string ,
    nom: string ,
    direction: string,
}

@Component({
  selector: 'app-list-utilisateur',
  templateUrl: './list-utilisateur.component.html',
  styleUrls: ['./list-utilisateur.component.css']
})
export class ListUtilisateurComponent implements OnInit{
    isSearchResult = false;
    headers!: string[];
    page = 0;
    totalPages = 0;
    size = 10;
	pageSize = 10;
	userList: CentralLevel[] = [];
    collectionSize = this.userList.length;
    collapsed:boolean = false;
    text = '';
    closeResult = '';
    alertService: any;
    searchForm!: FormGroup ;
   // pageOptions: any = {page: 0, size: 10};
    pageOptions: any = {totalPages: 0, size: 10};
    filterValue: string = '';
    profils: Profil[]=[];
    direction: any;
    searchData! : SearchData
    profile: any;
    
    isSearchUser = false;
    speciality: any;

    advancedSearchForm!: FormGroup;
     region: any;
     grade: any;
     bureau: any;
     division: any;
     corpsGrade: any;
     userInfos:   any;


   constructor(
    private router: Router,
     private route: ActivatedRoute,
     public modalService: NgbModal = inject(NgbModal),
    private userService: UtilisateurService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private referenceService: ReferencesService,
    private credentialsService: CredentialsService

   ) { }
  
  ngOnInit(): void {
    // Initialize data and headers
    this.headers = ['Matricule','Prénom', 'Nom','Profil','Entités', 'Statut','Action'];
      this.userInfos = this.credentialsService.getUserInfos();
      this.refreshData()
      //this.listUtilisateur(this.pageOptions, this.filterValue);


     // this.listUtilisateurAdvanced(this.totalPages, this.size, "", "",  this.searchData?.matricule, this.searchData?.prenom, this.searchData?.nom, this.searchData?.direction);
     this.listUtilisateurCenPage(this.page, this.pageSize, "", "","", "","","", "", "", "", "", "", "", "", "");

      this.lookingSearchForm();
      this.initForm();



  }


  initForm() {

      this.searchForm = this.formBuilder.group({
          matricule: [''],
          prenom: [''],
          nom: [''],
          direction: [''],

      });

      this.referenceService.listProfilesCEN().subscribe(response => {

          if(response.success)
              this.profils = response.data;
      });

      this.referenceService.listDirections().subscribe(response => {

          if(response.success)
              this.direction = response.data;
      });

      this.referenceService.listSpeciality().subscribe(response => {
          if(response.success)
              this.speciality = response.data;
      });



      this.referenceService.listRegion().subscribe(response => {
          if(response.success)
              this.region = response.data;
      });

      this.referenceService.listDivisions().subscribe(response => {
          if(response.success)
              this.division = response.data;
      });



      this.referenceService.listcorpsGrade().subscribe(response => {
          if(response.success)
              this.corpsGrade = response.data;
      });
  }

    getProfileDivision(code: any): void {
       if(code){
           this.referenceService.listProfileDivision(code)
               .subscribe(response => {
                   if (response.success) {
                       this.profils = response.data;
                   }else {
                       this.referenceService.listProfilesCEN().subscribe(response => {
                           if(response.success)
                               this.profils = response.data;
                       });
                   }
               });
       }
    }


    getProfileDirection(code: any): void {
       if(code){
           this.referenceService.getProfileDirection(code)
               .subscribe(response => {
                   if (response.success) {
                       this.profils = response.data;
                   }
               });
       }
    }


    getProfileBureau(code: any): void {
       if(code) {
           switch (code) {
               case "BUAS":
               case  "ASDD":
               case  "BUGE":
               case  "BUPA":
               case  "BUSE":
               case   "BUCO" :
                   this.referenceService.listProfileBureau(code)
                       .subscribe(response => {
                           if (response.success) {
                               this.profils = response.data;
                           }
                       });
           }

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


    getGradeFromCorps(code: any) {
       if(code) {
           this.referenceService.listGradeByCode(code)
               .subscribe(response => {
                   if (response.success) {
                       this.grade = response.data;
                   }
               });
       }

    }








    openModalSearch(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size:'lg', centered: true }).result.then(
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
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}

  refreshData() {
      // this.listUtilisateurAdvanced(this.pageOptions, this.searchData);
      const  matricule  = this.searchData?.matricule !== undefined ? this.searchData?.matricule : '';
      const   prenom =  this.searchData?.prenom !== undefined ? this.searchData?.prenom : '';
      const   nom =  this.searchData?.nom !== undefined ? this.searchData?.nom : '';
      const    direction =   this.searchData?.direction !== undefined ? this.searchData?.direction : '';
      const    profile =   this.searchData?.profile !== undefined ? this.searchData?.profile : '';
      this.listUtilisateurAdvanced(this.totalPages, this.size, "", profile, matricule, prenom, nom, direction);

    // this.listUtilisateurAdvanced( this.totalPages, this.size, "", this.profile,  this.searchData.matricule, this.searchData.prenom, this.searchData.nom, this.searchData.direction);

  }


    getAllCentralUser( page: number,  size: number,  region: string,  direction: string,  division: string,
     bureau: string, corps: string,  grade: string,  matricule: string,  prenom: string,
     nom: string,  dateNaissance: string,  cn: string,  telephone: string,  email: string){

    }



   /* onSubmit() {
        console.log("searchTerm");
        // Handle the search logic here, e.g., send the search term to a service
        const searchTerm = this.searchForm?.get("searchTerm");

        console.log(searchTerm?.value);
        if (searchTerm != null){
            //console.log(searchTerm.value)
            this.listUtilisateurAdvanced(searchTerm.value)
        }
    }*/

  onCreateUser() {
    this.router.navigate(['create-utilisateur'], { relativeTo: this.route.parent })
  }
  onEditUser(user: any) {
    this.router.navigate([user.id, 'edit-utilisateur'], { relativeTo: this.route.parent })
  }

  onViewUser(user: any) {
    this.router.navigate([user.id, 'detail-utilisateur'], { relativeTo: this.route.parent })
  }

  changeStatus(user: any): void {
      Swal.fire({
          title: 'Êtes-vous sûr ?',
          text: "Vous ne pourrez pas revenir en arrière !",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'rgba(29, 74, 123, 1)',
          cancelButtonColor: '#FF4D4F',
          confirmButtonText: 'Confirmer',
          cancelButtonText: 'Annuler'
      }).then((result) => {

          this.userService.changeStatus(user?.id).subscribe({
              next: (response: ResponseApi) => {
                  if (result.isConfirmed) {
                      if(!user.status){
                          this.text = "Activé";
                          user.status = true
                      }else{
                          this.text = "Désactivé";
                          user.status = false
                      }
                      Swal.fire({
                          title: this.text,
                          text: `L'utilisateur ${user.prenom + ' ' + user.nom} a été ${this.text}.`,
                          icon: 'success',
                          timer: 1500,
                          showCancelButton: false,
                          showConfirmButton: false
                      })
                  }
              }
          })


      })

  }



    onResetfiltre() {
        this.isSearchResult = !this.isSearchResult;
        this.refreshData();
    }

   onSearch() {
       const  matricule  = this.searchData?.matricule !== undefined ? this.searchData?.matricule : '';
       const   prenom =  this.searchData?.prenom !== undefined ? this.searchData?.prenom : '';
       const   nom =  this.searchData?.nom !== undefined ? this.searchData?.nom : '';
       const    direction =   this.searchData?.direction !== undefined ? this.searchData?.direction : '';
       const    profile =   this.searchData?.profile !== undefined ? this.searchData?.profile : '';
       this.listUtilisateurAdvancedProfile(this.pageOptions?.totalPages, this.pageOptions?.size, this.filterValue, profile, matricule, prenom, nom, direction);

  }


    onSearchProfile() {
        const  matricule  = this.searchData?.matricule !== undefined ? this.searchData?.matricule : '';
            const   prenom =  this.searchData?.prenom !== undefined ? this.searchData?.prenom : '';
        const   nom =  this.searchData?.nom !== undefined ? this.searchData?.nom : '';
            const    direction =   this.searchData?.direction !== undefined ? this.searchData?.direction : '';
        this.listUtilisateurAdvancedProfile(this.pageOptions?.totalPages, this.pageOptions?.size, "", this.profile, matricule, prenom, nom, direction);
    }

  onAdvancedSearch() {

      const   matricule =  this.searchForm.controls['matricule'].value ;
      const    prenom =  this.searchForm.controls['prenom'].value ;
      const    nom =   this.searchForm.controls['nom'].value ;
      const    direction =  this.searchForm.controls['direction'].value ;

      this.listUtilisateurAdvancedProfile(this.page, this.size, "", "",  matricule, prenom, nom, direction);

      this.modalService.dismissAll();
      this.isSearchResult = true;
  }

    listUtilisateurAdvancedProfile(page: number, size: number, filter: string, profile: string,   matricule: string, prenom: string, nom: string, direction: string): void {
        this.spinner.show()
        this.userService.listUtilisateurCentralAdvanced( page -1, size, filter,
            profile, matricule, prenom, nom, direction
        ).subscribe(data => {
            if (data?.status === 'OK') {
                this.userList = data?.payload;
                this.spinner.hide();
                this.collectionSize = data.metadata?.totalElements ?? 0
                this.pageSize = data.metadata?.size ?? 0
            } else {
                this.alertService.showAlert({status: data?.status, message: data?.message, titre: 'Utilisateurs'});
            }
        });
    }


    refreshData2() {
      this.listUtilisateurCenPagening();
    }

    refreshData1(event: any) {
        const  matricule  = this.searchData?.matricule !== undefined ? this.searchData?.matricule : '';
        const   prenom =  this.searchData?.prenom !== undefined ? this.searchData?.prenom : '';
        const   nom =  this.searchData?.nom !== undefined ? this.searchData?.nom : '';
        const    direction =   this.searchData?.direction !== undefined ? this.searchData?.direction : '';
        const    profile =   this.searchData?.profile !== undefined ? this.searchData?.profile : '';

       this.totalPages = +event.target['text']-1;
        if (event.target['text'] != undefined && event.target['text'] != "««" && event.target['text'] != "«" && event.target['text'] != "»" && event.target['text'] != "»»"){
            this.listUtilisateurAdvanced( this.totalPages, this.size, "", profile, matricule, prenom, nom, direction);
        }

    }

    listUtilisateurAdvanced( page: number, size: number, filter: string, profile: string,   matricule: string, prenom: string, nom: string, direction: string): void {
        this.spinner.show()
        matricule  = matricule !== undefined ? matricule : '';
        prenom = prenom !== undefined ? prenom : '';
        nom =  nom !== undefined ? nom : '';
        direction =   direction !== undefined ? direction : '';
        profile =   profile !== undefined ? profile : '';

        this.userService.listUtilisateurCentralAdvanced(page, size, filter, profile, matricule, prenom, nom, direction)
            .subscribe(data => {

            if (data?.status === 'OK') {
                this.userList = data?.payload
                this.spinner.hide();
                this.collectionSize = data.metadata?.totalElements ?? 0
                this.size = data.metadata?.size ?? 0
            } else {
                this.alertService.showAlert({status: data?.status, message: data?.message, titre: 'Utilisateurs'});
            }
        });
    }


    listUtilisateurCenPage(page: number,  size: number,  region: string,  direction: string,  division: string,
                           bureau: string,specialite: string, corps: string,  grade: string,  matricule: string,  prenom: string,
                           nom: string,  dateNaissance: string,  cni: string,  telephone: string,  email: string){

           this.userService.getAllCentralUser(page,  size,  region,  direction,  division,
            bureau,specialite, corps,  grade,  matricule,  prenom, nom,  dateNaissance,  cni,  telephone,  email)
               .subscribe(data => {
                   if (data?.status === 'OK') {
                       this.userList = data?.payload;
                       this.spinner.hide();
                       this.collectionSize = data.metadata?.totalElements ?? 0
                       this.size = data.metadata?.size ?? 0
                   } else {
                       this.alertService.showAlert({status: data?.status, message: data?.message, titre: 'Utilisateurs'});
                   }
               });

    }

    listUtilisateurCenPagening(){
      this.spinner.show();
        this.userService.getAllCentralUser(this.page,  this.pageSize,  "",  "",  "",
            "","", "",  "",  "",  "", "",  "",  "",  "",  "")
            .subscribe(data => {
                if (data?.status === 'OK') {
                    //  console.log(data?.payload);
                    this.userList = data?.payload;
                    this.spinner.hide();
                    this.collectionSize = data.metadata?.totalElements ?? 0
                    this.size = data.metadata?.size ?? 0
                } else {
                    this.alertService.showAlert({status: data?.status, message: data?.message, titre: 'Utilisateurs'});
                }
            });

    }

    onSearchUser(){
       // console.log( this.advancedSearchForm.value)
        this.listUtilisateurCenPage(0, 10,
            this.advancedSearchForm.value['region'],
            this.advancedSearchForm.value['direction'],
            this.advancedSearchForm.value['division'],
            this.advancedSearchForm.value['bureau'],
            this.advancedSearchForm.value['specialite'],
            this.advancedSearchForm.value['corps'],
            this.advancedSearchForm.value['grade'],
            this.advancedSearchForm.value['matricule'],
            this.advancedSearchForm.value['prenom'],
            this.advancedSearchForm.value['nom'],
            this.advancedSearchForm.value['dateNaissance'],
            this.advancedSearchForm.value['cni'],
            this.advancedSearchForm.value['telephone'],
            this.advancedSearchForm.value['email']
        )
        this.isSearchUser = !this.isSearchUser;
        this.closeModal();
    }


    lookingSearchForm(){
        this.advancedSearchForm = this.formBuilder.group({
            region:  ['', Validators.required],
            direction:  ['', Validators.required],
            division:  [''],
            bureau:  [''],
            specialite:  [''],
            matricule:  [''],
            corps:  [''],
            grade:  [''],
            prenom: [''] ,
            nom: [''],
            dateNaissance: [''],
            cni: [''],
            telephone:  [''],
            email:  ['']
        });
    }

    closeModal() {
        this.modalService.dismissAll();
    }


    onAdvancedSearchForm() {
       // console.log(this.advancedSearchForm.value['corps'])
       this.listUtilisateurCenPage(0, 10,
            this.advancedSearchForm.value['region'],
            this.advancedSearchForm.value['direction'],
            this.advancedSearchForm.value['division'],
            this.advancedSearchForm.value['bureau'],
            this.advancedSearchForm.value['specialite'],
            this.advancedSearchForm.value['corps'],
            this.advancedSearchForm.value['grade'],
            this.advancedSearchForm.value['matricule'],
            this.advancedSearchForm.value['prenom'],
            this.advancedSearchForm.value['nom'],
            this.advancedSearchForm.value['dateNaissance'],
            this.advancedSearchForm.value['cni'],
            this.advancedSearchForm.value['telephone'],
            this.advancedSearchForm.value['email']
       )

        this.closeModal();
    }

    onCancel() {
        this.isSearchUser = !this.isSearchUser;
    }
}

