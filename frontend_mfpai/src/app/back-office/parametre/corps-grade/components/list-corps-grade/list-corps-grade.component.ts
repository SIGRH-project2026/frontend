import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toggleGradesAnimation } from 'src/app/shared/animations/toggleanimaton';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { ParametreCorpsGrade } from 'src/app/models/utilisateur';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { ResponseApi } from 'src/app/models/response-api';


@Component({
  selector: 'app-list-corps-grade',
  templateUrl: './list-corps-grade.component.html',
  styleUrls: ['./list-corps-grade.component.css'],
  animations: [toggleGradesAnimation]
})
export class ListCorpsGradeComponent implements OnInit {

  headers: string[] = ['Date', 'Corps', 'Grade', 'Statut', 'Action'];
  page = 1;
  pageSize = 10;

  dataList: ParametreCorpsGrade[] = [];

  collectionSize = this.dataList.length;
  // dataList!: any[];
  text = '';
  expandedRows: { [key: number]: boolean } = {};


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UtilisateurService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {

    this.listParamAdvanced(0, 10, "", "", "", "");
    this.refreshData();
  }

  refreshData() {
    this.page = 1;
    this.listParamAdvanced(0, this.pageSize, "", "", "", "");
  }

  onCreateCorps() {
    this.router.navigate(['create-corps-grade'], { relativeTo: this.route.parent })
  }
  onEditCorps(data: any) {
    this.router.navigate([data.id, 'edit-corps-grade'], { relativeTo: this.route.parent })
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

      this.userService.changeStatusParam(data?.id).subscribe({
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
              html: `Corps  <b>${data?.corpsGrade?.label}</b> a été <b>${this.text.toLowerCase()}</b>.`,
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

  toggleGrades(data: any) {
    data.showAllGrades = !data.showAllGrades;
  }



  listParamAdvanced(page: number, size: number, filter: string, libelleCorps: string,
    libelleGrade: string, libelleSpecialite: string) {
    this.userService.listParamAdvanced(page, size, filter, libelleCorps, libelleGrade, libelleSpecialite)
      .subscribe(data => {
        if (data?.status === 'OK') {

          this.dataList = data?.payload;


          this.collectionSize = data.metadata?.totalElements ?? 0

        }
      });

  }


  onPageChange(page: number) {
    this.page = page;
    this.listParamAdvanced(page - 1, this.pageSize, "", "", "", "");
  }

}

