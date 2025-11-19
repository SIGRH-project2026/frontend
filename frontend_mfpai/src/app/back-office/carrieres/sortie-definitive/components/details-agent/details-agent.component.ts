import { Location } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UtilisateurService} from "../../../../../services/utilisateur.service";
import {ResponseApi} from "../../../../../models/response-api";
import {ActeService} from "../../../../../services/acteService.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActeDTO} from "../../../mes-demandes/components/models/ActeDTO";
import {ResponseApi2} from "../../../../../shared/models/ResponseApi";
import {FileService} from "../../../../../shared/services/files/file.service";

@Component({
  selector: 'app-details-agent',
  templateUrl: './details-agent.component.html',
  styleUrls: ['./details-agent.component.css']
})
export class DetailsAgentComponent implements OnInit{

  userId: any;
  profileLabel!: string | undefined ;

  acte!: ActeDTO

constructor  ( private router: Router,
               private location: Location,
               private readonly fileService:FileService,
               private activatedRoute: ActivatedRoute,
               private  acteService: ActeService,
               private spinner: NgxSpinnerService) {
  this.userId = this.activatedRoute.snapshot.paramMap.get('id')

 // console.log(this.userId)
}

goBack() {
  this.location.back()
}

  ngOnInit(): void {

    this.getActe();

  }

  getActe(){
    this.acteService.getActe(this.userId)

        .subscribe({
          next : (response : ResponseApi2) => {


            if(response.status?.includes("OK")){

              this.acte = response.payload;

              this.profileLabel = this.acte?.agent.profils.map(pro => pro.label)[0];
            }
          }
        })
  }

  telecharger(fileName:string){

    this.fileService.telecharger(fileName)
  }

}
