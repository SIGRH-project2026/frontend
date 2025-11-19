import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DeconectedDTO } from 'src/app/models/utilisateur';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import {ResponseApi} from "../../../../../models/response-api";
import { UserDTOs } from 'src/app/models/UserDTOs';
@Component({
  selector: 'app-view-personnel',
  templateUrl: './view-personnel.component.html',
  styleUrls: ['./view-personnel.component.css']
})
export class ViewPersonnelComponent {
  personnel!: UserDTOs;
  userId: any;
  profileLabel: any ;
   profileCode: any;

  constructor(   private router: Router,
                 private location: Location,
                 private utilisateurService: UtilisateurService,
                 private activatedRoute: ActivatedRoute,
  ) {
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId')
  }
  ngOnInit(): void {
    this.getPersonnel();
  }

  goBack() {
    this.location.back()
  }
  
  getPersonnel(){
    this.utilisateurService.getUser(this.userId)

        .subscribe({
          next : (response : ResponseApi) => {


            if(response.success){

              this.personnel = response.data

              this.profileLabel = this.personnel.profils.map(pro => pro.label)[0];
              this.profileCode = this.personnel.profils.map(pro => pro.code)[0];
            }
          }
        })
  }
}
