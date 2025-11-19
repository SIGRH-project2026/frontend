import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActualiteService } from 'src/app/back-office/parametre/actualites/service/Actualite.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recrutement',
  templateUrl: './recrutement.component.html',
  styleUrls: ['./recrutement.component.css']
})
export class RecrutementComponent implements OnInit{
  
  recrutement: any[] = [];
  url = environment.apiUrl+"images/"
  code = "RECRUTEMENT";
   cache: any = null;


  constructor(private router: Router,
		private actualiteService: ActualiteService,
    private spinner : NgxSpinnerService
  ) { }
  
  ngOnInit(): void {
    //this.getRecrutementList();
	this.getRecrutementActivated()
  }

  getRecrutementActivated(){

      this.spinner.show()
      this.actualiteService.getAllActuOrRecrutementActiveBis(this.code).subscribe(
          (data) => {
              if(data.success){

                  this.recrutement = data.data.payload;
                  //console.log("les recrutements : ",data);
                  this.spinner.hide()
              }
          }
      )

  }



    // Pour vider le cache si besoin (par ex. après une mise à jour)

  getImageUrl(fileName : string) :string{
    return `${this.url}${fileName}`
  }
  
  onViewRecrutement(id: number) {
		this.router.navigateByUrl(`recrutement/${id}`)
	}


}

