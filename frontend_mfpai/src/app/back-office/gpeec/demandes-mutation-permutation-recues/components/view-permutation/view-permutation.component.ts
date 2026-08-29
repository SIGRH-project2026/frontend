import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PermutationService } from '../../../mes-demandes-mutation-permutation/service/permutation.service';
import { PermutationDTO } from '../../../mes-demandes-mutation-permutation/model/Permutation';

@Component({
  selector: 'app-view-permutation',
  templateUrl: './view-permutation.component.html',
  styleUrls: ['./view-permutation.component.css']
})
export class ViewPermutationComponent implements OnInit {

  idPermutation!: number;
  permutation!: PermutationDTO;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private permutationService: PermutationService
  ) {}

  ngOnInit(): void {
    this.idPermutation = Number(this.route.snapshot.paramMap.get('idPermutation'));
    this.getOnePermutation();
  }

  getOnePermutation(): void {
    this.permutationService.getOne(this.idPermutation).subscribe({
      next: data => {
        if (data.success) this.permutation = data.data;
      }
    });
  }

   goBack() {
    this.location.back()
  }
}
