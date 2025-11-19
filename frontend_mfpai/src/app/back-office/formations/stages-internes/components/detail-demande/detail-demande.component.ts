import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DemandeStageService} from "../../../../../services/demande-stage.service";
import {DemandeStage} from "../../../../../models/demande-stage.interface";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-detail-demande',
  templateUrl: './detail-demande.component.html',
  styleUrls: ['./detail-demande.component.css']
})
export class DetailDemandeComponent {
  idDemandeStage: string | null = ""
  demandeStage!: DemandeStage;
   constructor(
    private location: Location,
    private route: ActivatedRoute,
    private demandeStageService: DemandeStageService,
    private spinner: NgxSpinnerService
   ) { }

  ngOnInit(){
    this.idDemandeStage = this.route.snapshot.paramMap.get('dataId')
    this.getDemande()
  }

  /**
   * recuperation demande de stage
   */
  getDemande(){
    this.spinner.show()
    this.demandeStageService.getDemande(this.idDemandeStage).subscribe((res)=>{
      this.demandeStage = res.payload
      if (res.status === 'OK'){
        // console.log('==========================')
        // console.log(res.payload)
        this.spinner.hide()
      }else{
        this.spinner.hide()
      }

    })
  }

  /**
   * telechargement fichier
   * @param fileName
   */
  downloadFile(fileName: string){
     this.demandeStageService.downloadFile(fileName)
  }
  goBack() {
    this.location.back()
  }

}
