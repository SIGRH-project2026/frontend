import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail-view-demande',
  templateUrl: './detail-view-demande.component.html',
  styleUrls: ['./detail-view-demande.component.css']
})
export class DetailViewDemandeComponent {

    constructor(
    private location: Location,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  participationId="";
  participation: any;
  
  goBack() {
    this.location.back()
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.participationId = params['dataId'];
      console.log(this.participationId);
    });

    this.getFormation(this.participationId);

   }

   getFormation(id:string){
    this.http.get(environment.apiUrl+"api/participations/"+id, {headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    }}).subscribe(
      (response:any) => {
        console.log(response);
        this.participation=response;
        console.log("mmmmmmmmmmmmmmmmmmmmmmmmmm");
        //console.log(this.getThemeFormation(response[0].themeFormationId));
        //console.log(this.getThemeFormation(response[0].themeFormationId));
      },
      (error) => console.log(error)
    )
  }

}
