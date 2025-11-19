import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MutationService } from '../../services/mutation.service';
import { ActivatedRoute } from '@angular/router';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { MutationDTO } from '../../models/mutationDTO';

@Component({
  selector: 'app-view-mutation',
  templateUrl: './view-mutation.component.html',
  styleUrls: ['./view-mutation.component.css']
})
export class ViewMutationComponent  implements OnInit {
  
  idMutation : any
  mutation: MutationDTO = new MutationDTO;
  constructor(
    private location: Location,
    private readonly mutationService : MutationService,
    private readonly _activatedRoute : ActivatedRoute
  ) {
    this.idMutation = this._activatedRoute.snapshot.paramMap.get('dataId')
console.log({id : this.idMutation});

    
  }
  ngOnInit(): void {
    this.getOneMutation()
   }
   goBack() {
    this.location.back()
  }
  getOneMutation(){
    this.mutationService.get(this.idMutation)
        .subscribe({
          next : (data : ResponseApi2) =>{
            if(data.status?.includes("OK"))
            this.mutation = data.payload
          console.log({mut : this.mutation});
          
          }
        })
  }
}
