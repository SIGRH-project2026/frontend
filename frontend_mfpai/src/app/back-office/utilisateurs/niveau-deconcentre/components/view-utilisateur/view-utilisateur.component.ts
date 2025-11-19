import {Component, OnInit} from '@angular/core';
import {CentralLevelDTO, DeconectedDTO} from "../../../../../models/utilisateur";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {UtilisateurService} from "../../../../../services/utilisateur.service";
import {ResponseApi} from "../../../../../models/response-api";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-view-utilisateur',
  templateUrl: './view-utilisateur.component.html',
  styleUrls: ['./view-utilisateur.component.css']
})
export class ViewUtilisateurComponent implements OnInit{
  deconectedDTO!: DeconectedDTO;
  userId: any;
  profileLabel: any ;
   profileCode: any;

  constructor(   private router: Router,
                 private location: Location,
                 private utilisateurService: UtilisateurService,
                 private activatedRoute: ActivatedRoute,
                 private  spinner : NgxSpinnerService,
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
    this.spinner.show();
    this.utilisateurService.getUser(this.userId)

        .subscribe({
          next : (response : ResponseApi) => {


            if(response.success){

              this.deconectedDTO = response.data

              this.profileLabel = this.deconectedDTO.profils.map(pro => pro.label)[0];
              this.profileCode = this.deconectedDTO.profils.map(pro => pro.code)[0];

              this.spinner.hide();
            }
          }
        })
  }
}
