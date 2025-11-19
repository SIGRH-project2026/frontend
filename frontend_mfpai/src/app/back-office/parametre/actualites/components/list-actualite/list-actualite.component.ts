import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ActualiteService } from '../../service/Actualite.service';
import { Actualite } from '../../Model/Actualite';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-list-actualite',
  templateUrl: './list-actualite.component.html',
  styleUrls: ['./list-actualite.component.css']
})
export class ListActualiteComponent implements OnInit {

  headers: string[] = ['Photos', 'Nom de l\'article', 'Catégorie', 'Date de publication', 'Commentaire', 'Statut', 'Action'];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  actualiteList!: Actualite[];
  allActualite !: Actualite[]
  text = '';
  url = environment.apiUrl+"files/download?filename="
  filterForm !: FormGroup
  imageUrl : any

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private actualiteService: ActualiteService,
    private formBuilder: FormBuilder ,
    private spinner : NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      statut :['']
    });
    this.getAllActualite();
  }
  
  getAllActualite(){
    this.spinner.show()
    let statut = this.filterForm.value.statut
    // console.log("statut == ",statut);

    //this.actualiteService.getAllActualite(this.page-1, this.pageSize, statut).subscribe({
    this.actualiteService.getAllActualiteA(this.page-1, this.pageSize, statut).subscribe({
      next : (data: any) =>{
        this.spinner.hide()
        //  console.log("Les actualites",data);
        this.actualiteList = data.data.payload;
        this.collectionSize =  data.data.totalElements;
      }
    })


  }

  refreshData() {
   /*  this.actualiteList = this.allActualite.map((actualite: any, i: any) => ({ id: i + 1, ...actualite })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    ); */
    
    this.getAllActualite();
  }

  onChangeValueFilter(){
    this.getAllActualite()
  }

  onCreateActualite() {
    this.router.navigate(['create-actualite'], { relativeTo: this.route.parent })
  }

  changeStatus(data: any): void {
   // console.log(data);
    
    let text = ""
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
        this.spinner.show()
        this.actualiteService.changeStatus(data.id).subscribe({
          next: (res: any) => {
            if(res.success){
              this.spinner.hide()
              console.log(res);
              if(res.data.activated==true)
                text="activée"
              else
                text="désactivée"

              Swal.fire({
                  title: this.text,
                  html: `L'actualité <b>${data.titre}</b> a été ${text.toLowerCase()}.`,
                  icon: 'success',
                  timer: 1500,
                  showCancelButton: false,
                  showConfirmButton: false
                })
                this.getAllActualite()
            }
           
          }
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

  getImageUrl(fileName : string) :string{
    console.log(`le lien vers l'image == ${this.url}${fileName}`);
    return `${this.url}${fileName}`;
  }

}

const DATA: any[] = [
  {
    id: 1,
    title: 'Extrait conseil des ministres de ce mercredi 24 avril 2024',
    image: 'assets/images/actualite3.jpeg',
    publishedDate: '02-04-2024',
    description: "“Le Président de la République a d’ailleurs, sous ce chapitre.",
    categorie: 'Formation',
    status: true,

  },
  {
    id: 2,
    title: 'ATELIER DE RESTITUTION DES TRAVAUX D’INSTRUMENTATION POUR LE PROJET MILLE FEMMES',
    image: 'assets/images/actualite2.jpeg',
    description: 'Le lycée technique industriel Dalafosse (LTID) a abrité, ce mardi 30 avril 2024.',
    publishedDate: '02-04-2024',
    categorie: 'Formation',
    status: false,
  },
  {
    id: 3,
    title: 'JOURNÉE INTERNATIONALE DU TRAVAIL',
    image: 'assets/images/actualite1.jpeg',
    description: "À l’image de la communauté internationale, le syndicat de l’enseignement professionnel et technique ( SEPT) dirigé par M. Amar KANE.",
    publishedDate: '02-04-2024',
    categorie: 'Recrutement',
    status: true,
  }
];



