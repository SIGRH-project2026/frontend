import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-traitement-expression',
  templateUrl: './form-traitement-expression.component.html',
  styleUrls: ['./form-traitement-expression.component.css']
})
export class FormTraitementExpressionComponent {
 
  text = '';

  constructor(
    private router: Router,
    private location: Location
  ){}

   onTraitementDemande(data: any): void {
    Swal.fire({
      title: 'Souhaitez-vous confirmer ce traitement ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgba(29, 74, 123, 1)',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          text: `La demande d'expressions des besoins a éte traité avec succès`,
          icon: 'success',
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false
        }).then(() => {
          this.location.back();
        })
      }
    })
  }

  onReset() {
    this.location.back();
  }
}
