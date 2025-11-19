import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { CredentialsService } from 'src/app/services/credentials.service';
import { FormationService } from "../../../../../services/formation.service";
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { Console } from 'console';
import {NgxSpinnerService} from "ngx-spinner";


@Component({
  selector: 'app-list-mes-formations',
  templateUrl: './list-mes-formations.component.html',
  styleUrls: ['./list-mes-formations.component.css']
})
export class ListMesFormationsComponent implements OnInit {

  headers: string[] = ['N° Référence', 'Type formation', 'Titre de la formation', 'Direction/Etablissement', 'Date Début', 'Date Fin', 'Action'];
  pageSize = 10;
  page = 0;
  totalPages = 0;
  size = 10;
  collectionSize = DATA.length;
  formationList!: any;
  formations_filtrees: any[] = [];
  formations_filtrees_continue: any[] = [];
  formations_filtrees_diplomante: any[] = [];
  formations_participees!: any;
  formationsCloturees!: any;
  formations_diplomante: any[] = [];
  formations_continue: any[] = [];
  collapsed: boolean = false;
  tabTitle = 'Liste de mes formations à venir';
  tabIndex = 0;
  closeResult = '';
  userInfos: any;
  user: any;
  isInTopN: boolean | undefined;
  formations: any;

  constructor(
    private location: Location,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private readonly _credentialService: CredentialsService,
    public modalService: NgbModal = inject(NgbModal),
    private formationService: FormationService,
    private userService: UtilisateurService
  ) {

    this.formations_filtrees = [];

    this.userInfos = this._credentialService.getUserInfos();
    if (this.userInfos)
      this.userInfos.id
  }

  ngOnInit(): void {

    //this.checkUserPriority(10);

   // console.log(this.userInfos);
    this.getCurrentUser();
    //this.getCurrentUser();
    this.getFormations(this.page, this.pageSize, "");
    this.refreshData();
    // this.getFormation();
 /*   this.checkIfUserIsInTopN(10).then(data => {
      console.log('User is in top N:', data);
    }).catch(error => {
      console.error('Error fetching top N status:', error);
    });

  */
  }

  IsPrioritaire(n:number){
    this.checkIfUserIsInTopN(n).then(data => {
      console.log('User is in top N:', data);
      return data;
    }).catch(error => {
      console.error('Error fetching top N status:', error);
      return false;
    });
  }

  // checkIfUserIsInTopN(n: number): void {
  //   this.userService.isCurrentUserInTopN(n).subscribe(
  //     (response: any) => {
  //       this.isInTopN = response.data;
  //       console.log('Is current user in top N:', this.isInTopN);
  //     },
  //     (error) => {
  //       console.error('Error checking user top N status:', error);
  //     }
  //   );
  // }
  
  // checkIfUserIsInTopN(n: number) {
  //     this.userService.isCurrentUserInTopN(n).subscribe(
  //       (response: any) => {
  //         console.log(response.data);
          
  //       },
  //       (error) => {
  //         console.error('Error checking user top N status:', error);
  //       }
      
  //     );
  // }

