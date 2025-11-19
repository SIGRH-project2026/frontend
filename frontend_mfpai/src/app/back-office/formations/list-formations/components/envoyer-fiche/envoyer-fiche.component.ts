import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-envoyer-fiche',
  templateUrl: './envoyer-fiche.component.html',
  styleUrls: ['./envoyer-fiche.component.css']
})
export class EnvoyerFicheComponent implements OnInit {
  
  piecesJointesFiles: File[] = [];
  
  constructor(
    private router: Router,
  ) { }
  
  ngOnInit(): void { }

  onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
    filesArray.push(...event.addedFiles);
  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
  }

   onSaveDemande() {
    Swal.fire({
      icon: "success",
      html: "La demande a été envoyée avec succès.",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      this.router.navigate(["formations/liste-des-formations"]);
    });
  }
  onReset() {
    this.router.navigate(["formations/liste-des-formations"]);
  }
}

