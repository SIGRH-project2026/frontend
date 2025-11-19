import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PermutationService } from '../../service/permutation.service';
import { DeconectedDTO, Utilisateur } from 'src/app/models/utilisateur';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Permutation } from '../../model/Permutation';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-create-permutation',
  templateUrl: './create-permutation.component.html',
  styleUrls: ['./create-permutation.component.css']
})
export class CreatePermutationComponent implements OnInit{

  matriculeUtilisateur2 !: string
  currentUser!: DeconectedDTO
  user2!: DeconectedDTO

  permutationForm !: FormGroup

  permutationPossible : boolean = false


  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private permutationService : PermutationService,
    private spinner : NgxSpinnerService
  ) { } 
  
  ngOnInit(): void {
    this.matriculeUtilisateur2 = this.route.snapshot.params['matricule2'];
    console.log(this.matriculeUtilisateur2);
    this.getCurrentUser();
    this.getUser2(this.matriculeUtilisateur2);
    this.initForm();
    this.checkPossiblePermutation()
    console.log("checking == ",this.permutationPossible);
  }

checkPossiblePermutation(){
  console.log("checking == ",this.permutationPossible);
  if(this.currentUser?.speciality?.id == this.user2?.speciality?.id && 
    this.currentUser?.corpsGrade?.id == this.user2?.corpsGrade?.id)
    {    
      this.permutationPossible = true  
    }
  }

  initForm(){
    this.permutationForm = this._formBuilder.group({
      motifPermutation: ['', Validators.required],
    })
  }

  getCurrentUser(){
    this.spinner.show();
    this.permutationService.getCurrentUser().subscribe(
      (data) =>{
        this.currentUser = data.data;
        console.log("Current user == ",this.currentUser);
        this.spinner.hide();
      })
  }
  getUser2(matriculeUtilisateur2: string){
    this.spinner.show();
    this.permutationService.getUser2(matriculeUtilisateur2).subscribe({
      next: (data) => {
        this.user2 = data.data;
        console.log("user2 === ",this.user2);
        this.spinner.hide();
    }
  })
  }
  onSaveDemande() {
    console.log(this.permutationForm.value.motifPermutation);
    this.spinner.show()
    let permutation :Permutation = new Permutation()
    permutation.motifPermutation = this.permutationForm.value.motifPermutation
    permutation.matriculeUtilisateur1 = this.currentUser.matricule
    permutation.matriculeUtilisateur2 = this.user2.matricule

    this.permutationService.add(permutation).subscribe({
      next: (data) => {
        this.spinner.hide()
        console.log(data);
        Swal.fire({
          icon: "success",
          html: "La demande de permutation a été soumise avec succès.",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          this.router.navigate(["gpeec/mes-demandes-mutation-permutation"]);
        });
      },
      error : (error)=>{
        this.spinner.hide()
        Swal.fire({
          title: 'Permutation',
          html: "L'ajout de la demande de permutation a échoué",
          icon: 'error',
          timer: 2500,
          showCancelButton: false,
          showConfirmButton: false
        })
        //this.UsersMatriculesForm.reset();        
      }                                                          
    })
    
  }

  onReset() {
    this.router.navigate(["gpeec/mes-demandes-mutation-permutation"]);
  }
}
