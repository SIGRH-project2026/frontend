import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/shared/layouts/main/main.component';
import { ListEtablissementComponent } from './components/list-etablissement/list-etablissement.component';
import { AddEtablissementComponent } from './components/add-etablissement/add-etablissement.component';
import { EditEtablissementComponent } from './components/edit-etablissement/edit-etablissement.component';

const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    data: {
      breadcrumb: "Etablissement",
    },
    children: [
      // Routing list expression
      {
        path: "",
        component: ListEtablissementComponent,
        // canActivate: [IsRoleGuard],
        data: {
          role: [
            "Chef-etablissement",
            "Chef-division-dgpeec",
            "Directeur-DRH",
            "Admin-General",
          ],
          breadcrumb: "",
        },
      },
      {
        path: "add-etablissement",
        component: AddEtablissementComponent,
        // canActivate: [IsRoleGuard],
        data: {
          role: [
            "Chef-etablissement",
            "Chef-division-dgpeec",
            "Directeur-DRH",
            "Admin-General",
          ],
          breadcrumb: "",
        },
      },

      {
        path: ":dataId/edit-etablissement",
        component: EditEtablissementComponent,
        // canActivate: [IsRoleGuard],
        data: {
          role: [
            "Chef-etablissement",
            "Chef-division-dgpeec",
            "Directeur-DRH",
            "Admin-General",
          ],
          breadcrumb: "",
        },
      },

      // Routing creation expression

      { path: "", redirectTo: "actulite", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtablissementRoutingModule { }
