import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActeService } from 'src/app/services/acteService.service';
import { CredentialsService } from 'src/app/services/credentials.service';
import { DemandePecService } from 'src/app/services/demandePecService';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { FileService } from 'src/app/shared/services/files/file.service';
import { DemandePecDTO } from '../../../models/DemandePecDTO';

@Component({
  selector: 'app-detail-demande',
  templateUrl: './detail-demande.component.html',
  styleUrls: ['./detail-demande.component.css']
})
export class DetailDemandeComponent {

  demandeId!:any;
  demande!:DemandePecDTO;

   constructor(
    private location: Location,
    private router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly demandePecService: DemandePecService,
    private readonly credentialService: CredentialsService,
    private readonly userService:UtilisateurService,
    private readonly fileService:FileService,
    private readonly demandeService:DemandePecService
  ) { 
    this.demandeId = this.activatedRoute.snapshot.paramMap.get('dataId')

  }

  ngOnInit(): void {
    this.getOneDemande();
   
  }
  
  goBack() {
    this.location.back()
  }


  getOneDemande(){
    this.demandePecService.getDemandePec(this.demandeId)
        .subscribe({
          next : (data : ResponseApi2) => {
            if(data.status?.includes("OK")){
              this.demande = data.payload;
             // console.log({acte:this.demande});
            }
          }
        });
}

telecharger(item:string){
  //console.log(item);
  this.fileService.telecharger(item)
}

}
