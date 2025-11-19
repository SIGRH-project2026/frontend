import { Location } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ParametreService} from "../../../../../services/parametre.service";
import {ParametreResponse} from "../../../../../models/parametre-response.interface";

@Component({
  selector: 'app-view-indicateur',
  templateUrl: './view-indicateur.component.html',
  styleUrls: ['./view-indicateur.component.css']
})
export class ViewIndicateurComponent implements OnInit{
    id!: string | null;
    indicateur!: ParametreResponse;
   constructor(
    private location: Location,
    private route: ActivatedRoute,
    private parametreService: ParametreService,

   ) { }
  
  
  goBack() {
    this.location.back();
  }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('dataId')
        this.findIndicateur(this.id!.toString())
    }

    findIndicateur(id: string){
       this.parametreService.findParametre(id).subscribe((res)=>{
           this.indicateur = res.payload;
       })
    }
}
