import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CustomOptions, generateCustomOptions } from './custom-caroussel-option.interface';
import Swal from 'sweetalert2';
import { ActualiteService } from 'src/app/back-office/parametre/actualites/service/Actualite.service';
import { PlanFormationEtFormationService } from '../services/planFormation-formation.service';
import { environment } from 'src/environments/environment';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { ReferencesService } from 'src/app/services/references.service';
import { FiliereService } from 'src/app/back-office/gpeec/besoin-en-personnel/services/Filiere/filiere.service';
import { Etablissement, Utilisateur } from 'src/app/models/utilisateur';


@Component({
	selector: 'app-portail',
	templateUrl: './portail.component.html',
	styleUrls: ['./portail.component.css']
})
export class PortailComponent implements OnInit {

	countsAndIntervals: { count: number; stop: any | null; maxCount: number }[] = [
		{ count: 0, stop: null, maxCount: 100 },
		{ count: 0, stop: null, maxCount: 120 },
		{ count: 0, stop: null, maxCount: 53 },
		{ count: 0, stop: null, maxCount: 36 }
	];

	actualites: any;
	formationsCount !: number
	url = environment.apiUrl+"images/"
	etablissements !: number
	utilisateursCount !: number
	formationsAVenir: any;
	filieres !: number
	partenaires: any[] = [
		{
			id: 1,
			title: 'GIZ',
			image: 'assets/images/giz.jpg'
		}
	];

	customOptionsBanner: CustomOptions = generateCustomOptions({
		0: { items: 1 },
		400: { items: 1 },
		740: { items: 1 },
		940: { items: 1 }
	}, true);

	customOptionsActualites: CustomOptions = generateCustomOptions({
		0: { items: 1 },
		400: { items: 1 },
		740: { items: 2 },
		940: { items: 2 }
	}, false, 20);

	customOptionsFormations: CustomOptions = generateCustomOptions({
		0: { items: 1 },
		400: { items: 1 },
		740: { items: 3 },
		940: { items: 3 }
	}, false, 20);

	customOptionsPartenaires: CustomOptions = generateCustomOptions({
		0: { items: 1 },
		400: { items: 1 },
		740: { items: 3 },
		940: { items: 3 }
	}, false, 20);

	constructor(private router: Router,
		private actualiteService : ActualiteService,
		private formationService : PlanFormationEtFormationService,
		private referenceService : ReferencesService,
		private utilisateurService : UtilisateurService,
		private filiereService : FiliereService
	) { }
	ngOnInit(): void {
		this.getEtablissements();
		this.getUtilisateurs();
		this.getFilieres()
		this.getFormationsList();
		this.getActulitesList();
		this.countsAndIntervals.forEach((item: any, index: any) => {
			this.startCounting(index);
		});
	}

	getEtablissements(){
		this.referenceService.listEtablissement().subscribe(
			(data: any) => {
				if(data.success){
					this.etablissements = data.data.length;
				}
			//	console.log("Etablissements ",this.etablissements);
			})
	}

	getUtilisateurs(){
		this.utilisateurService.listUtilisateurCount().subscribe(
			(data: any) => {
			//	console.log("users ", data);
				this.utilisateursCount = data	
			}
		)
	}

	getFilieres(){
		this.filiereService.getAll().subscribe(
			(data: any) => {
				this.filieres = data.payload.length;
				//console.log("filieres ", this.filieres);
			}
		)
	}
	

	getFormationsList() {
		this.formationService.getFormations().subscribe(
			{
				next: (data) => {
					this.formationsAVenir = data;
					this.formationsCount= this.formationsAVenir.length	
					//console.log(this.formationsCount);
				}
					
			}
		)
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
				typeFormation: 'Formation continue',
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
				typeFormation: 'Formation continue',
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

	getActulitesList(){
		this.actualiteService.getAllActualiteActive().subscribe(
			{
				next: (data) => {
					if(data.success){
						this.actualites = data.data.payload;
					}
					//console.log(data);
				}
			}
		)
		/* return this.actualites = [
			{
				id: 1,
				title: 'Extrait conseil des ministres de ce mercredi 24 avril 2024',
				image: 'assets/images/actualite3.jpeg',
				createdDate: '02-04-2024',
				description: "“Le Président de la République a d’ailleurs, sous ce chapitre, donné des instructions au Premier Ministre pour accentuer les réformes visant l’amélioration de la concurrence dans ces différents secteurs d’activité et la préservation soutenue des droits des consommateurs.",
				typeActualite: 'Formation'

			},
			{
				id: 2,
				title: 'ATELIER DE RESTITUTION DES TRAVAUX D’INSTRUMENTATION POUR LE PROJET MILLE FEMMES',
				image: 'assets/images/actualite2.jpeg',
				description: 'Le lycée technique industriel Dalafosse (LTID) a abrité, ce mardi 30 avril 2024, l’atelier de restitution des travaux d’instrumentation des métiers et d’écriture de programmes VAE sous la présence effective du Ministre de la Formation Professionnelle.',
				createdDate: '02-04-2024',
				typeActualite: 'Formation'
			},
			{
				id: 3,
				title: 'JOURNÉE INTERNATIONALE DU TRAVAIL',
				image: 'assets/images/actualite1.jpeg',
				description: "À l’image de la communauté internationale, le syndicat de l’enseignement professionnel et technique ( SEPT) dirigé par M. Amar KANE, a organisé ce 1er mai à l’Ecole Nationale de Formation en Économie Familiale et Sociale (ENFEFS), une fête des travailleurs de la FPT membres dudit syndicat.",
				createdDate: '02-04-2024',
				typeActualite: 'Recrutement'
			}
		]; */
	}

	onViewActu(id: number, code : string) {
		if(code == "RECRUTEMENT"){
			this.router.navigateByUrl(`recrutement/${id}`);
		}else{
			this.router.navigateByUrl(`actualites/${id}`)
		}
	}

	getImageUrl(fileName : string) :string{

		return `${this.url}${fileName}`
	  }
	

	onViewFormation(id: number, typeformation: string) {
		//console.log("type formation ",typeformation);
		
		if (typeformation=="CONTINUE") {
			this.router.navigateByUrl(`formations/formation-continue/${id}`)
		} else {
			this.router.navigateByUrl(`formations/formation-diplomante/${id}`)
		}
	}
	// Function to handle counting and stopping intervals
	startCounting(index: any) {
		this.countsAndIntervals[index].stop = setInterval(() => {
			this.countsAndIntervals[index].count++;
			if (this.countsAndIntervals[index].count === this.countsAndIntervals[index].maxCount) {
				clearInterval(this.countsAndIntervals[index].stop);
			}
		}, 1);
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
				if(localStorage.getItem('token'))
					this.router.navigateByUrl(`dashboard`);
				else
					this.router.navigateByUrl(`auth/login`);
			}
		})
	}

}
