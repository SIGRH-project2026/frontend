import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormationService, ParticipantDefinitifDTO } from 'src/app/services/formation.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.css']
})
export class ViewDetailComponent implements OnInit {

  headers: string[]  = ['Matricule', 'Nom', 'Division/Établissement','Actions'];
  page = 1;
  pageSize = 10;
  collectionSize = DATA.length;
  demandeList!: any[];
  tableauSuivi!: any;
  collapsed: boolean = false;
  text = '';
  participationId = "";
  participantList!: any;

  assidu!: string;
  competences!: string;
  admis!: string;
  comment!: string;

  participant!: ParticipantDefinitifDTO;
  updateData: Partial<ParticipantDefinitifDTO> = {};

  constructor(
    public modalService: NgbModal = inject(NgbModal),
    private route: ActivatedRoute,
    private http: HttpClient,
    private readonly formationService: FormationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.participationId = params['dataId'];
      console.log(this.participationId);
    });
    this.getParticipant(this.participationId);
    console.log(localStorage.getItem("idFormCreateTableauSuivi"));
    this.getParticipants();
    this.refreshData();
  }

  

  getParticipant(id:string){

    this.formationService.getParticipantDefinitifById(id).subscribe((response)=>{
      console.log(response.success);
        console.log(response);
        this.tableauSuivi=response;
        
    }, 
    (error) => {
      console.log(error);
      console.log(error.status);
      
    }
  );
    
   }

  getParticipants(){

    this.formationService.getParticipantDefinitifByFormation(localStorage.getItem("idFormCreateTableauSuivi")).subscribe((response)=>{
      console.log(response.success);
        console.log(response.data);
        this.participantList=response;
        console.log(response);
        if(response.success==true){
          
          
        }else {
  
        }
        
    }, 
    (error) => {
      console.log(error);
      console.log(error.status);
      
    }
  );
    
   }

   SendRapportPersonnel(id:number){
    console.log(this.assidu);
    //const id = this.participant.id;
    const data: Partial<ParticipantDefinitifDTO> = {
      admis: this.admis==="oui"?true:false,
      assidu: this.assidu==="oui"?true:false,
      commentaire: (document.getElementById('comment') as HTMLTextAreaElement).value,
      competences: this.competences==="oui"?true:false
    };

    this.formationService.updateParticipantDefinitif(id, data)
      .subscribe(
        updatedParticipant => {
          console.log('Participant updated successfully', updatedParticipant);
          //this.participant = updatedParticipant;
          Swal.fire({
            icon: 'success',
            html: 'Rapport personnel <b>PRENOM NOM</b> crée avec succès.',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            this.modalService.dismissAll();
            location.reload();
          })
        },
        error => {
          console.error('Error updating participant', error);
        }
      );
   }


  openModalSearch(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true }).result.then(
      (result) => {
        `Closed with: ${result}`;
      },
      (reason) => {
        `Dismissed ${this.getDismissReason(reason)}`;
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
    this.demandeList = DATA.map((user: any, i: any) => ({ id: i + 1, ...user })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }

  onSaveRapport() {
    console.log(this.assidu);
    console.log(this.competences);
    console.log((document.getElementById('comment') as HTMLTextAreaElement).value);
    Swal.fire({
      icon: 'success',
      html: 'Rapport personnel <b>PRENOM NOM</b> crée avec succès.',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      this.modalService.dismissAll();
    })
 }

}
const DATA: any[] = [
  {
    user: {
      prenom:'Lorem',
      nom:'Ipsum',
      matricule:'mat001',
      division:'Lorem ipsum'
    }
  },
  {
    user: {
      prenom:'Lorem',
      nom:'Ipsum',
      matricule:'mat001',
      division:'Lorem ipsum'
    }
  }
]


