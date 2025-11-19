import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Statistiques } from '../../models/statistique.model';

@Component({
  selector: 'app-list-statistique',
  templateUrl: './list-statistique.component.html',
  styleUrls: ['./list-statistique.component.css']
})
export class ListStatistiqueComponent {

  statistiques = [
    {
      id: 1,
      label: Statistiques.CompetencesProfessionnelles,
      icon: "assets/icons/two_users.svg",
      path:"competences-professionnelles"
    },
    {
      id: 2,
      label: Statistiques.FormateursQualifies,
      icon: "assets/icons/two_users.svg",
       path:"formateurs-qualifies"
    },
    {
      id: 3,
      label: Statistiques.CompetencesMisesAJour,
      icon: "assets/icons/two_users.svg",
       path:"competences-mises-a-jour"
    },
    {
      id: 4,
      label: Statistiques.PersonnelEncadrement,
      icon: "assets/icons/two_users.svg",
       path:"personnel-encadrement"
    },
    {
      id: 5,
      label: Statistiques.PersonnelAdministratif,
      icon: "assets/icons/two_users.svg",
       path:"personnel-administratif"
    },
    {
      id: 6,
      label: Statistiques.RenforcementCapacites,
      icon: "assets/icons/two_users.svg",
       path:"renforcement-capacites"
    },
    {
      id: 7,
      label: Statistiques.GestionRationnelle,
      icon: "assets/icons/two_users.svg",
       path:"gestion-rationnelle"
    }
  ];

  constructor(
    private router:Router
  ) { }

  goDetails(name: string) {
    this.router.navigateByUrl(`/statistiques/${name}`);
    // this.router.navigateByUrl(`/statistiques/${encodeURIComponent(name)}`);
  }
}
