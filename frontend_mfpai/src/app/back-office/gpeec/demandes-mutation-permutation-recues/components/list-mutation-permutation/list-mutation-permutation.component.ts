import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-permutation',
  templateUrl: './list-mutation-permutation.component.html',
  styleUrls: ['./list-mutation-permutation.component.css']
})
export class ListMutationPermutationComponent implements OnInit {

  headersMutation: string[] = ['N° Demande', 'Date demande','Matricule','Demandeur', 'Etablissement d\'origine', 'Etablissement (Souhaité)', 'Statut','Action'];
  page = 1;
  pageSize = 10;
  collectionSize1 = DATAMUTATION.length;
  collectionSize2 = DATAPERMUTATION.length;
  mutationList!: any[];
  permutationList!: any[];
  collapsed: boolean = false;
  tabTitle = 'Liste des demandes de mutations reçues';
  tabIndex = 0;
  closeResult = '';

   piecesJointesFiles: File[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public modalService: NgbModal = inject(NgbModal)
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }
  	openModal(content: TemplateRef<any>) {
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
    this.mutationList = DATAMUTATION.map((demande: any, i: any) => ({ id: i + 1, ...demande })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );

    this.permutationList = DATAPERMUTATION.map((demande: any, i: any) => ({ id: i + 1, ...demande })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }


  onViewDetailFormation(data: any) {
    this.router.navigate([data.num_demande, 'detail-view'], { relativeTo: this.route.parent })
  }

  onTabChange(event : MatTabChangeEvent) {
    this.tabIndex = event.index;
    this.tabIndex == 0 ?
      this.tabTitle = 'Liste des demandes de mutations reçues' :
      this.tabTitle = 'Liste des demandes de permutations reçues';
  }
  
  onCreateMutation() {
    this.router.navigate(['create-mutation'], { relativeTo: this.route.parent })
  }

  onDemandePermutation() {
    this.closeModal();
    this.router.navigate(['create-permutation'], { relativeTo: this.route.parent })
  }

  onViewDetailMutation(data: any) {
    this.router.navigate([data.num_demande, 'detail-mutation'], { relativeTo: this.route.parent })
  }
  
  onViewDetailPermutation(data: any) {
    this.router.navigate([data.num_demande, 'detail-permutation'], { relativeTo: this.route.parent })
  }

  onEditPermutation(data: any) {
    this.router.navigate([data.num_demande, 'traitement-demande-permutation'], { relativeTo: this.route.parent })
  }

   onEditMutation(data: any) {
    this.router.navigate([data.num_demande, 'traitement-demande-mutation'], { relativeTo: this.route.parent })
  }

  onParticipe(data: any) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous participer cette formation ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui, je confirme',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          html: 'Votre demande de participation à la formation <b>(Type formation)</b> a été envoyée.',
          icon: 'success',
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false
        })
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

 
  onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
    filesArray.push(...event.addedFiles);
  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
  }

    onSaveDemandeOS() {
    Swal.fire({
      icon: 'success',
      html: 'Demande enregistrée avec succès.',
      showConfirmButton: false,
      timer: 3000
    }).then(() => {
      this.closeModal();
    })

  }

}

const DATAMUTATION: any[] = [
  {
    num_demande: 'ref003',
    dateDemande:'24-04-2024',
    prenomDemandeur:'Lorem',
    demandeur:{
      prenom:'Lorem',
      nom:'Ipsum',
      matricule:'mat001'
    },
    etablissementSouhaitee: 'Lorem ipsum',
    regionSouhaitee: 'Lorem ipsum',
    etablissementOrigine: 'Lorem ipsum',
    statut: 'SOUMISE'
  },
  {
    num_demande: 'ref003',
    dateDemande:'24-04-2024',
    prenomDemandeur:'Lorem',
    demandeur:{
      prenom:'Lorem',
      nom:'Ipsum',
      matricule:'mat001'
    },
    etablissementSouhaitee: 'Lorem ipsum',
    etablissementOrigine: 'Lorem ipsum',
    regionSouhaitee: 'Lorem ipsum',
    statut: 'VALIDEER'
  },
  {
    num_demande: 'ref003',
    dateDemande:'24-04-2024',
    prenomDemandeur:'Lorem',
    demandeur:{
      prenom:'Lorem',
      nom:'Ipsum',
      matricule:'mat001'
    },
    etablissementSouhaitee: 'Lorem ipsum',
    etablissementOrigine: 'Lorem ipsum',
    regionSouhaitee: 'Lorem ipsum',
    statut: 'REJETEE'
  },
  {
    num_demande: 'ref003',
    dateDemande:'24-04-2024',
    prenomDemandeur:'Lorem',
    demandeur:{
      prenom:'Lorem',
      nom:'Ipsum',
      matricule:'mat001'
    },
    etablissementSouhaitee: 'Lorem ipsum',
    etablissementOrigine: 'Lorem ipsum',
    regionSouhaitee: 'Lorem ipsum',
    statut: 'SOUMISE'
  },
  {
    num_demande: 'ref003',
    dateDemande:'24-04-2024',
    prenomDemandeur:'Lorem',
    demandeur:{
      prenom:'Lorem',
      nom:'Ipsum',
      matricule:'mat001'
    },
    etablissementSouhaitee: 'Lorem ipsum',
    etablissementOrigine: 'Lorem ipsum',
    regionSouhaitee: 'Lorem ipsum',
    statut: 'AMODIFIER'
  }
];

const DATAPERMUTATION: any[] = [
  {
    num_demande: 'dem002',
        dateDemande:'23-04-2024',
    formateur1: {
      matricule: 'MAT001',
      prenom: 'Lamine',
      nom:'DIEME',
    },
     formateur2: {
      matricule: 'MAT001',
      prenom: 'Libasse',
      nom:'YADE',
    },
    statut:'ENVOYEER'
  },
    {
    num_demande: 'dem001',
        dateDemande:'23-04-2024',
    formateur1: {
      matricule: 'MAT001',
      prenom: 'Lamine',
      nom:'DIEME',
    },
     formateur2: {
      matricule: 'MAT001',
      prenom: 'Libasse',
      nom:'YADE',
    },
    statut:'VALIDEER'
  },
    {
    num_demande: 'dem002',
        dateDemande:'23-04-2024',
    formateur1: {
      matricule: 'MAT001',
      prenom: 'Lamine',
      nom:'DIEME',
    },
     formateur2: {
      matricule: 'MAT001',
      prenom: 'Libasse',
      nom:'YADE',
    },
    statut:'ACCEPTEER'
  },
   {
    num_demande: 'dem002',
        dateDemande:'23-04-2024',
    formateur1: {
      matricule: 'MAT001',
      prenom: 'Lamine',
      nom:'DIEME',
    },
     formateur2: {
      matricule: 'MAT001',
      prenom: 'Libasse',
      nom:'YADE',
    },
    statut:'REFUSEER'
  },
  {
    num_demande: 'dem002',
        dateDemande:'23-04-2024',
    formateur1: {
      matricule: 'MAT001',
      prenom: 'Lamine',
      nom:'DIEME',
    },
     formateur2: {
      matricule: 'MAT001',
      prenom: 'Libasse',
      nom:'YADE',
    },
    statut:'AMODIFIER'
  },
    {
    num_demande: 'dem001',
        dateDemande:'23-04-2024',
    formateur1: {
      matricule: 'MAT001',
      prenom: 'Lamine',
      nom:'DIEME',
    },
     formateur2: {
      matricule: 'MAT001',
      prenom: 'Libasse',
      nom:'YADE',
    },
    statut:'REJETEER'
  }
]