import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { BesoinEnPersonnel } from '../../../besoin-en-personnel/models/besoinEnPersonnel';
import { BesoinEnPersonnelService } from '../../../besoin-en-personnel/services/besoin-en-personnel.service';

@Component({
  selector: 'app-detail-demande-en-personnel-recus',
  templateUrl: './detail-demande-en-personnel-recus.component.html',
  styleUrls: ['./detail-demande-en-personnel-recus.component.css']
})
export class DetailDemandeEnPersonnelRecusComponent implements OnInit{

  headersFiliere: string[] = ['Nom filière', 'Discipline', 'Nbr personne à recruter'];

  demande: BesoinEnPersonnel = new BesoinEnPersonnel();
  idDemande: any;

  constructor(
    private router: Router,
    private location: Location,
    private readonly activatedRoute : ActivatedRoute,
    private readonly besoinEnPersonnelService : BesoinEnPersonnelService
  ) {
    this.idDemande = this.activatedRoute.snapshot.paramMap.get('Id')
    
    
  }
  ngOnInit(): void {
    this.getOneBEP()
  }


  onValidate(): void {
    Swal.fire({
      icon: 'info',
      title: 'Validatiion',
      html: 'voulez-vous valider la demande ??',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'non',
      cancelButtonColor : '#FF4D4F'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          html: 'La demande a été validéé',
          showConfirmButton: false,
          timer: 2000
        })
        this.router.navigate(['gpeec/besoin-en-personnel-recus']);
      }
    });
  }

  onReset(): void {
    Swal.fire({
      icon: 'info',
      title: 'Annuleer',
      html: 'voulez-vous rejeteer la demande ??',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'non',
      cancelButtonColor : '#FF4D4F'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          html: 'La demande a été annulée',
          showConfirmButton: false,
          timer: 2000
        })
        this.router.navigate(['gpeec/besoin-en-personnel-recus']);
      }
    });
  }

   goBack() {
    this.location.back()
  }
  getOneBEP(){
    this.besoinEnPersonnelService.get(this.idDemande)
        .subscribe({
          next : (data : ResponseApi2) => {
            if(data.status?.includes("OK")){
              this.demande = data.payload
              console.log({if : this.demande});
              
            }
          }
        })
  }
}
