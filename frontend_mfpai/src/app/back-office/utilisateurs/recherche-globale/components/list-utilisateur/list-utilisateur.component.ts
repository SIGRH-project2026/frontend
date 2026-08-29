import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {UtilisateurService} from "../../../../../services/utilisateur.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {CentralLevel, DeconectedDTO, Profil} from "../../../../../models/utilisateur";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-list-utilisateur',
  templateUrl: './list-utilisateur.component.html',
  styleUrls: ['./list-utilisateur.component.css']
})
export class ListUtilisateurComponent implements OnInit {

  headers!: string[];
  page = 0;
  pageSize = 10;
  text: string = '';
  userList: any[] = [];
  showTable: boolean = false;


  searchForm!: FormGroup;
  userResultCen!: CentralLevel;
  userResultDec!: DeconectedDTO;
   profile!: Profil;


  constructor(private utilisateurService : UtilisateurService,
              private formBuilder: FormBuilder,
              private  spinner : NgxSpinnerService,
            private router: Router, private route: ActivatedRoute
            ) {}


  ngOnInit(): void {
  //  this.headers = ['Matricule', 'Prénom', 'Nom', 'Direction/Etablissement', 'Profil', 'Statut', 'Action'];

   this.searchForm = this.formBuilder.group({
      filter: ['', Validators.required]
    })
  }

  search() {
    this.spinner.show();
    this.showTable = false;
    this.userResultCen = undefined as any;
    this.userResultDec = undefined as any;
    this.profile = undefined as any;
    const filter = this.searchForm.controls['filter'].value?.trim();
    this.utilisateurService.getSearchUser(filter).subscribe({
      next: data => {
        if(data.success){
            if (data?.data?.typeUser === 'CEN') {
               this.userResultCen = data?.data;
              this.profile = this.userResultCen.profils?.[0];
              this.spinner.hide();
              this.showTable = true;
            }else if (data?.data?.typeUser === 'DEC') {
              this.userResultDec = data?.data;
              this.profile = this.userResultDec.profils?.[0];
              this.spinner.hide();

              this.showTable = true;
            }else {
            this.spinner.hide();

            this.showTable = false;
          }
        } else {
          this.spinner.hide();
          this.showTable = false;
        }
      },
      error: () => {
        this.spinner.hide();
        this.showTable = false;
      }
    })


  }

  // 
  reset() {
    this.showTable = false;
    this.userList = [];
  }

  // Toggle user status
  // changeStatus(user: any) {
  //   user.status = !user.status;
  // }


  toggleUserStatus(user: any): void {
    user.status = !user.status;
  }

  onChangeProfil() {

      if( this.userResultCen) {
          this.router.navigate([this.userResultCen?.id, 'change-profil'], { relativeTo: this.route });
      }else {
          this.router.navigate([this.userResultDec?.id, 'change-profil'], { relativeTo: this.route });
      }

  }

  onEditUser(): void {
    const user = this.userResultCen || this.userResultDec;
    if (!user?.id) {
      return;
    }

    const niveau = this.userResultCen ? 'niveau-central' : 'niveau-deconcentre';
    this.router.navigate(['/utilisateurs', niveau, user.id, 'edit-utilisateur']);
  }

}



