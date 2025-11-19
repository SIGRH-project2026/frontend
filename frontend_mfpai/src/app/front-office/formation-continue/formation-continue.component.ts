import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanFormationEtFormationService } from '../services/planFormation-formation.service';
import {Formation} from "../Model/Formation";
import Swal from "sweetalert2";

@Component({
	selector: 'app-formation-continue',
	templateUrl: './formation-continue.component.html',
	styleUrls: ['./formation-continue.component.css']
})
export class FormationContinueComponent implements OnInit {

	pageSize = 10;
	page = 0;
	totalPages = 0;
	size = 10;
	formations: Formation[] = []
	type: string = "CONTINUE"

	collectionSize = this.formations.length;

	constructor(private router: Router,
				private planFormationEtFormationService: PlanFormationEtFormationService
	) {
	}

	ngOnInit(): void {
		this.getFormationsList(this.type, this.page, this.size);
	}

	onViewFormation(id: number) {
		this.router.navigateByUrl(`formations/formation-continue/${id}`)
	}

	getFormationsList(type: string, page: number, size: number) {
		this.planFormationEtFormationService.getAllFormationByType(type, page, size).subscribe(
			data => {
				if (data?.status === 'OK') {

					this.formations = data?.payload;

					console.log(this.formations)

					this.collectionSize = data.metadata?.totalElements ?? 0
					this.size = data.metadata?.size ?? 0


				}

			})

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
