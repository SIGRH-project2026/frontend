import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BesoinEnPersonnelService } from '../../services/besoin-en-personnel.service';
import { BesoinEnPersonnel } from '../../models/besoinEnPersonnel';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';

@Component({
  selector: 'app-view-expression',
  templateUrl: './view-expression.component.html',
  styleUrls: ['./view-expression.component.css']
})
export class ViewExpressionComponent  implements OnInit{
 
   headersFiliere: string[] = ['Nom filière', 'Discipline', 'Nbr personne à recruter'];
  
  idDemande : any
  demande : BesoinEnPersonnel = new BesoinEnPersonnel()
  constructor(
    private location: Location,
    private readonly activatedRoute : ActivatedRoute,
    private readonly besoinEnPersonnelService : BesoinEnPersonnelService
  ) {
    this.idDemande = this.activatedRoute.snapshot.paramMap.get('dataId')
    
  }
  ngOnInit(): void {
   this.getOneBEP()
  }

  goBack() {
    this.location.back()
  }

  getOneBEP(){
    this.besoinEnPersonnelService.get(this.idDemande)
        .subscribe({
          next : (data : ResponseApi2) => {
            if(data.status?.includes("OK")){
              this.demande = data.payload
            }
          }
        })
  }
}
