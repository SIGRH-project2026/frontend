import { Component, inject, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liste-recrutement',
  templateUrl: './liste-recrutement.component.html',
  styleUrls: ['./liste-recrutement.component.css']
})
export class ListeRecrutementComponent {

  headers: string[] = ['Nom de l\'annonce','Photo', 'Date de publication', 'Commentaire', 'Statut',  'Action'];
  page = 1;
  pageSize = 10;
  collectionSize = DATA.length;
  actualiteList!: any[];
  text = '';
  closeResult = '';
  searchText = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.actualiteList = DATA.map((actualite: any, i: any) => ({ id: i + 1, ...actualite })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }

  onCreateRecrutement() {
    this.router.navigate(['add-recrutement'], { relativeTo: this.route.parent })
  }

  



  changeStatus(data: any): void {
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
      if (result.isConfirmed) {
        if (!data.status) {
          this.text = "Activé";
          data.status = true
        } else {
          this.text = "Désactivé";
          data.status = false
        }

        Swal.fire({
          title: this.text,
          html: `L'actualité <b>${data.title}</b> a été ${this.text.toLowerCase()}.`,
          icon: 'success',
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false
        })
      }
    })
  }

  onViewImage(imageUrl: string, title: string) {
    Swal.fire({
      imageUrl: imageUrl,
      imageWidth: 720,
      imageAlt: title
    });
  }

}

const DATA: any[] = [
  {
    id: 1,
    nomAnnonce: 'Recrutement',
    image: 'assets/images/actualite3.jpeg',
    publishedDate: '02-04-2024',
    description: "“Le Président de la République a d’ailleurs, sous ce chapitre.",
    categorie: 'Formation',
    status: true,

  },
  {
    id: 2,
    nomAnnonce: 'Recrutement',
    image: 'assets/images/actualite2.jpeg',
    description: 'Le lycée technique industriel Dalafosse (LTID) a abrité, ce mardi 30 avril 2024.',
    publishedDate: '02-04-2024',
    categorie: 'Formation',
    status: false,
  },
  {
    id: 3,
    nomAnnonce: 'Recrutement',
    image: 'assets/images/actualite1.jpeg',
    description: "À l’image de la communauté internationale, le syndicat de l’enseignement professionnel et technique ( SEPT) dirigé par M. Amar KANE.",
    publishedDate: '02-04-2024',
    categorie: 'Recrutement',
    status: true,
  }
];



