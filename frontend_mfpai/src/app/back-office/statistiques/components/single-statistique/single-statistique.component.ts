import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-single-statistique',
  templateUrl: './single-statistique.component.html',
  styleUrls: ['./single-statistique.component.css']
})
export class SingleStatistiqueComponent implements OnInit, AfterContentChecked {
  
  titleStat: any;
  typeStat: any;
  
  CompetencesProfessionnelles = "Compétences professionnelles des Formateurs/Professeurs";
  FormateursQualifies = "Formateur/Professeurs formés, qualifiés, outillés et  disponibles";
  CompetencesMisesAJour = "Compétences des Formateur/Professeurs régulièrement mises à jour à travers la formation continue";
  PersonnelEncadrement = "Personnel d'encadrement disponible en quantité suffisante";
  PersonnelAdministratif = "Personnel administratif formé sur les bonnes pratiques de gestion administrative et financière";
  RenforcementCapacites = "Renforcement des capacités des ressources humaines";
  GestionRationnelle = "Gestion rationnelle et optimale des ressources humaines de la FPTA";

  graphe = [
    { id: 1, label:"Circulaire" },
    { id: 2, label:"Batônnet" }
  ];

  etablissements = [
    { id: 1, label:"Établissement 1" },
    { id: 2, label:"Établissement 2" }
  ];

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.titleStat = params['name'];
      this.typeStat = this.titleStat;
    });
  }

    private initializeSelectpicker(): void {
    // Initialiser Bootstrap-select ici
    $('#selectGraphe').selectpicker();
    $('#selectEtablissement').selectpicker();
    // Forcer la mise à jour de la vue
    this.cdr.detectChanges();
  }

  ngAfterContentChecked(): void {
   this.initializeSelectpicker();
  }
}