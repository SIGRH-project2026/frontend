import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanFormationEtFormationService } from '../services/planFormation-formation.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-plan-formation',
	templateUrl: './plan-formation.component.html',
	styleUrls: ['./plan-formation.component.css']
})
export class PlanFormationComponent implements OnInit {

	apiUrl: string = environment.apiUrl;
	planFormationList: any[] = [];

	constructor(private router: Router,
				private planFormationService: PlanFormationEtFormationService,
				private _httpClient: HttpClient
	) { }

	ngOnInit(): void {
		this.getPlanDeFormationList();
	}

	getPlanDeFormationList() {
		this.planFormationService.getAllPlanFormationEnCours().subscribe({
			next: (res) => {
				console.log("données plan formations ", res.data.content);
				this.planFormationList =  res.data.content;
			}
		})
		/* return this.planFormationList = [
			{
				id: 1,
				title: 'Plan de formation 2022 - 2024',
				publishedDate: '02-04-2024',
				description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
				themes: 3
			},

		]; */
	}

	onViewPlan(id: number) {
		this.router.navigateByUrl(`/formations/plan-de-formation/${id}`)
	}

	Telecharger(filename:string){

		this._httpClient.get(`${this.apiUrl}file/download/${filename}`, {
			headers: {
				'accept': '*/*',
				'Authorization': `Bearer ${localStorage.getItem("Token")}`
			},
			responseType: 'blob' // traiter la réponse comme un blob
		}).subscribe(
			(response: Blob) => {
				// Créer une URL pour le contenu blob afin de pouvoir l'ouvrir dans une nouvelle fenêtre ou le télécharger
				const blobUrl = URL.createObjectURL(response);

				// Créer un élément d'ancrage invisible dans le document
				const anchor = document.createElement('a');
				anchor.style.display = 'none';
				document.body.appendChild(anchor);

				// Définir l'URL de l'ancrage sur l'URL blob et déclencher un clic
				anchor.href = blobUrl;
				anchor.download = filename; // Nom de fichier par défaut lors du téléchargement
				anchor.click();

				// Supprimer l'ancrage du document
				document.body.removeChild(anchor);

				// Libérer l'URL blob pour libérer la mémoire
				URL.revokeObjectURL(blobUrl);
			},
			(error) => console.log(error)
		);
	}
}

