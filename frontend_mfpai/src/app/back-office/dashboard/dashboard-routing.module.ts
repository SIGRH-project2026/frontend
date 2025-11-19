import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "../../shared/layouts/main/main.component";
import {DashboardComponent} from "./dashboard.component";
import { DFCDASHBOARDComponent } from './dfc-dashboard/dfc-dashboard.component';
import { DGPEECDASHBOARDComponent } from './dgpeec-dashboard/dgpeec-dashboard.component';
import { CourrierDRHDaschboardComponent } from './courrier-drh-daschboard/courrier-drh-daschboard.component';
import { DgcaaComponent } from './dgcaa/dgcaa.component';
import { AffairesSocialesComponent } from './affaires-sociales/affaires-sociales.component';
import {IsRoleGuard} from "../../guard/role.guard";
import {PtaComponent} from "./pta/pta.component";


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Tableau de bord '
    },
    children:[
      {
        path: '',
        component: DashboardComponent,
        data: {
          breadcrumb: ''
        },

        children:[
          {
            path : 'DFC',
            canActivate: [IsRoleGuard],
            component : DFCDASHBOARDComponent,
            data : {
              role : [
                'Chef-division-dfc',
                'Chef-division-das',
                'Directeur-DRH',
                'Chef-service',
                'Chef-division-dgcaa',
                'Chef-division-dgpeec',

              ]
            }

          },
          {
            path : 'DGPEEC',
            component : DGPEECDASHBOARDComponent,
            data : {
              role : [
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
              ]
            }
          },
          {
            path : 'DRH',
            canActivate: [IsRoleGuard],
            component : CourrierDRHDaschboardComponent,
            data: {
              role: [
                'Chef-division-dfc',
                'Chef-division-das',
                'Directeur-DRH',
                'Chef-service',
                'Chef-division-dgcaa',
                'Chef-division-dgpeec',
              ],
              breadcrumb: ''
            },
          },
          {
            path : 'DGCAA',
            canActivate: [IsRoleGuard],
            component : DgcaaComponent,
            data: {
              role: [
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
              ],
              breadcrumb: ''
            },

          },
          {
            path : 'Affaire-sociales',
            canActivate: [IsRoleGuard],
            component : AffairesSocialesComponent,
            data: {
              role: [
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
              ],
              breadcrumb: ''
            },
          },
          {
            path : 'PTA',
            canActivate: [IsRoleGuard],
            component : PtaComponent,
            data: {
              role: [
                'ADMIN-DRH',
                'Directeur-DRH',
                'Coordinateur',
                'Chef-division-dgcaa',
                'Chef-division-dgpeec',
                'Chef-division-dfc',
                'Chef-division-das',
                'Chef-service',
              ],
              breadcrumb: ''
            },
          },
        ]

      },


      { path: '', redirectTo: '', pathMatch: 'full' },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
