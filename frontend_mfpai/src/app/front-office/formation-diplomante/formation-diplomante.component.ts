import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanFormationEtFormationService } from '../services/planFormation-formation.service';
import Swal from 'sweetalert2';
import {Formation} from "../Model/Formation";

@Component({
	selector: 'app-formation-diplomante',
	templateUrl: './formation-diplomante.component.html',
	styleUrls: ['./formation-diplomante.component.css']
})
export class FormationDiplomanteComponent implements OnInit {


  formationsAVenir: any[] = [];

	pageSize = 10;
	page = 0;
	totalPages = 0;
	size = 10;
    formations: Formation[] =[]
  type = 'DIPLOMANTE';

	collectionSize = this.formations.length;
  constructor(private router: Router,
	private planFormationEtFormationService: PlanFormationEtFormationService

	) { }

	ngOnInit(): void {
		this.getFormationsList(this.type, this.page, this.size);
	}

	onViewFormation(id: number) {
		this.router.navigateByUrl(`formations/formation-diplomante/${id}`)
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


    getFormationsList(type: string, page: number, size: number) {
	this.planFormationEtFormationService.getAllFormationByType(type, page, size).subscribe(
		data => {
		if (data?.status === 'OK') {

			this.formations = data?.payload;

			//console.log(this.formations)

			this.collectionSize = data.metadata?.totalElements ?? 0
			this.size = data.metadata?.size ?? 0


		}
	
	})


		/* return this.formationsAVenir = [
	onViewFormation(id: number) {
		this.router.navigateByUrl(`formations/formation-diplomante/${id}`)
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

	getFormationsList() {
		/* this.planFormationEtFormationService.getAllFormation(this.type).subscribe({
			next: (data) => {
				this.formations = data.data;
				console.log(data)
			}

		}) */
		/* return this.formationsAVenir = [
			{
				id: 1,
				title: 'Formation UX',
				image: 'assets/images/formation01.png',
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
				typeFormation: 'Formation diplômante',
				duree: '60heures',
				cout: '150 000 F cfa',
				participant: '06 participants'
			},
			{
				id: 3,
				title: 'Gestion des projets',
				image: 'assets/images/formation06.png',
				description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer',
				isPublishedDate: '03 avril 2024',
				typeFormation: 'Formation diplômante',
				duree: '92heures',
				cout: '250 000 F cfa',
				participant: '03 participants'
			},
			{
				id: 4,
				title: 'Electrotechnique',
				image: 'assets/images/formation04.png',
				description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer',
				isPublishedDate: '06 mai 2024',
				typeFormation: 'Formation diplômante',
				duree: '72heures',
				cout: '300 000 F cfa',
				participant: '12 participants'
			},
			{
				id: 4,
				title: 'Marketing',
				image: 'assets/images/formation02.png',
				description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer',
				isPublishedDate: '06 mai 2024',
				typeFormation: 'Formation diplômante',
				duree: '72heures',
				cout: '300 000 F cfa',
				participant: '12 participants'
			},
			{
				id: 4,
				title: 'Informatique de Gestion',
				image: 'assets/images/formation03.png',
				description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer',
				isPublishedDate: '06 mai 2024',
				typeFormation: 'Formation diplômante',
				duree: '72heures',
				cout: '300 000 F cfa',
				participant: '12 participants'
			},
		] */
	}
}
