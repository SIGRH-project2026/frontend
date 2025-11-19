import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {FormBuilder} from "@angular/forms";
import {UtilisateurService} from "../../../../../services/utilisateur.service";
import {ResponseApi2} from "../../../../../shared/models/ResponseApi";
import {ResponseApi} from "../../../../../models/response-api";
import {CentralLevelDTO} from "../../../../../models/utilisateur";

@Component({
  selector: 'app-view-utilisateur',
  templateUrl: './view-utilisateur.component.html',
  styleUrls: ['./view-utilisateur.component.css']
})
export class ViewUtilisateurComponent implements OnInit{
   centralLevel!: CentralLevelDTO;
   userId: any;
   profileLabel!: string | undefined ;

  constructor(   private router: Router,
                 private location: Location,
                 private utilisateurService: UtilisateurService,
                private activatedRoute: ActivatedRoute,
                 ) {
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId')
  }
  ngOnInit(): void {
    this.getCentralLevelUser();
  }


  goBack() {
    this.location.back()
  }

  getCentralLevelUser(){
    this.utilisateurService.getUser(this.userId)

        .subscribe({
          next : (response : ResponseApi) => {


            if(response.success){

              this.centralLevel = response.data;

            //    console.log( this.centralLevel)

              this.profileLabel = this.centralLevel.profils.map(pro => pro.label)[0];
            }
          }
        })
  }
}
