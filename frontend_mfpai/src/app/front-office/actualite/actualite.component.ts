import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Actualite } from 'src/app/back-office/parametre/actualites/Model/Actualite';
import { ActualiteService } from 'src/app/back-office/parametre/actualites/service/Actualite.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-actualite',
  templateUrl: './actualite.component.html',
  styleUrls: ['./actualite.component.css']
})
export class ActualiteComponent implements OnInit{
  
  actualites: Actualite[] = [];
  url = environment.apiUrl+"opt/tomcat/webapps/projet-api-v2/WEB-INF/classes/images/"
  code = "ACTUALITE"
    private cache: any | null;

  constructor(private router: Router,
	private actualiteService: ActualiteService,
  private spinner : NgxSpinnerService
  ) { }
  
  ngOnInit(): void {
    this.getActulitesList();
    //console.log("url    ",this.url);
    
  }

  getImageUrl(fileName : string) :string{

    return `${this.url}${fileName}`
  }

  getActulitesList(){
      this.spinner.show()
      this.actualiteService.getAllActuOrRecrutementActiveBis(this.code).subscribe({
          next: (data) => {
              this.spinner.hide()
              //console.log(data.data);
              this.actualites = data.data.payload;
          },
          error: (err) => {
              this.spinner.hide()
              //console.log(err);
          },
      })
  }
  
  onViewActu(id: number) {
		this.router.navigateByUrl(`actualites/${id}`)
	}


}
