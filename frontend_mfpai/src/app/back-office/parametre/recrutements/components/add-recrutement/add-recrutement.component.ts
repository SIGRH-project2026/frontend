import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-recrutement',
  templateUrl: './add-recrutement.component.html',
  styleUrls: ['./add-recrutement.component.css']
})
export class AddRecrutementComponent {

  piecesJointesFiles: File[] = [];

  constructor(
    private location: Location
  ) { }

  ngOnInit(): void {
    
  }

   onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
    filesArray.push(...event.addedFiles);
  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
  }

  onSave() {
    Swal.fire({
      icon: 'success',
      html: 'Actualité enregistrée avec succès.',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      this.location.back();
    })
  }

  onReset() {
    this.location.back();
  }

}