  checkIfUserIsInTopN(n: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userService.isCurrentUserInTopN(n).subscribe(
        (response: any) => {
          console.log(response.data); // Garde ce log si tu veux afficher la réponse à chaque appel
          resolve(response.data);
        },
        (error) => {
          console.error('Error checking user top N status:', error);
          reject(error);
        }
      );
    });
  }

  openModalSearch(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }


  getCurrentUser() {
    this.userService.getOneUser(this.userInfos.id).subscribe({
      next: (response) => {
     //  console.log(response)
        this.user = response;
      //  console.log(this.user.data.matricule);
        this.getFormationParticipee();
      }
    })
  }

  getFormationParticipee(): void {
  //  console.log(this.user.data.matricule);
    let apiUrl = environment.apiUrl + "api/participant-definitif/byMatricule";
    const params = new HttpParams().set('matricule', this.user.data.matricule);
    this.http.get<any>(apiUrl, { params })
      .subscribe(
        (data: any) => {
       //   console.log(data);
          this.formations_participees=data;
       this.formationsCloturees = this.formations_participees.filter((participant:any) => 
        participant?.formation?.statutFormation?.code === 'CLOTUREER'
      );
        },
        (error) => {
          console.error('Error fetching participants', error);
        }
      );
  }

  // getFormationParticipee(){

  //   let encodedMatricule = encodeURIComponent(this.user.data.matricule);

  //   this.formationService.getFormationParticipeeByMatricule(encodedMatricule).subscribe({
  //     next: (response) => {
  //      console.log(response)
  //      this.formations_participees=response;
  //      this.formationsCloturees = this.formations_participees.filter((participant:any) => 
  //       participant?.formation?.statutFormation?.code === 'CLOTUREER'
  //     );
  //     console.log(this.formationsCloturees);
  //     }
  //   })

  // }


  // checkUserPriority(n:number): void {
  //   this.userService.isCurrentUserInTopN(n).subscribe(
  //     (result: any) => {
  //       console.log(result);
  //       //return result;
  //     },
  //     (error: any) => {
  //       console.error('Erreur lors de la vérification de la priorité:', error);
  //     }
  //   );
  // }

  getFormationsPaging(): void {
    this.spinner.show()

    this.formationService.getMesFormations(this.page, this.pageSize, "").subscribe({
      next:  (response) => {


        if (response?.status === 'OK') {
          this.formations = response?.payload;
          this.spinner.hide();

          console.log( this.formations)

          this.collectionSize = response.metadata?.totalElements ?? 0
          this.pageSize = response.metadata?.size ?? 0
        }

      }
    })
  }
   getFormations( page: number, size: number, filter: string) {
     this.spinner.show()

    this.formationService.getMesFormations(page, size, filter).subscribe({
      next:  (response) => {


        if (response?.status === 'OK') {
          this.formations = response?.payload;
          this.spinner.hide();

          console.log( this.formations)

          this.collectionSize = response.metadata?.totalElements ?? 0
          this.pageSize = response.metadata?.size ?? 0
        }

      }
    })

   /* this.userService.getOneUser(this.userInfos.id).subscribe({
      next: (response) => {
       console.log(response)
        this.user = response;
        if(this.user.data.etablissement){
          console.log(this.user.data.etablissement.code);
        }
        


      }
    })

    */
    
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
    this.getFormations(this.totalPages, this.size, "");
  }

  refreshData1(event: any) {
    this.totalPages = +event.target['text'] - 1;
    // if (event.target['text'] != undefined && event.target['text'] != "« «" && event.target['text'] != "«" && event.target['text'] != "»" && event.target['text'] != "» »") {
    if (event.target['text'] != undefined ) {
      this.getFormations(+event.target['text']-1, this.size!, "");
    }

  }


  refreshData2() {

      this.getFormations(this.totalPages, this.size, "");
  }


  onViewDetailFormation(data: any) {
    this.router.navigate([data.reference, 'detail-view'], { relativeTo: this.route.parent })
  }

  onTabChange(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
    this.tabIndex == 0 ?
      this.tabTitle = 'Liste de mes formations à venir' :
      this.tabTitle = 'Liste de mes formations participées';
  }

  onParticipe(data: any) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous participer à cette formation ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui, je confirme',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        const randomNumber = Math.floor(Math.random() * 90000) + 10000;

        const httpOptions = {
          headers: new HttpHeaders({
            'content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("Token")}`
          })
        };

        this.http.post(environment.apiUrl + "api/participations/add",

          {
            "numeroDemande": "DF" + randomNumber,
            "formationId": data.id,
            "centralLevelId": this.userInfos.id
          }
          , httpOptions)
          .subscribe(
            (response: any) => {
           //   console.log(response);
              //console.log(response);
              // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
              Swal.fire({ 
                html: 'Votre demande de participation à la formation <b>(Type formation)</b> a été envoyée.',
                icon: 'success',
                timer: 1500,
                showCancelButton: false,
                showConfirmButton: false
              })
              //this.router.navigate(['formations/plan-formation']);
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
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onSearch() {
    console.log('Result');
    this.closeModal();
  }

  // sendOffersTechniques(data: any) {
  //   this.router.navigate([data.reference, 'envoyer-offres-techniques'], { relativeTo: this.route.parent })
  // }

  // sendFicheCanditature(data: any) {
  //   this.router.navigate([data.reference, 'envoyer-fiche-canditature'], { relativeTo: this.route.parent })
  // }

  // viewOffers(data: any) {
  //   this.router.navigate([data.id, 'offres'], { relativeTo: this.route.parent })
  // }

  sendOffersTechniques(formation: any) {
    
  }

  viewOffers(formation: any) {
    
  }

  sendFicheCanditature(formation: any) {
    
  }



}

const DATA: any[] = [
  {
    reference: 'ref003',
    typeFormation: 'Continue',
    titreFormation: 'Lorem ipsum',
    directionResponsable: 'Lorem ipsum',
    dateDebut: '01-01-2024',
    dateFin: '01-06-2024'
  },
  {
    reference: 'ref003',
    typeFormation: 'Diplômante',
    titreFormation: 'Lorem ipsum',
    directionResponsable: 'Lorem ipsum',
    dateDebut: '01-01-2024',
    dateFin: '01-06-2024'
  },
  {
    reference: 'ref003',
    typeFormation: 'Continue',
    titreFormation: 'Lorem ipsum',
    directionResponsable: 'Lorem ipsum',
    dateDebut: '01-01-2024',
    dateFin: '01-06-2024'
  },
  {
    reference: 'ref003',
    typeFormation: 'Diplômante',
    titreFormation: 'Lorem ipsum',
    directionResponsable: 'Lorem ipsum',
    dateDebut: '01-01-2024',
    dateFin: '01-06-2024'
  },
  {
    reference: 'ref003',
    typeFormation: 'Continue',
    titreFormation: 'Lorem ipsum',
    directionResponsable: 'Lorem ipsum',
    dateDebut: '01-01-2024',
    dateFin: '01-06-2024'
  },
  {
    reference: 'ref003',
    typeFormation: 'Diplômante',
    titreFormation: 'Lorem ipsum',
    directionResponsable: 'Lorem ipsum',
    dateDebut: '01-01-2024',
    dateFin: '01-06-2024'
  },
  {
    reference: 'ref003',
    typeFormation: 'Continue',
    titreFormation: 'Lorem ipsum',
    directionResponsable: 'Lorem ipsum',
    dateDebut: '01-01-2024',
    dateFin: '01-06-2024'
  },
  {
    reference: 'ref003',
    typeFormation: 'Diplômante',
    titreFormation: 'Lorem ipsum',
    directionResponsable: 'Lorem ipsum',
    dateDebut: '01-01-2024',
    dateFin: '01-06-2024'
  }
]
