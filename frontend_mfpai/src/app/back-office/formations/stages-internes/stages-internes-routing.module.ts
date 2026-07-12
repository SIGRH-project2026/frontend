import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListDemandeComponent } from './components/list-demande/list-demande.component';
import { DetailDemandeComponent } from './components/detail-demande/detail-demande.component';
import { ImputerDemandeComponent } from './components/imputer-demande/imputer-demande.component';
import { DonnerAvisDemandeComponent } from './components/donner-avis-demande/donner-avis-demande.component';
import { EnregisterAttestationStageComponent } from './components/enregister-attestation-stage/enregister-attestation-stage.component';
import { EnregisterRapportStageComponent } from './components/enregister-rapport-stage/enregister-rapport-stage.component';
import { EditDemandeComponent } from './components/edit-demande/edit-demande.component';
import { NouvelleDemandeComponent } from './components/nouvelle-demande/nouvelle-demande.component';
import { AutorisationStageComponent } from './components/autorisation-stage/autorisation-stage.component';
import {IsRoleGuard} from "../../../guard/role.guard";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Stages internes'
    },
    children: [
      // Routing list des stages internes
      {
        path: '',
        component: ListDemandeComponent,
        canActivate: [IsRoleGuard],
        data: {
          role: [
            'ADMIN-DRH',
            'Chef-division-dfc',
            'Chef-division-dgpeec',
            'Chef-division-dgcaa',
            'Chef-division-das',
            'Directeur-DRH',
            'Chef-bureau-dfc',
            'Agent-bureau-dfc',
          ],
          breadcrumb: 'Liste des demandes'
        },
      },
      {
        path: 'create-demande',
        component: NouvelleDemandeComponent,
        data: {
          role: [
            'ADMIN-DRH',
            'Chef-division-dfc',
            'Directeur-DRH',
            'Chef-bureau-dfc',
            'Agent-bureau-dfc',
          ],
          breadcrumb: 'Formulaire de création'
        },
      },
      {
        path: 'detail-view/:dataId',
        component: DetailDemandeComponent,
        data: {
          role: [
            'ADMIN-DRH',
            'Chef-division-dfc',
            'Directeur-DRH',
            'Chef-bureau-dfc',
            'Agent-bureau-dfc',
          ],
          breadcrumb: 'Détail demande'
        },
      },
      {
        path: 'edit-demande/:dataId',
        component: EditDemandeComponent,
        data: {
          role: [
            'Chef-division-dfc',
            'Directeur-DRH',
            'Chef-bureau-dfc',
            'Agent-bureau-dfc',
          ],
          breadcrumb: 'Formulaire de modification'
        },
      },
      {
        path: 'imputer-demande/:dataId',
        component: ImputerDemandeComponent,
        data: {
          role: [
            'ADMIN-DRH',
            'Chef-division-dfc',
            'Directeur-DRH',
            'Chef-bureau-dfc',
            'Agent-bureau-dfc',
          ],
          breadcrumb: 'Formulaire de traitement'
        },
      },
      {
        path: 'donner-avis/:dataId',
        component: DonnerAvisDemandeComponent,
        data: {
          role: [
            'ADMIN-DRH',
            'Chef-division-dfc',
            'Directeur-DRH',
            'Chef-bureau-dfc',
            'Agent-bureau-dfc',
          ],
          breadcrumb: 'Formulaire de traitement'
        },
      },
      {
        path: 'rapport-stage/:dataId',
        component: EnregisterRapportStageComponent,
        data: {
          role: [
            'ADMIN-DRH',
            'Chef-division-dfc',
            'Directeur-DRH',
            'Chef-bureau-dfc',
            'Agent-bureau-dfc',
          ],
          breadcrumb: 'Formulaire d’enregistrement'
        },
      },
      {
        path: 'attestation-stage/:dataId',
        component: EnregisterAttestationStageComponent,
        data: {
          role: [
            'ADMIN-DRH',
            'Chef-division-dfc',
            'Directeur-DRH',
            'Chef-bureau-dfc',
            'Agent-bureau-dfc',
          ],
          breadcrumb: 'Formulaire d’enregistrement'
        },
      },
      {
        path: 'autorisation-stage/:dataId',
        component: AutorisationStageComponent,
        data: {
          role: [
            'ADMIN-DRH',
            'Chef-division-dfc',
            'Directeur-DRH',
            'Chef-bureau-dfc',
            'Agent-bureau-dfc',
          ],
          breadcrumb: 'Formulaire d’enregistrement'
        },
      },
      { path: '', redirectTo: '', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StagesInternesRoutingModule { }
