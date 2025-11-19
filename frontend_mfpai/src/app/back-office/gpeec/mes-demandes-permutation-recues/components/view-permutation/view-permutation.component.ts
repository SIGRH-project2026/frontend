import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermutationService } from '../../../mes-demandes-mutation-permutation/service/permutation.service';
import { PermutationDTO } from '../../../mes-demandes-mutation-permutation/model/Permutation';

@Component({
  selector: 'app-view-permutation',
  templateUrl: './view-permutation.component.html',
  styleUrls: ['./view-permutation.component.css']
})
export class ViewPermutationComponent {

  idPermutation !: number
  permutation !: PermutationDTO
  
  constructor(
    private _formBuilder: FormBuilder,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private readonly _fb: FormBuilder,
    public modalService: NgbModal = inject(NgbModal),
    private readonly permutationService: PermutationService
  ) {}

  ngOnInit(): void {
    this.idPermutation = this.route.snapshot.params["dataId"]
   // this.initForm();
    console.log(this.idPermutation);
    this.getOnePermutation()
    
  }

  getOnePermutation(){
    this.permutationService.getOne(this.idPermutation).subscribe(
      {
        next : (data) => {
          if(data.success){
            console.log(data)
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
