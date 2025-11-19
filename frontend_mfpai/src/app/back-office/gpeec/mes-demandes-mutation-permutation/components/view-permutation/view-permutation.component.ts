import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermutationService } from '../../service/permutation.service';
import { PermutationDTO } from '../../model/Permutation';

@Component({
  selector: 'app-view-permutation',
  templateUrl: './view-permutation.component.html',
  styleUrls: ['./view-permutation.component.css']
})
export class ViewPermutationComponent implements OnInit {

  idPermutation !: number
  permutation !: PermutationDTO

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private permutationService: PermutationService
  ) {}

  ngOnInit(): void {
    this.idPermutation = this.route.snapshot.params["idPermutation"]
    console.log(this.idPermutation);
    
    this.getOnePermutation()
  }

  getOnePermutation(){
    this.permutationService.getOne(this.idPermutation).subscribe(
      {
        next : (data) => {
          if(data.success){
           // console.log(data)
            this.permutation = data.data
          }
        },
        error : (err) => {
          console.log(err)
      }
      }
    )
  }

   goBack() {
    this.location.back()
  }
}
