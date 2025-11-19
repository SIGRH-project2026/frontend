import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CredentialsService } from 'src/app/services/credentials.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'
 
@Component({
  selector: 'app-offres',
  templateUrl: './offres.component.html',
  styleUrls: ['./offres.component.css']
})
export class OffresComponent implements OnInit {
 
  headers: string[]  = ['N° Référence','Matricule', 'Chef EFF','EFF', 'Thème','Intitulé de la formation','Statut', 'Action'];
  page = 1;
  pageSize = 10;
  collectionSize = DATA.length;
  demandeList!: any[];
  collapsed: boolean = false;
  text = '';
  closeResult = '';
  reference="";
  debut="";
  fin="";
  duree="";
  FormationId: any;
  status: string="";
  formation: any;
  offres!: any[];
  formId: any;
  userInfos: any;
  

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public modalService: NgbModal = inject(NgbModal),
    private readonly _credentialService: CredentialsService
  ) { 
    this.route.params.subscribe(params => {
      this.FormationId = parseInt(params['dataId']);
    });

    this.userInfos = this._credentialService.getUserInfos();
    if (this.userInfos)
      this.userInfos.id
  }
 
   ngOnInit() {
    this.http.get(environment.apiUrl+"api/formations/"+this.FormationId, {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {
        console.log(response);
        this.formation=response;
        this.formId=response.id;
        this.http.get(environment.apiUrl+"api/offreTechniqueFinanciere/by-formation/"+this.FormationId, {headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
        }}).subscribe(
          (response:any) => {

            console.log({response : response});
            console.log(response);
            this.offres=response;
            
            console.log("mmmmmmmmmmmmmmmmmmmmmmmmmm");
            //console.log(this.getThemeFormation(response[0].themeFormationId));
            //console.log(this.getThemeFormation(response[0].themeFormationId));
          },
          (error) => console.log(error)
        )
      },
      (error) => console.log(error)
    )
    this.refreshData();
  }
 
  goBack(){

  }
  
  getFormation(){
    this.http.get(environment.apiUrl+"api/offreTechniqueFinanciere/by-formation/"+this.FormationId, {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {
        console.log({response : response});
       this.offres=response;
        
        console.log("mmmmmmmmmmmmmmmmmmmmmmmmmm");
        //console.log(this.getThemeFormation(response[0].themeFormationId));
        //console.log(this.getThemeFormation(response[0].themeFormationId));
      },
      (error) => console.log(error)
    )
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
 
  refreshData() {
    this.demandeList = this.offres?.map((user: any, i: any) => ({ id: i + 1, ...user })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }

  downloadFiles(files: any[]): void {
    files.forEach(file => {
      const filename = file.generatedName;
      this.http.get(environment.apiUrl + "files/download?filename=" + filename, {
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
        },
        responseType: 'blob' // traiter la réponse comme un blob
      }).subscribe(
        (response: Blob) => {
          const blobUrl = URL.createObjectURL(response);
          const anchor = document.createElement('a');
          anchor.style.display = 'none';
          document.body.appendChild(anchor);
          anchor.href = blobUrl;
          anchor.download = filename;
          anchor.click();
          document.body.removeChild(anchor);
          URL.revokeObjectURL(blobUrl);
        },
        (error) => console.log(error)
      );
    });
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
 
  // refreshData() {
  //   this.demandeList = this.offres.map((user: any, i: any) => ({ id: i + 1, ...user })).slice(
  //     (this.page - 1) * this.pageSize,
  //     (this.page - 1) * this.pageSize + this.pageSize,
  //   );
  // }
 
 
  closeModal() {
    this.modalService.dismissAll();
  }
 
  onSearch() {
    console.log('Result');
    this.closeModal();
  }
  onApprouver(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem("Token")}`
      })
  };
 
    Swal.fire({
      title: 'Confirmation',
      text: 'Souhaitez-vous approuver cet offre ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
       
        this.http.put(environment.apiUrl + "api/offreTechniqueFinanciere/"+data.id+"/update-status?newStatutOffreCode=APPROUVEER", httpOptions)
        .subscribe(
            (response: any) => {
 
                console.log(response);
                Swal.fire({
          html: `L'offre a été approuvée.`,
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
    });
   }

}
const DATA: any[] = [
  {
    num_reference: 1093,
    chefEFF: {
      prenom:'Lorem',
      nom:'Ipsum',
      matricule:'mat001'
    },
    eff:'Lorem ipsum',
    theme:'Lorem ipsum',
    intituleFormation:'Lorem ipsum',
    status:'SOUMIS'
  },
    {
    num_reference: 1093,
    chefEFF: {
      prenom:'Lorem',
      nom:'Ipsum',
      matricule:'mat002'
    },
    eff:'Lorem ipsum',
    theme:'Lorem ipsum',
    intituleFormation:'Lorem ipsum',
    status:'APPROUVER'
  },
 {
    num_reference: 1093,
    chefEFF: {
      prenom:'Lorem',
      nom:'Ipsum',
      matricule:'mat001'
    },
    eff:'Lorem ipsum',
    theme:'Lorem ipsum',
    intituleFormation:'Lorem ipsum',
    status:'SOUMIS'
  },
    {
    num_reference: 1093,
    chefEFF: {
      prenom:'Lorem',
      nom:'Ipsum',
      matricule:'mat002'
    },
    eff:'Lorem ipsum',
    theme:'Lorem ipsum',
    intituleFormation:'Lorem ipsum',
    status:'APPROUVER'
  },
    {
    num_reference: 1093,
    chefEFF: {
      prenom:'Lorem',
      nom:'Ipsum',
      matricule:'mat001'
    },
    eff:'Lorem ipsum',
    theme:'Lorem ipsum',
    intituleFormation:'Lorem ipsum',
    status:'SOUMIS'
  }
]
