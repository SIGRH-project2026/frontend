import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { PtaService } from "../../../../../services/pta.service";
import { PlanTravailAnnuel, ActionPTA } from "../../../model/pta";
import { ResponseApi } from "../../../../../models/response-api";
import { NgxSpinnerService } from "ngx-spinner"; // Importer le spinner

@Component({
  selector: "app-view-pta",
  templateUrl: "./view-pta.component.html",
  styleUrls: ["./view-pta.component.css"],
})
export class ViewPtaComponent implements OnInit {
  headers: string[] = ["Résultat", "Taux", "Cible", "Sous Action", "Action"];
  idPTA: any;
  pta: PlanTravailAnnuel | null = null; // Initialisation à null
  actionPTA: ActionPTA[] = [];

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private ptaService: PtaService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) {
    this.idPTA = this.route.snapshot.paramMap.get("dataId");
  }

  ngOnInit(): void {
    this.showSpinner(); // Afficher le spinner au début
    this.getPTAId();
  }

  onViewSousAction(dataId: number) {
    this.router.navigate(["sous-action", dataId], {
      relativeTo: this.route.parent,
    });
    sessionStorage.setItem("actionPtaClick", "view");
  }

  goBack() {
    this.location.back();
  }
  getPTAId() {
    this.ptaService.getPTA(this.idPTA).subscribe({
      next: (response: ResponseApi) => {
        if (response.success) {
          this.pta = response.data;
          this.actionPTA = this.pta?.actionPTAs || [];
          this.actionPTA.forEach((action) => {
            action.resultActions = action.resultActions || []; // Initialiser resultActions à un tableau vide si null ou undefined
          });
          this.hideSpinner(); // Cacher le spinner après chargement
          this.cdr.detectChanges(); // Forcer la détection des changements
        }
      },
      error: (err) => {
        console.error(
          "Erreur lors de la récupération des détails du PTA :",
          err
        );
        this.hideSpinner(); // Cacher le spinner même en cas d'erreur
      },
    });
  }

  showSpinner() {
    this.spinner.show(); // Afficher le spinner
  }

  hideSpinner() {
    this.spinner.hide(); // Masquer le spinner
  }
}
