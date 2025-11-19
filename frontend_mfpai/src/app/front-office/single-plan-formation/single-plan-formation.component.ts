import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanFormationEtFormationService } from '../services/planFormation-formation.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import Swal from "sweetalert2";


@Component({
	selector: 'app-single-plan-formation',
	templateUrl: './single-plan-formation.component.html',
	styleUrls: ['./single-plan-formation.component.css']
})
export class SinglePlanFormationComponent implements OnInit {

	planFormationList: any[] = [];
	formations: any[] = []
	planFormation : any
	apiUrl: string = environment.apiUrl;


	idPlan !: number
	themes: any
	constructor(
		private router: Router,
		private location: Location,
		private route: ActivatedRoute,
		private planFormationEtFormationService: PlanFormationEtFormationService,
		private _httpClient: HttpClient
	) { }


	ngOnInit(): void {
		this.idPlan = this.route.snapshot.params["dataId"]
		this.getFormationsList();
		this.getPlanDeFormationList();
		this.getOnePlan()
		this.getThemes()
	}

	getOnePlan(){
		this.planFormationEtFormationService.getOnePlanFormation(this.idPlan).subscribe({
			next: (data) => {
				this.planFormation = data.data;
				console.log(this.planFormation)
			},
			error: (err) => {
				console.log(err);
			}
		})
	}


	getThemes(){
		this.planFormationEtFormationService.getThemesByIdPlanFormation(this.idPlan).subscribe({
			next: (data) => {
				this.themes = data;
				console.log(this.themes)
			},
			error: (err) => {
				console.log(err);
			}
		})
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


	getFormationsList(): any[] {
		return this.formations = [
			{
				id: 1,
				title: 'Formation UI',
				image: 'assets/images/formation03.png',
				description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer',
				isPublishedDate: '06 mai 2024',
				typeFormation: 'Formation diplômante',
				duree: '72heures',
				cout: '300 000 F cfa',
				participant: '12 participants'

			},
			{
				id: 2,
				title: 'Techniques de communication',
				image: 'assets/images/formation06.png',
				description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longerThis is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer',
				isPublishedDate: '03 avril 2024',
				typeFormation: 'Formation continue',
				duree: '60heures',
				cout: '150 000 F cfa',
				participant: '06 participants'
			},
		]
	}

	getPlanDeFormationList(): any[] {
		return this.planFormationList = [
			{
				id: 1,
				title: 'Plan de formation 2022 - 2024',
				publishedDate: '02-04-2024',
				description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
				themes:3
			},
			{
				id: 2,
				title: 'Plan de formation 2020 - 2022',
				publishedDate: '02-04-2024',
				description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
				themes:2
			}
		];
	}

	onViewPlan(id: number) {
		this.router.navigateByUrl(`/formations/plan-de-formation/${id}`)
	}

	onViewFormation(id: number, typeformation: string) {
		if (typeformation === 'Formation continue') {
			this.router.navigateByUrl(`formations/formation-continue/${id}`)
		} else {
			this.router.navigateByUrl(`formations/formation-diplomante/${id}`)
		}
	}

	goBack() {
		this.location.back();
	}

	onParticipate() {
		Swal.fire({
			title: "Confirmation",
			text: "Voulez-vous participer à cette formation ?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#1D4A7B",
			cancelButtonColor: "#FF4D4F",
			confirmButtonText: "Se connecter",
			cancelButtonText: 'Annuler',
		}).then((result) => {
			if (result.isConfirmed) {
				this.router.navigateByUrl(`auth/login`);
			}
		})
	}

}

