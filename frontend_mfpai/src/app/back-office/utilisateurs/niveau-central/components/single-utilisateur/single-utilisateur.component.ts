import {Component, OnInit} from '@angular/core';
import {UtilisateurService} from "../../../../../services/utilisateur.service";

@Component({
  selector: 'app-single-utilisateur',
  templateUrl: './single-utilisateur.component.html',
  styleUrls: ['./single-utilisateur.component.css']
})
export class SingleUtilisateurComponent  implements OnInit{

  constructor(private userService: UtilisateurService) {
  }

  ngOnInit(): void {
  }

}
