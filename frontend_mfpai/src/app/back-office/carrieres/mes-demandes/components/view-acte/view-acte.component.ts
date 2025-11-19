import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActeDTO } from '../models/ActeDTO';
import { ActeService } from 'src/app/services/acteService.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { UserDTOs } from 'src/app/models/UserDTOs';
import { FileService } from 'src/app/shared/services/files/file.service';

@Component({
  selector: 'app-view-acte',
  templateUrl: './view-acte.component.html',
  styleUrls: ['./view-acte.component.css']
})
export class ViewActeComponent implements OnInit{

  actId: any;
  idNumber!:number;
  acte : ActeDTO = new ActeDTO();
  agent!:UserDTOs;
  constructor(
    private location: Location,
    private router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly acteService: ActeService,
    private readonly fileService:FileService,

    ) { 
      this.actId = this.activatedRoute.snapshot.paramMap.get('dataId')

    }

  ngOnInit(): void {
    this.getOneDemande();
  }

  getOneDemande(){
    this.acteService.getActe(this.actId)
        .subscribe({
          next : (data : ResponseApi2) => {
            if(data.status?.includes("OK")){
              this.acte = data.payload;
              console.log({acte:this.acte});
            }
          }
        });
}

telecharger(fileName:string){

  this.fileService.telecharger(fileName)
}


  goBack() {
    this.location.back()
  }

}
