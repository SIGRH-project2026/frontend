import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-view-permutation',
  templateUrl: './view-permutation.component.html',
  styleUrls: ['./view-permutation.component.css']
})
export class ViewPermutationComponent {

  constructor(
    private location: Location
  ) {}

   goBack() {
    this.location.back()
  }
}
