import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PermutationService } from '../../service/permutation.service';
import { DeconectedDTO, Utilisateur } from 'src/app/models/utilisateur';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Permutation } from '../../model/Permutation';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileService } from 'src/app/shared/services/files/file.service';


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
  piecesJointesFiles: File[] = [];


  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private permutationService : PermutationService,
    private readonly fileService: FileService,
    private spinner : NgxSpinnerService
  ) { }
  
  ngOnInit(): void {
    this.matriculeUtilisateur2 = this.route.snapshot.params['matricule2'];
    console.log(this.matriculeUtilisateur2);
    this.getCurrentUser();
    this.getUser2(this.matriculeUtilisateur2);
    this.initForm();
  }

checkPossiblePermutation(){
  console.log("checking == ",this.permutationPossible);
  if(this.currentUser?.speciality?.id == this.user2?.speciality?.id &&
    this.currentUser?.corpsGrade?.id == this.user2?.corpsGrade?.id &&
    this.currentUser?.etablissement?.id != this.user2?.etablissement?.id)
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
        this.checkPossiblePermutation();
        this.spinner.hide();
      }, () => {
        this.spinner.hide();
        Swal.fire({ icon: 'error', text: 'Impossible de charger les informations de l’agent connecté.' });
      })
  }
  getUser2(matriculeUtilisateur2: string){
    this.spinner.show();
    this.permutationService.getUser2(matriculeUtilisateur2).subscribe({
      next: (data) => {
        this.user2 = data.data;
        this.checkPossiblePermutation();
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        Swal.fire({ icon: 'error', text: 'Le second agent est introuvable ou indisponible.' });
      }
  })
  }
  onSaveDemande() {
    if (this.permutationForm.invalid) {
      this.permutationForm.markAllAsTouched();
      Swal.fire({ icon: 'warning', text: 'Veuillez renseigner le motif de la permutation.' });
      return;
    }
    if (!this.permutationPossible || !this.currentUser || !this.user2) {
      Swal.fire({ icon: 'warning', text: 'Ces deux agents ne remplissent pas les conditions de permutation.' });
      return;
    }
    this.spinner.show()
    let permutation :Permutation = new Permutation()
    permutation.motifPermutation = this.permutationForm.value.motifPermutation
    permutation.matriculeUtilisateur1 = this.currentUser.matricule
    permutation.matriculeUtilisateur2 = this.user2.matricule

    this.permutationService.add(permutation).subscribe({
      next: (data) => {
        this.uploadPiecesJointes(data?.data?.id);
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

  uploadPiecesJointes(idPermutation: number | undefined) {
    if (!idPermutation || this.piecesJointesFiles.length === 0) {
      this.onDemandeSoumise();
      return;
    }
    this.fileService.storeMultipleFiles(idPermutation, 'permutationDemande', this.piecesJointesFiles)
      .subscribe({
        next: () => this.onDemandeSoumise(),
        error: () => {
          this.spinner.hide();
          Swal.fire({
            icon: 'warning',
            text: 'La demande de permutation a été soumise mais l’envoi du dossier a échoué.'
          }).then(() => {
            this.router.navigate(["gpeec/mes-demandes-mutation-permutation"]);
          });
        }
      });
  }

  onDemandeSoumise() {
    this.spinner.hide();
    Swal.fire({
      icon: "success",
      html: "La demande de permutation a été soumise avec succès.",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      this.router.navigate(["gpeec/mes-demandes-mutation-permutation"]);
    });
  }

  onSelectFiles(event: { addedFiles: any }, filesArray: File[]) {
    filesArray.push(...event.addedFiles);
  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
  }

  onReset() {
    this.router.navigate(["gpeec/mes-demandes-mutation-permutation"]);
  }
}
