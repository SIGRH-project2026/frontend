import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IsAuthGuard } from "./guard/auth.guard";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () =>
      import("./back-office/authentification/authentification.module").then(
        (mod) => mod.AuthentificationModule,
      ),
  },
  {
    path: "",
    loadChildren: () =>
      import("./front-office/front-office.module").then(
        (mod) => mod.FrontOfficeModule,
      ),
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./back-office/dashboard/dashboard.module").then(
        (mod) => mod.DashboardModule,
      ),
    canActivate: [IsAuthGuard],
  },
  // Courriers
  {
    path: "courriers",
    loadChildren: () =>
      import("./back-office/formations/courriers/courriers.module").then(
        (mod) => mod.CourriersModule,
      ),
  },
  {
    path: "formations",

    loadChildren: () =>
      import("./back-office/formations/formations.module").then(
        (mod) => mod.FormationsModule,
      ),
    canActivate: [IsAuthGuard],
  },
  {
    path: "carrieres",
    loadChildren: () =>
      import("./back-office/carrieres/carrieres.module").then(
        (mod) => mod.CarrieresModule,
      ),
    canActivate: [IsAuthGuard],
  },
  {
    path: "utilisateurs",
    loadChildren: () =>
      import("./back-office/utilisateurs/utilisateurs.module").then(
        (mod) => mod.UtilisateursModule,
      ),
    canActivate: [IsAuthGuard],
  },
  {
    path: "gpeec",
    loadChildren: () =>
      import("./back-office/gpeec/gpeec.module").then((mod) => mod.GpeecModule),
    canActivate: [IsAuthGuard],
  },
  {
    path: "affaires-sociales",
    loadChildren: () =>
      import("./back-office/affaires-sociales/affaires-sociales.module").then(
        (mod) => mod.AffairesSocialesModule,
      ),
  },
  {
    path: "statistiques",
    loadChildren: () =>
      import("./back-office/statistiques/statistiques.module").then(
        (mod) => mod.StatistiquesModule,
      ),
  },
  {
    path: "plan-travail-annuel",
    loadChildren: () =>
      import("./back-office/plan-travail-annuel/plan-travail-annuel.module").then(
        (mod) => mod.PlanTravailAnnuelModule,
      ),
  },
  {
    path: "courriers",
    loadChildren: () =>
      import("./back-office/formations/courriers/courriers.module").then(
        (mod) => mod.CourriersModule,
      ),
  },
  {
    path: "settings",
    loadChildren: () =>
      import("./back-office/settings/settings.module").then(
        (mod) => mod.SettingsModule,
      ),
  },
  {
    path: "parametrage",
    loadChildren: () =>
      import("./back-office/parametre/parametre.module").then(
        (mod) => mod.ParametreModule,
      ),
  },

  {
    path: "",
    redirectTo: "",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      scrollOffset: [0, 0],
      scrollPositionRestoration: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
