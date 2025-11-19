import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-division-bureaux',
  templateUrl: './add-division-bureaux.component.html',
  styleUrls: ['./add-division-bureaux.component.css']
})
export class AddDivisionBureauxComponent {
  
  selectedBureau: string = '';
  selectedDivision: string = '';
  constructor(
    private location: Location
  ) { }
  onSave() {
    Swal.fire({
      icon: 'success',
      html: 'Bureaux/Divisions enregistrée avec succès.',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      this.location.back();
    })
  }
}
