import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActualiteService } from 'src/app/back-office/parametre/actualites/service/Actualite.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-single-recrutement',
  templateUrl: './single-recrutement.component.html',
  styleUrls: ['./single-recrutement.component.css']
})
export class SingleRecrutementComponent {

  singleRecrutement : any
  idRecrutement !: number
  url = environment.apiUrl+"images/"

  recrutement !: any

  constructor(
    private router: Router,
    private route: ActivatedRoute,  
    private location: Location,
    private actualiteService: ActualiteService, 
    private spinner : NgxSpinnerService
  ) { 

    this.idRecrutement = this.route.snapshot.params["dataId"]
    this.getRecrutement()
    this.getLastRecrutement()
  }

  getLastRecrutement(){
    //this.spinner.show()
    this.actualiteService.getLastRecrutementActive().subscribe(
      (response) => {
        if(response.success){
          //this.spinner.hide()
          this.recrutement = response.data.payload
          console.log(response);
        }
      },
    )
  }

  getRecrutement(){
    this.spinner.show()
    this.actualiteService.getOne(this.idRecrutement).subscribe(
      (data : any) => {
        if(data){
          this.spinner.hide()

          console.log(data)
          this.singleRecrutement = data.data
        }
        },
    )
  } 

  getImageUrl(fileName : string) :string{
    return `${this.url}${fileName}`
  }

    onViewRecrutement(id: number) {
    this.router.navigateByUrl(`recrutement/${id}`)
    this.getRecrutement()
    }
  
  goBack() {
    this.location.back();
	}
}
