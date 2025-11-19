import { Location } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ExpressionDeBesoinService} from "../../../../../services/expression-de-besoin.service";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {ExpressionDeBesoinInterface} from "../../../../../models/expression-de-besoin.interface";
import {NgxSpinnerService} from "ngx-spinner";
import {AlertService} from "../../../../../shared/commons/alert.service";

@Component({
  selector: 'app-view-expression',
  templateUrl: './view-expression.component.html',
  styleUrls: ['./view-expression.component.css']
})
export class ViewExpressionComponent implements OnInit{

  id!: string | null;
  expressionDeBesoin!: ExpressionDeBesoinInterface;
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private expressionDeBesoinService: ExpressionDeBesoinService,
    private spinner:  NgxSpinnerService,
    private alert: AlertService
  ) { }

  ngOnInit(){
    this.getExpressionDeBesion()
  }

  getIdExpressionDeBesoin(){
    this.id = this.route.snapshot.paramMap.get('themeId')
  }

  /**
   * recuperation de l'expression de besion via id
   */
  getExpressionDeBesion(): void {
    this.spinner.show()
    this.getIdExpressionDeBesoin()
    this.expressionDeBesoinService.getExpressionDeBesoin(this.id).subscribe((res)=>{
      if (res.status === 'OK'){
        this.spinner.hide()
        this.expressionDeBesoin = res.payload
      }else{
        this.alert.showAlert({status: res.status, message: res.message, titre: 'Liste expression de besoin'})
        this.spinner.hide()
      }
    })
  }
  
  goBack() {
    this.location.back()
  }
}
