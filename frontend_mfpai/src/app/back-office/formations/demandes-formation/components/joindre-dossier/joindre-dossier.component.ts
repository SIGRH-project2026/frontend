import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-joindre-dossier',
  templateUrl: './joindre-dossier.component.html',
  styleUrls: ['./joindre-dossier.component.css']
})
export class JoindreDossierComponent implements OnInit {
  
  piecesJointesFiles: File[] = [];
  fileList: any[] = [
    {
      fileName: 'Document 1',
      fileSize: 32,
      fileNameComplet: 'Document1.pdf',
    }
  ];

  constructor(
    private router: Router
  ) { }
  
  ngOnInit(): void { }

  onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
    filesArray.push(...event.addedFiles);
  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
  }

  onReset() {
    this.router.navigate(["formations/demandes-de-formation"]);
  }

  onAddFile() {
     Swal.fire({
      icon: "success",
      html: "Document ajouté avec succès.",
      showConfirmButton: false,
      timer: 1500,
    })
  }

  onDeleteFile(index: number) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous supprimer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1D4A7B',
      cancelButtonColor: '#FF4D4F',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Retiré',
          html: ' élément retiré ',
          icon: 'success',
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false
        }).then(() => {
          this.fileList.splice(index, 1)
        })
      }
    });
  }
}
