import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanFormationEtFormationService } from '../services/planFormation-formation.service';
import Swal from 'sweetalert2';
import {Formation} from "../Model/Formation";

@Component({
	selector: 'app-single-formation',
	templateUrl: './single-formation.component.html',
	styleUrls: ['./single-formation.component.css']
})
export class SingleFormationComponent implements OnInit {

	formations: any[] = []
	idFormation !: number
	formation! : any
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private location: Location,
		private planFormationEtFormationService: PlanFormationEtFormationService

	) { }


	ngOnInit(): void {
		this.getFormationsList();
		this.idFormation = this.route.snapshot.params["dataId"]
		this.getOneFormation()

	}


	getOneFormation(){
		this.planFormationEtFormationService.getOneFormation(this.idFormation).subscribe({
			next: (data) => {
				this.formation = data;
				console.log(data);

			},

		})

	}

	onViewFormation(id: number, typeformation: string) {
		if (typeformation === 'Formation continue') {
			this.router.navigateByUrl(`formations/formation-continue/${id}`)
		} else {
			this.router.navigateByUrl(`formations/formation-diplomante/${id}`)
		}
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
				description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer',
				isPublishedDate: '03 avril 2024',
				typeFormation: 'Formation continue',
				duree: '60heures',
				cout: '150 000 F cfa',
				participant: '06 participants'
			},
		]
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
