import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserToken } from 'src/app/models/auth-response';
import { CredentialsService } from 'src/app/services/credentials.service';
import { jwtDecode } from 'jwt-decode';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { FormationService } from 'src/app/services/formation.service';

@Component({
  selector: 'app-list-formation',
  templateUrl: './list-formation.component.html',
  styleUrls: ['./list-formation.component.css']
})
export class ListFormationComponent implements OnInit {

  headers: string[]  = ['Thèmes', 'Titre de la formation', 'Direction Responsable', 'Cibles','Date Début','Date Fin','Statut', 'Action'];
  headersDiplomante: string[]  = ['Titre de la formation', "Etablissement", 'Date Début','Date Fin','Statut', 'Action'];
  page = 1;
  pageSize = 10;
  isPv: boolean = false;
  //DATA = []=[];
  demandeList: any= [];
  demandeListDiplomante: any= [];
  demandeListContinue: any= [];
  pjPVExamen: any[] = [];
  collectionSize = this.demandeList.length;
 
  collapsed: boolean = false;
  text = '';
  closeResult = '';
  tabIndex = 0;

  userInfos: any;
  user: any;
  pvStatusMap: { [key: number]: boolean } = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public modalService: NgbModal = inject(NgbModal),
    private readonly _credentialService: CredentialsService,
    private userService: UtilisateurService,
    private formationService: FormationService
  ) { 

    this.userInfos = this._credentialService.getUserInfos();
    if (this.userInfos)
      this.userInfos.id
    console.log(this.userInfos);
  }

  ngOnInit(): void {
    this.isPvExamen();
    console.log(this.isPvExamen());
    this.getFormation();
    //this.refreshData();
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

  // viewOffers(data: any) {
  //   this.router.navigate(['formations/liste-des-formations/']);
  // }

  async checkPvExamen(formationId: number): Promise<boolean> {
    try {
      const response = await this.formationService.getPvExamenByFormation(formationId).toPromise();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  isPvExamen() : any{
  
    this.formationService.getPvExamenByFormation(6).subscribe((response)=>{
      console.log(response.success);
      console.log(response.success);
        console.log(response.data);
        console.log(response);
        if(response.success==true){
          //this.isPv=response.success;
          //this.pjPVExamen=response.data;
          return true;
          
        }else {
          return false;
        }
        
        
    }, 
    (error) => {
      
      console.log(error);
      console.log(error.status);
      return false;

    }
    
    
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
    this.demandeList = this.demandeList.map((user: any, i: any) => ({ id: i + 1, ...user })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }

  getColor(code: string){
   var color ="";

    if(code="PUBLIE"){
      color = 'rgba(29, 74, 123, 1)';
    }

    if(code="CLOTURE"){
      color = 'rgba(255, 77, 79, 1)';
    }

    if(code="NONDEMARREE"){
      color ='rgba(255, 255, 255, 1)';
    }

    if(code="ENCOURS"){
      color = 'rgba(247, 144, 9, 1)';
    }

    return color;
    
  }

  getFormation(){

    this.userService.getOneUser(this.userInfos.id).subscribe({
      next: (response) => {
       console.log(response)
        this.user = response;
        if(this.user.data.etablissement){
          console.log(this.user.data.etablissement.code);
        }

    this.http.get(environment.apiUrl+"api/formations", {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {
        console.log(response);
        //this.demandeList=response;
        this.demandeList = response.sort((a: any, b: any) => {
          return b.id - a.id;
        });

        if(this.demandeList.length>0){
          for(var i=0;i<this.demandeList.length;i++){
            if(this.demandeList[i]?.typeFormation.code==="DIPLOMANTE"){
              this.demandeListDiplomante.push(this.demandeList[i]);
            }else{
              this.demandeListContinue.push(this.demandeList[i]);
            }
          }
        }

        this.demandeListDiplomante.forEach((demande:any) => {
          this.checkPvExamen(demande.id).then(result => {
            this.pvStatusMap[demande.id] = result;
          });
        });


        console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
        //console.log(this.getThemeFormation(response[0].themeFormationId));
        //console.log(this.getThemeFormation(response[0].themeFormationId));
      },
      (error) => console.log(error)
    )

  }
})

  }

  deleteFormation(idForm:number){

    this.http.get(environment.apiUrl+"api/rapports/by-formation/"+idForm, {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response00:any) => {
        console.log(response00);

        this.http.delete(environment.apiUrl+"api/rapports/"+response00.id, {headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
        }}).subscribe(
          (response:any) => {


            //rechercher participant selon l'id de la formation
    this.http.get(environment.apiUrl+"api/participants/formation/"+idForm, {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response0:any) => {
        console.log(response0.id);
                //supprimer participant
            this.http.delete(environment.apiUrl+"api/participants/"+response0.id, {headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
        }}).subscribe(
          (response:any) => {
            //console.log(response);

                this.http.get(environment.apiUrl+"api/convocations/"+idForm, {headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
        }}).subscribe(
          (response1:any) => {
            console.log(response1.data.id);


        this.http.delete(environment.apiUrl+"api/convocations/"+response1.data.id, {headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
        }}).subscribe(
          (response:any) => {
            //console.log(response);
            this.http.delete(environment.apiUrl+"api/formations/"+idForm, {headers: {
              'content-type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("Token")}`
            }}).subscribe(
              (response:any) => {
                //console.log(response);
                Swal.fire({
                  html: `La formation a été supprimée.`,
                  icon: 'success',
                  timer: 1500,
                  showCancelButton: false,
                  showConfirmButton: false
                })
                window.location.reload();
                //this.demandeList=response;
                console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
                //console.log(this.getThemeFormation(response[0].themeFormationId));
                //console.log(this.getThemeFormation(response[0].themeFormationId));
              },
              (error) => console.log(error)
            )
    
          },
          (error) => console.log(error)
        )

      },
      (error) => console.log(error)
    )

  },
  (error) => console.log(error)
)
        
      },
      (error) => console.log(error)
    )
           



          },
          (error) => console.log(error)
        )

      },
      (error) => console.log(error)
    )




    

    
  }

  

  // getThemeFormation(id: number){
  //   const theme = "";
  //   this.http.get(environment.apiUrl+"themeformations/"+id, {headers: {
  //     'content-type': 'application/json',
  //     'Authorization': `Bearer ${localStorage.getItem("Token")}`
  //   }}).subscribe(
  //     (response:any) => {
  //       console.log(response);
  //       console.log(response.libelle);
  //       theme==response.libelle;
  //       console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
        
  //     },
  //     (error) => console.log(error)
  //   )

  //   return theme;

  // }

  onViewFormation(data: any) {
    this.router.navigate([data.reference, 'detail-view'], { relativeTo: this.route.parent });
  }

  // onViewFormation(data: any) {
  //   //this.router.navigateByUrl('formations/liste-des-formations/${data.id}detail-view');
  //   this.router.navigateByUrl(`formations/liste-des-formations/${data.id}/detail-view`);
  // }

  onCompleteFormation(data: any) {
    this.router.navigateByUrl(`formations/liste-des-formations/${data.id}/complete-formation`);
    //this.router.navigate([data.id, 'complete-formation'], { relativeTo: this.route.parent });
    //sessionStorage.setItem("actionClick", 'CompletedFormation');
  }

  onEditFormation(data: any) {
    //this.router.navigate([data.id, 'edit-formation'], { relativeTo: this.route.parent });
    this.router.navigateByUrl(`formations/liste-des-formations/${data.id}/edit-formation`);
  }
  
  onCloturerFormation(idFormation: any): void {
    Swal.fire({
      text: "Voulez-vous clôturer cette formation ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgba(29, 74, 123, 1)',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        

        this.http.put(environment.apiUrl + "api/formations/"+idFormation+"/update-status?newStatutFormationCode=CLOTUREER", httpOptions)
        .subscribe(
            (response: any) => {

                console.log(response);
                Swal.fire({
          html: `La formation a été clôturée.`,
          icon: 'success',
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false
        });

        window.location.reload();
                //this.stepper.next();
               
            },
            (error) => {
               // console.log(error);
               // console.log(error["error"]["errors"]);
                Swal.fire({
                    title: error["error"]["errors"],
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: 'rgba(29, 74, 123, 1)',
                    cancelButtonColor: '#FF4D4F',
                    confirmButtonText: 'Oui',
                    cancelButtonText: 'Non'
                }).then((result) => {
                    if (result.isConfirmed) {



                    }
                })
            }
        );

      }
    })

    const httpOptions = {
      headers: new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
      })
  };

    
  }

  getCibles(profils: any){
  
    let labelsString = "";
profils.forEach((profil:any, index:any) => {
    // Ajoutez le label du profil actuel à la chaîne de caractères
    labelsString += profil.label;

    // Ajoutez une virgule si ce n'est pas le dernier élément du tableau
    if (index < profils.length - 1) {
        labelsString += ", ";
    }
});
//console.log(labelsString);

return labelsString;
    
  }

  onDemarrerFormation(idFormation: any): void {
    Swal.fire({
      text: "Voulez-vous démarrer cette formation ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgba(29, 74, 123, 1)',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {

        this.http.put(environment.apiUrl + "api/formations/"+idFormation+"/update-status?newStatutFormationCode=ENCOURS", httpOptions)
        .subscribe(
            (response: any) => {

                console.log(response);
                Swal.fire({
          html: `La formation a été démarrée.`,
          icon: 'success',
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false
        });

        window.location.reload();
                //this.stepper.next();
               
            },
            (error) => {
               // console.log(error);
               // console.log(error["error"]["errors"]);
                Swal.fire({
                    title: error["error"]["errors"],
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: 'rgba(29, 74, 123, 1)',
                    cancelButtonColor: '#FF4D4F',
                    confirmButtonText: 'Oui',
                    cancelButtonText: 'Non'
                }).then((result) => {
                    if (result.isConfirmed) {


                    }
                })
            }
        );

      }
    })

    const httpOptions = {
      headers: new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
      })
  };

  }


   onDeleteFormation(data: any): void {
    Swal.fire({
      text: "Voulez-vous supprimer cette formation ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgba(29, 74, 123, 1)',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(environment.apiUrl+"api/formations/"+data.id, {headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
        }}).subscribe(
          (response:any) => {
            console.log(response);
            Swal.fire({
              html: `La formation <b>(N° Réference)</b> du <b>${data.dateDebut}<b/> au <b>${data.dateFin}<b/> a été supprimée.`,
              icon: 'success',
              timer: 1500,
              showCancelButton: false,
              showConfirmButton: false
            })
            //this.demandeList=response;
            console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
            //console.log(this.getThemeFormation(response[0].themeFormationId));
            //console.log(this.getThemeFormation(response[0].themeFormationId));
          },
          (error) => console.log(error)
        )
        
      }
    })
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onSearch() {
    console.log('Result');
    this.closeModal();
  }

  onTabChange(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
  }

  onCreateFormationDiplomante(){
    this.router.navigateByUrl(`formations/liste-des-formations/create-formation-diplomante`);
    sessionStorage.setItem("actionClick", 'CreatedFormationDiplomante');
  }

  sendOffersTechniques(data: any) {
    this.router.navigate([data.reference, 'envoyer-offres-techniques'], { relativeTo: this.route.parent })
  }

  sendFicheCanditature(data: any) {
    this.router.navigate([data.reference, 'envoyer-fiche-canditature'], { relativeTo: this.route.parent })
  }

  viewOffers(data: any) {
    this.router.navigate([data.id, 'offres'], { relativeTo: this.route.parent })
  }

  onViewDemandeFormation(data: any) {
    this.router.navigate([data.id, 'demandes-de-formation'], { relativeTo: this.route.parent });
  }

  onViewSuivFormation(data: any) {
    this.router.navigate(['tableau-suivi-formations', data.id], { relativeTo: this.route.parent });
  }
}
// const DATA: any[] = [
//   {
//     theme: 'Thème 1',
//     typeFormation: 'Continue',
//     titreFormation:'Lorem ipsum',
//     directionResponsable: 'Lorem ipsum',
//     cibles:['Cible 1','Cible 2','Cible 3','Cible 4'],
//     dateDebut:'01-01-2024',
//     dateFin: '01-06-2024',
//     status:'PUBLIEER'
//   },
//   {
//     theme: 'Thème 2',
//     typeFormation: 'Diplômante',
//     titreFormation:'Lorem ipsum',
//     directionResponsable: 'Lorem ipsum',
//      cibles:['Cible 1','Cible 2'],
//     dateDebut:'01-01-2024',
//     dateFin: '01-06-2024',
//     status:'NONDEMARREER'
//   },
//   {
//     theme: 'Thème x',
//     typeFormation: 'Continue',
//     titreFormation:'Lorem ipsum',
//     directionResponsable: 'Lorem ipsum',
//      cibles:['Cible 1','Cible 2'],
//     dateDebut:'01-01-2024',
//     dateFin: '01-06-2024',
//      status:'ENCOURS'
//   },
//   {
//     theme: 'Thème 1',
//     typeFormation: 'Diplômante',
//     titreFormation:'Lorem ipsum',
//     directionResponsable: 'Lorem ipsum',
//      cibles:['Cible 1'],
//     dateDebut:'01-01-2024',
//     dateFin: '01-06-2024',
//      status:'CLOTUREER'
//   },
//   {
//     theme: 'Thème 1',
//     typeFormation: 'Continue',
//     titreFormation:'Lorem ipsum',
//     directionResponsable: 'Lorem ipsum',
//     cibles:['Cible 1'],
//     dateDebut:'01-01-2024',
//     dateFin: '01-06-2024',
//      status:'ENCOURS'
//   },
//   {
//     theme: 'Thème 1',
//     typeFormation: 'Diplômante',
//     titreFormation:'Lorem ipsum',
//     directionResponsable: 'Lorem ipsum',
//     cibles:['Cible 1'],
//     dateDebut:'01-01-2024',
//     dateFin: '01-06-2024',
//      status:'CLOTUREER'
//   },
//   {
//     theme: 'Thème 1',
//     typeFormation: 'Continue',
//     titreFormation:'Lorem ipsum',
//     directionResponsable: 'Lorem ipsum',
//     cibles:['Cible 1'],
//     dateDebut:'01-01-2024',
//     dateFin: '01-06-2024',
//      status:'CLOTUREER'
//   },
//   {
//     theme: 'Thème 1',
//     typeFormation: 'Diplômante',
//     titreFormation:'Lorem ipsum',
//     directionResponsable: 'Lorem ipsum',
//     cibles:['Cible 1'],
//     dateDebut:'01-01-2024',
//     dateFin: '01-06-2024',
//      status:'CLOTUREER'
//   }
// ]

