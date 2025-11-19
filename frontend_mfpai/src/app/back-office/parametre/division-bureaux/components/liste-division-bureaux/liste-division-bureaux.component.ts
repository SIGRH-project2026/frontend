import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import {Direction, Division, Region} from "../../../../../models/utilisateur";
import {ReferencesService} from "../../../../../services/references.service";
import {ParametreService} from "../../../services/parametre.service";
import {ResponseApi} from "../../../../../models/response-api";

@Component({
  selector: 'app-liste-division-bureaux',
  templateUrl: './liste-division-bureaux.component.html',
  styleUrls: ['./liste-division-bureaux.component.css']
})
export class ListeDivisionBureauxComponent  implements OnInit {


  headers: string[] = ['N° reference','Direction', 'Division',  'Statut',  'Action'];
  page = 0;
  pageSize = 10;

  totalPages = 0;
  size = 10;
  region: Region[]=[];
  divisionList: Division[] =[];

  collectionSize = this.divisionList.length;

  text = '';
  closeResult = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private referenceService: ReferencesService,
    private parametreService: ParametreService,

  ) { }

  ngOnInit(): void {
    this.listDivisionAdvanced(0, 10, "", "");
    this.refreshData();
  }

  refreshData() {
    this.listDivisionAdvanced(this.totalPages, this.size, "", "");
  }

  onCreateDivisionBureaux() {
    this.router.navigate(['add-division-bureaux'], { relativeTo: this.route.parent })
  }



  listDivisionAdvanced(page: number, size: number, filter: string,statut: string){
    this.parametreService.listDivisionAdvanced(page,  size,  filter, statut)
        .subscribe(data => {
          if (data?.status === 'OK') {

            this.divisionList = data?.payload;

            console.log(this.divisionList);

            this.collectionSize = data.metadata?.totalElements ?? 0
            this.size = data.metadata?.size ?? 0


          }
        });

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
      this.parametreService.changeStatusDivision(data?.id).subscribe({
        next: (response: ResponseApi) => {

          if (result.isConfirmed) {
            if (!data.statut) {
              this.text = "Activé";
              data.statut = true
            } else {
              this.text = "Désactivé";
              data.statut = false
            }

            Swal.fire({
              title: this.text,
              html: `La direction <b>${data?.label}</b> a été ${this.text.toLowerCase()}.`,
              icon: 'success',
              timer: 1500,
              showCancelButton: false,
              showConfirmButton: false
            })
          }
        }
      });

    })
  }

 

}




