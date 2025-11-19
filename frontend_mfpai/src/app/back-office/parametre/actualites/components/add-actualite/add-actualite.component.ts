import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Actualite, CategorieActualite, TypeArticle } from '../../Model/Actualite';
import { ActualiteService } from '../../service/Actualite.service';
import { PieceJointes } from 'src/app/back-office/carrieres/models/dossier-agent/pieceJointes';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-add-actualite',
  templateUrl: './add-actualite.component.html',
  styleUrls: ['./add-actualite.component.css']
})
export class AddActualiteComponent implements OnInit {

  ActuForm !: FormGroup

  piecesJointesFiles: File[] = [];

  typeArticles : TypeArticle[] = []

  categories : CategorieActualite[]=[]


  constructor(
    private location: Location,
    private _formBuilder: FormBuilder,
    private actualiteService : ActualiteService,
    private readonly spinner: NgxSpinnerService,

  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getTypes()
    this.getCategories()
  }

  getTypes(){
    this.actualiteService.getAllTypeArticle().subscribe(
      {
        next : (data : any)=>{
          console.log(data);
          this.typeArticles = data.data
        }
      }
    )
  }

  getCategories(){
    this.actualiteService.getAllCategories().subscribe(
      {
        next : (data : any)=>{
          console.log(data);
          this.categories = data.data
        }
      })
  }

  initForm(){
    this.ActuForm = this._formBuilder.group({
      titre:  ['',Validators.required],
      contenu: ['',Validators.required],
      image: ['',Validators.required],
      resume : ['',Validators.required],
      categorieActualite : ['',Validators.required],
      typeArticle : ['',Validators.required],
    })
  }

   onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
    filesArray.push(...event.addedFiles);
  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
  }

  onSave() {
    this.spinner.show()
    let actualite : Actualite
    actualite = this.ActuForm.value
    console.log("l'actu ",actualite);
   // actualite.image = this.piecesJointesFiles[0]
    
    this.actualiteService.add(actualite, this.piecesJointesFiles[0]).subscribe(
      {
        next : (data : any)=>{
          if(data.success){
            console.log(data);
            this.spinner.hide()
            Swal.fire({
              icon: 'success',
              html: 'Actualité enregistrée avec succès.',
              showConfirmButton: false,
              timer: 2000
            }).then(() => {
              this.location.back();
            })
          }else{
            this.spinner.hide()
            Swal.fire({
              icon: 'error',
              html: "Une erreur est survenue lors de l'enrégistrement de l'Actualité.",
              showConfirmButton: false,
              timer: 2000
            })
          }
        }
      }
    )


    
  }

  onReset() {
    this.location.back();
  }

}

