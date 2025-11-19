import {Component, OnInit} from '@angular/core';
import {CredentialsService} from "../../services/credentials.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../shared/commons/alert.service";


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

    activeSection: string = '';
    userInfos: any;
    sections = [
        { title: 'Formation Continue', icon: 'fa-graduation-cap', count: 7, route: 'DFC' , role :[
                'Chef-division-dfc',
                'Chef-division-das',
                'Directeur-DRH',
                'Chef-service',
                'Chef-division-dgcaa',
                'Chef-division-dgpeec',
            ], canSee: true },
        { title: 'Mutations/Permutations', icon: 'fa-solid fa-hand-holding', count: 9, route: 'DGPEEC', role :[
                'Chef-etablissement',
                'Chef-EFF',
                'Chef-cfp',
                'Chef-service',
                'Chef-division-dgcaa',
                'Chef-division-dgpeec',
                'Chef-division-dfc',
                'Chef-division-das',
                'Directeur-DRH',
                'Representant-IA',
                'Représentant-IEF'
            ], canSee: true },
        { title: 'Demandes d\'actes', icon: 'fa-solid fa-user', count: 5, route: 'DGCAA' , role :[
                'Chef-EFF',
                'Chef-cfp',
                'Chef-etablissement',
                'Directeur-DRH',
                'Representant-IA',
                'Représentant-IEF',
                'Chef-division-dgcaa',
                'Chef-division-dgpeec',
                'Chef-division-dfc',
                'Chef-division-das',
                'Chef-service',
            ], canSee: true },
        { title: 'COURRIER DRH', icon: 'fa-solid fa-envelopes-bulk', count: 2, route: 'DRH' , role :[
                'Chef-division-dfc',
                'Chef-division-das',
                'Directeur-DRH',
                'Chef-division-dgcaa',
                'Chef-division-dgpeec',
                'Assistant-DRH'
            ], canSee: true },
        { title: 'Imputations', icon: 'fa-solid fa-people-arrows', count: 5, route:'Affaire-sociales', role :[
                'Chef-EFF',
                'Chef-cfp',
                'Chef-etablissement',
                'Directeur-DRH',
                'Representant-IA',
                'Représentant-IEF',
                'Chef-division-dgcaa',
                'Chef-division-dgpeec',
                'Chef-division-dfc',
                'Chef-division-das',
                'Chef-service',
            ], canSee: true  },

       /* { title: 'PTA', icon: 'fa-solid fa-people-arrows', count: 5, route: 'PTA', role: [
                'ADMIN-DRH',
                'Directeur-DRH',
                'Coordinateur',
                'Chef-division-dgcaa',
                'Chef-division-dgpeec',
                'Chef-division-dfc',
                'Chef-division-das',
                'Chef-service',
            ], canSee: true },

        */
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private credentialSercice: CredentialsService,
        private alertService: AlertService
    ) {
    }


    role: string | undefined;


    ngOnInit(): void {
        this.role = this.credentialSercice.getUserInfos()?.profil[0].code
        //console.log({pro:this.role});

    }

    canSeeDFC(){
        let roles = [
            'Chef-division-dfc',
            'Chef-division-das',
            'Directeur-DRH',
            'Chef-service',
            'Chef-etablissement',
            'Representant-IA',
            'Représentant-IEF',
            'Chef-division-dgcaa',
            'Chef-division-dgpeec',
            'Directeur-CFP',
            'Directeur-EFF'
        ]
        return roles.includes(this.role || '');
    }

    canSeeCourrierDRH(){
        let roles = [
            'Chef-division-dfc',
            'Chef-division-das',
            'Directeur-DRH',
            'Chef-service',
            'Chef-division-dgcaa',
            'Chef-division-dgpeec',
        ]
        return roles.includes(this.role || '');
    }

    isCentralUser(){
        //-Formations planifiées
        // -Formations en cours d'éxecution
        // -Formations Cloturées
        // -Nbre agents formés
        let roles = [
            'Chef-division-dfc',
            'Chef-division-das',
            'Directeur-DRH',
            'Chef-service',
            'Chef-division-dgcaa',
            'Chef-division-dgpeec',
        ]
        return roles.includes(this.role || '');

    }



    onView(sectionRoute: string) {
        // if ((!this.canSeeDFC() && sectionRoute === 'DFC') || (!this.isCentralUser() && sectionRoute === 'DRH')){
        //   this.alertService.showAlert({titre: 'Access DFC', status: 'EXCEPTION', message: "Vous n'avez pas la permission d'accéder à cette ressource !"})
        // }else{
        this.activeSection = sectionRoute;
        this.router.navigate([sectionRoute], { relativeTo: this.route.parent });
        // }
    }
    viewBox(item : any) : boolean{

        let prof = item.role.find((pro : any) =>((pro === this.role)))
        if(prof)
            return true
        return false
    }
}
