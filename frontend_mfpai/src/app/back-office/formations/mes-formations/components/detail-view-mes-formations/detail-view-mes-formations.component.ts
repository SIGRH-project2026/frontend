import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-detail-view-mes-formations',
  templateUrl: './detail-view-mes-formations.component.html',
  styleUrls: ['./detail-view-mes-formations.component.css']
})
export class DetailViewMesFormationsComponent {

 constructor(
    private location: Location,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  // FormationId: string = "";

  // ngOnInit(): void {
  //   // this.refreshData();
  //   this.route.params.subscribe(params => {
  //     this.FormationId = params['dataId'];
  //     console.log(this.FormationId);
  //   });
    
    

  //  }
  
  goBack() {
    this.location.back()
  }
}
