import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Contacts } from '../Model/Contacts';
import { ContactsService } from '../services/Contacts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactForm !: FormGroup

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contactService : ContactsService
  ){}

  ngOnInit(){
    this.contactForm = this._formBuilder.group({
      nomComplet : ['', Validators.required],
      email : ['', Validators.required],
      telephone : ['', Validators.required],
      commentaire : ['', Validators.required]
    })
  }


  onSave(){
    let contact = new Contacts()
    contact.nomComplet = this.contactForm.get('nomComplet')?.value
    contact.email = this.contactForm.get('email')?.value
    contact.telephone = this.contactForm.get('telephone')?.value
    contact.commentaire = this.contactForm.get('commentaire')?.value
    this.contactService.Add(contact).subscribe(
      {
        next : (data : any) => {
          console.log("contact ", data);
          
          if(data.success){
            Swal.fire({
              icon: "success",
              html: "Votre retour a été soumis avec succès.",
              showConfirmButton: false,
              timer: 2000,
            }).then(() => {
              this.router.navigate(["/"]);
            });
          }
          else{
            Swal.fire({
              html: "L'ajout de votre retour a échoué",
              icon: 'error',
              timer: 2000,
              showCancelButton: false,
              showConfirmButton: false
            })

          }
          },
          error : (error)=>{
            Swal.fire({
              html: "L'ajout de votre retour a échoué",
              icon: 'error',
              timer: 2000,
              showCancelButton: false,
              showConfirmButton: false
            })
      }
    }
    )
  }

}
