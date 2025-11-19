import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'node:console';
import { Actualite } from 'src/app/back-office/parametre/actualites/Model/Actualite';
import { ActualiteService } from 'src/app/back-office/parametre/actualites/service/Actualite.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-single-actualite',
  templateUrl: './single-actualite.component.html',
  styleUrls: ['./single-actualite.component.css']
})
export class SingleActualiteComponent {

  actualiteId !: number
  actualite !: Actualite
  content !: string
  url = environment.apiUrl+"images/"


  actualites !: any

  constructor(
    private router: Router,
    private route: ActivatedRoute,   
    private location: Location,
    private actualiteService: ActualiteService,
    private spinner  : NgxSpinnerService
  ) { }

  ngOnInit(){
    this.actualiteId = this.route.snapshot.params["dataId"]
    this.getOne(this.actualiteId)
    this.getlastActu()
    console.log(" passage ");
    
  }

  getlastActu(){
    //this.spinner.show()
    this.actualiteService.getLastActualiteActive().subscribe(
      (data) => {
        if(data.success){
         // this.spinner.hide()
          console.log(data);
          this.actualites = data.data.payload
        }
        },
    )
  }

  getOne(id:number){
    this.spinner.show()
    this.actualiteService.getOne(id).subscribe({
      next : (res : any) =>{
        this.spinner.hide()
        console.log(res);
        this.actualite = res.data
        this.content = res.data.contenu.content
      }
    })
  }

  getImageUrl(fileName : string) :string{

    return `${this.url}${fileName}`
  }

    onViewActu(id: number) {
    this.router.navigateByUrl(`actualites/${id}`)
    this.getOne(id)
    }
  
  goBack() {
    this.location.back();
	}
}
