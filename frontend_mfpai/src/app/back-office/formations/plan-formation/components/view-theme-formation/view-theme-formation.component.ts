import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-view-theme-formation',
  templateUrl: './view-theme-formation.component.html',
  styleUrls: ['./view-theme-formation.component.css']
})
export class ViewThemeFormationComponent {
  
  constructor(
    private location: Location
  ) { }
  
  goBack() {
    this.location.back()
  }
}
