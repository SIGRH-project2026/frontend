import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ImputationOuBulletinService } from '../../../services/ImputationOuBulletin/ImputationOuBulletin.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import Swal from 'sweetalert2';
import { PieceJointes } from '../../../models/dossier-agent/pieceJointes';
import { CredentialsService } from 'src/app/services/credentials.service';
import { ImputationDTO } from '../../../models/dossier-agent/imputation';

@Component({
    selector: 'app-details-imputation-bulletin',
    templateUrl: './details-imputation-bulletin.component.html',
    styleUrls: ['./details-imputation-bulletin.component.css']
})
export class DetailsImputationBulletinComponent implements OnInit {

    idImputation !: number
    justificatifs !: any[]
    apiUrl: string = environment.apiUrl;
    fullYear !: number


    imputationGeneree !: PieceJointes
    imputation !:ImputationDTO

    userInfos : any
    profilConnecte : any
    profile : any
    isDRH: boolean =false;

    constructor  (
        private  location : Location,
        private route: ActivatedRoute,
        private router: Router,
        private imputationOuBulletinService : ImputationOuBulletinService,
        private _httpClient: HttpClient,
        private _credentialService: CredentialsService

    ) {
        this.userInfos = this._credentialService.getUserInfos();
        this.profilConnecte = this.userInfos.profil
        this.profile = this.profilConnecte[0].code
        if(this.profile === 'Assistant-DRH' || this.profile === 'Directeur-DRH'){
            this.isDRH = true
        }
    }

    ngOnInit(): void {
        this.idImputation = this.route.snapshot.params['id'];

        this.imputationOuBulletinService.get(this.idImputation)
            .subscribe({
                next : (data : any)=>{
                    if(data.success){
                        console.log("imputation : ",data);
                        this.imputation=data.data
                        this.justificatifs = data.data.justificatifs
                        this.fullYear = data.data.dateImputation.slice(0,4)

                        if(data.data.imputationGeneree){
                            console.log("entrer dans le if ",data.data.imputationGeneree)
                            this.getFile(data.data.imputationGeneree)
                        }

                    }

                }
            })

    }

    generate(id:number){
        let type : string
        this.imputationOuBulletinService.generate(id).subscribe({
            next :(res :any) =>{
                console.log("data generated == ",res);
                if(res.success){
                    type = res.data.typeDemande
                    this.Telecharger(res.data.imputationGeneree)
                    Swal.fire({
                        icon: 'success',
                        html: '<strong>Imputation /bulletin de visite généré avec succès</strong>',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.reload()
                    })

                }else{
                    Swal.fire({
                        icon: 'error',
                        html: '<strong> Error génération Imputation Budgetaire/Bulletin de visite </strong>',
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            }
        })
    }

    getFile(generatedName:string){
        console.log(generatedName);

        this._httpClient.get(`${this.apiUrl}file/file/${generatedName}`, {
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${localStorage.getItem("Token")}`
            },
        }).subscribe(
            (response: any) => {
                this.imputationGeneree = response
                console.log(response);

            },
            (error) => console.log(error))
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
    goBack() {
        this.location.back()
    }
}

