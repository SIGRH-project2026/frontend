import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CredentialsService } from "../../../services/credentials.service";
import { ReferencesService } from 'src/app/services/references.service';
import { ResponseApi2 } from '../../models/ResponseApi';
import { NotificationService } from '../../services/notification/notification.service';
import { WebSocketService } from '../../services/notification/web-socket.service';
import { AlertService } from '../../commons/alert.service';
import { log } from 'node:console';


interface Menu {
  icon?: string;
  menPath: string;
  menTitle: string;
  menType: string;
  menIconType: string;
  role: string[];

  children?: {
    menPath: string;
    menTitle: string;
    menType: string;
    role: string[];
  }[];
}


interface IMenu {
  menTitle: string;
  icon: string;

  type: 'link' | 'sub';
  role: string[];
  path: string;
  childrens?: {
    menTitle: string;
    path: string,
    role: string[];
  }[],
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit {
 
  menuItems: Menu[] = [];
  // menuItems: IMenu[] = [];
  userInfos: any;
  profilConnecte : any
  profile : any
  profileId : any
  idUser: any;
  page = 1
  size = 3
  collectionSize1 = 0;
  notifications : any[] = []
  notificationsLength = 0
  constructor(private sanitizer: DomSanitizer, 
              private router: Router,
              private credentialsService: CredentialsService,
              private readonly referenceService : ReferencesService,
              private readonly webSocketService : WebSocketService,
              private readonly notificationService : NotificationService,
              private alertService: AlertService,
    
  ) { 
    this.userInfos = this.credentialsService.getUserInfos();
    this.profilConnecte = this.userInfos.profil
    this.profileId = this.profilConnecte[0].id
    this.idUser = this.userInfos.id
   
    
    this.notificationService.listenNotify().subscribe(() => {

      this.notificationsLength = this.notificationService.nbrDeNotification()
    });
  }

  ngOnInit(): void {
    
    const $button = document.querySelector('#sidebar-toggle');
    const $wrapper = document.querySelector('#wrapper');

    $button?.addEventListener('click', (e) => {
      e.preventDefault();
      $wrapper?.classList.toggle('toggled');
    });

    this.userInfos = this.credentialsService.getUserInfos();
    const menuProfileItems= this.userInfos;
    this.getMenus()
    this.getAllNotification()
    this.notificationService.listenNotify().subscribe(() => {
      this.notificationsLength = this.notificationService.nbrDeNotification()
    });
  }

  getMenus(){
   // this.menuItems = MENUITEMS

    this.referenceService.getMenus(this.profileId)
         .subscribe((data : any) =>{
          console.log("data", data)
          this.menuItems = this.sortMenus(this.normalizeMenus(data))
         })
  }

  /**
   * Les intitulés de menu viennent de la base et certains ont été enregistrés
   * avec un mauvais décodage UTF-8 (ex. « ParamÃ©trage »). Les chemins restent
   * la référence fiable : on reprend le libellé local lorsqu'il existe et on
   * répare les autres valeurs reçues de l'API.
   */
  private normalizeMenus(menus: Menu[]): Menu[] {
    const localTitles = new Map<string, string>();

    const indexLocalTitles = (items: Menu[]) => {
      items.forEach(item => {
        // Plusieurs menus parents utilisent « # » : ce chemin n'est donc pas
        // une clé unique et leur titre doit être réparé directement.
        if (item.menPath !== '#' && !localTitles.has(item.menPath)) {
          localTitles.set(item.menPath, item.menTitle);
        }
        if (item.children?.length) {
          indexLocalTitles(item.children as Menu[]);
        }
      });
    };

    const normalize = (items: Menu[]): Menu[] => items.map(item => ({
      ...item,
      menTitle: localTitles.get(item.menPath) ?? this.repairMojibake(item.menTitle),
      children: item.children?.length ? normalize(item.children as Menu[]) : item.children,
    }));

    indexLocalTitles(MENUITEMS);
    return normalize(menus);
  }

  private repairMojibake(value: string): string {
    if (!value || !/[ÃÂâ]/.test(value)) {
      return value;
    }

    try {
      const bytes = Uint8Array.from(value, character => character.charCodeAt(0));
      return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    } catch {
      return value;
    }
  }


  private order = [113, 100, 137, 114, 130, 103, 106, 108, 126, 138];

  private sortMenus(menus: any[]): any[] {
    // Fonction de comparaison pour l'ordre personnalisé
    const compareFn = (a: any, b: any) => {
      return this.order.indexOf(a.menId) - this.order.indexOf(b.menId);
    };

    // Trier les menus
    menus.sort(compareFn);

    // Trier les sous-menus de chaque menu
    // menus.forEach(menu => {
    //   if (menu.children && menu.children.length) {
    //     menu.children.sort(compareFn);
    //   }
    // });



    return menus;
  }


  sanitizeIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }


  // isSubMenuActive(menu: any): boolean {
  //     // Check if any of the submenu's child links are active
  //     return menu.children.some((subMenu: any) =>
  //         this.router.isActive(subMenu.menPath, false)
  //     );
  // }

  // Assuming this function is inside your component class
  isSubMenuActive(menu: any): boolean {
    // Check if any of the submenu's child links are active
    return menu.children.some((subMenu: any) =>
        this.router.isActive(subMenu.menPath, false)
    );
  }


  getMenTitle(menTitle: string) {

    if (menTitle === 'Stages internes') {
      sessionStorage.setItem('statutDemandeStage', 'ALL');
    }
    if (menTitle === 'AUTORISER') {

    }
  }

  getMenuCourrier(menTitle: string) {
    if (menTitle === 'Courrier DRH') {
      sessionStorage.setItem('statutCourrier', 'ALL');
    }
  }




  onLogout() {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir vous déconnecter ?",
      icon: 'info',
      confirmButtonColor: 'rgba(29, 74, 123, 1)',

      showCancelButton: true,
      confirmButtonText: 'Oui, me déconnecter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // localStorage.removeItem('currentUser');
        // this.currentUser = null;
        this.credentialsService.logout();
        this.router.navigate(['/auth/login']);
      }
    })
  }
// Gestion des notifications
getAllNotification(){
    //notifications persistées
    this.notificationService.getNotifications( this.idUser, this.page-1, this.size, this.profilConnecte[0].code)
        .subscribe({
          next : (data : ResponseApi2) =>{
            if(data.status?.includes("OK"))
              this.notifications = data.payload
           // console.log(this.notifications)
             if(data.metadata)
               this.collectionSize1 = data.metadata.totalElements
        //    this.notificationsLength = this.notifications[0].notReads
          this.notificationService.updateNbre(this.notifications[0]?.notReads)
          },
        })
  //notifications en temps réel
  this.webSocketService.connect().subscribe((data: any) => {
    const jsonObject = JSON.parse(data);
        this.notifications.unshift(jsonObject)
        this.collectionSize1 ++
        this.notificationsLength ++
        this.notificationService.updateNbre(this.notifications[1]?.notReads +1)
        this.alertService.showAlert({
          status: 'INFO',
          message: jsonObject.message,
          titre: jsonObject.objet
        });
    });
}

}

interface Notification{
  objet : string
  message : string
}


const MENUITEMS: Menu[] = [
  {
    menTitle: 'Tableau de bord',
    menIconType: 'assets/icons/dashboard.svg',
    menType: 'link',
    menPath: '/dashboard',
    role: ['ADMIN-DRH', 'Admin-General'],
  },

  {
    menTitle: 'Administration',
    menIconType: 'assets/icons/users.svg',
    menType: 'sub',
    menPath: '#',
    role: ['ADMIN-DRH', 'Admin-General'],
    children: [
      {
        menTitle: 'Niveau central',
        menPath: '/utilisateurs/niveau-central',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'Niveau déconcentré',
        menPath: '/utilisateurs/niveau-deconcentre',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'Recherche globale',
        menPath: '/utilisateurs/recherche-globale',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'Paramétrage',
        menPath: '/utilisateurs/parametrage',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
    ],
  },
  {
    menTitle: 'Plan de travail annuel',
    menIconType: 'assets/icons/users.svg',
    menType: 'sub',
    menPath: '#',
    role: ['ADMIN-DRH', 'Admin-General'],
    children: [
      {
        menTitle: 'PTA',
        menPath: '/plan-travail-annuel/pta',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General', 'Assistant-DRH', 'Chef-division-dfc', 'Agent-bureau-dfc', 'Chef-division-dgcaa', 'Chef-bureau-dgcaa', 'Agent-bureau-dgcaa', 'Chef-division-dgpeec', 'Chef-bureau-dgpeec', 'Agent-bureau-dgpeec', 'Chef-service', 'Coordinateur', 'Gestionnaire', 'Agent', 'Chef-bureau-af', 'Chef-etablissement', 'Representant-IA', 'Représentant-IEF', 'Representant-BFPA', 'Formateurs', 'Chef-cfp', 'Professeur'],
      },
      {
        menTitle: 'Paramètres',
        menPath: '/utilisateurs/niveau-central',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
     

    ],
  },
  {
    menTitle: 'Gestion des formations',
    menIconType: 'assets/icons/formations.svg',
    menType: 'sub',
    menPath: '#',
    role: ['ADMIN-DRH', 'Admin-General', 'Assistant-DRH', 'Chef-division-dfc', 'Agent-bureau-dfc', 'Chef-division-dgcaa', 'Chef-bureau-dgcaa', 'Agent-bureau-dgcaa', 'Chef-division-dgpeec', 'Chef-bureau-dgpeec', 'Agent-bureau-dgpeec', 'Chef-service', 'Coordinateur', 'Gestionnaire', 'Agent', 'Chef-bureau-af', 'Chef-etablissement', 'Representant-IA', 'Représentant-IEF', 'Representant-BFPA', 'Formateurs', 'Chef-cfp', 'Professeur'],
    children: [
      {
        menTitle: 'Expression de besoins',
        menPath: '/formations/expression-besoins',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General', 'Chef-division-dfc', 'Agent-bureau-dfc'],
      },
      {
        menTitle: 'Plan de formation',
        menPath: '/formations/plan-formation',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General', 'Chef-division-dgcaa', 'Chef-service'],
      },
      {
        menTitle: 'Liste des formations',
        menPath: '/formations/liste-des-formations',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General', 'Chef-division-dgcaa', 'Chef-service', 'Chef-division-dgpeec'],
      },
      {
        menTitle: 'Mes formations',
        menPath: '/formations/mes-formations',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General', 'Assistant-DRH', 'Chef-division-dfc', 'Chef-division-dgcaa', 'Agent-bureau-dfc', 'Chef-bureau-dgcaa', 'Agent-bureau-dgcaa', 'Chef-division-dgpeec', 'Chef-bureau-dgpeec', 'Agent-bureau-dgpeec', 'Chef-service', 'Coordinateur', 'Gestionnaire', 'Agent', 'Chef-bureau-af', 'Chef-etablissement', 'Representant-IA', 'Représentant-IEF', 'Representant-BFPA', 'Formateurs', 'Chef-cfp', 'Professeur'],
      },
      {
        menTitle: 'Demandes de formation',
        menPath: '/formations/demandes-de-formation',
        menType: 'link',
        role: ['Chef-division-dgcaa', 'Chef-service', 'Chef-division-dgpeec'],
      },
      {
        menTitle: 'Courriers',
        menPath: '/formations/courriers',
        menType: 'link',
        role: ['Chef-division-dfc', 'Agent-bureau-dfc', 'Chef-bureau-buco'],
      },
      {
        menTitle: 'Stages internes',
        menPath: '/formations/stages-internes',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General', 'Chef-division-dfc', 'Chef-division-dgcaa', 'Agent-bureau-dfc', 'Chef-bureau-dgcaa', 'Agent-bureau-dgcaa', 'Chef-division-dgpeec', 'Chef-bureau-dgpeec', 'Agent-bureau-dgpeec'],
      },
    ],
  },
  {
    menTitle: 'Paramétrage',
    menIconType: 'assets/icons/setting.svg',
    menType: 'sub',
    menPath: '#',
    role: ['ADMIN-DRH', 'Admin-General', 'Assistant-DRH', 'Chef-division-dfc', 'Agent-bureau-dfc', 'Chef-division-dgcaa', 'Chef-bureau-dgcaa', 'Agent-bureau-dgcaa', 'Chef-division-dgpeec', 'Chef-bureau-dgpeec', 'Agent-bureau-dgpeec', 'Chef-service', 'Coordinateur', 'Gestionnaire', 'Agent', 'Chef-bureau-af', 'Chef-etablissement', 'Representant-IA', 'Représentant-IEF', 'Representant-BFPA', 'Formateurs', 'Chef-cfp', 'Professeur'],
    children: [
      {
        menTitle: 'Actualités',
        menPath: '/parametrage/actualites',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'Recrutements',
        menPath: '/parametrage/recrutement',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'Directions',
        menPath: '/parametrage/directions',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'Divisions / Bureaux',
        menPath: '/parametrage/division-bureaux',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'Divisions',
        menPath: '/parametrage/divisions',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'Bureaux',
        menPath: '/parametrage/bureaux',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'IA',
        menPath: '/parametrage/ia',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'IEF',
        menPath: '/parametrage/ief',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'Établissements',
        menPath: '/parametrage/etablissement',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'Spécialités',
        menPath: '/parametrage/specialite',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'Fonctions',
        menPath: '/parametrage/fonction',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'Corps et grades',
        menPath: '/parametrage/corp-grade',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
   

    ],
  },
  {
    menTitle: 'Gestion Carrières',
    menIconType: 'assets/icons/carrieres.svg',
    menType: 'sub',
    menPath: '#',
    role: ['ADMIN-DRH', 'Admin-General'],
    children: [
      {
        menTitle: 'Mon dossier',
        menPath: '/carrieres/mon-dossier',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General', 'Assistant-DRH', 'Chef-division-dfc', 'Agent-bureau-dfc', 'Chef-division-dgcaa', 'Chef-bureau-dgcaa', 'Agent-bureau-dgcaa', 'Chef-division-dgpeec', 'Chef-bureau-dgpeec', 'Agent-bureau-dgpeec', 'Chef-service', 'Coordinateur', 'Gestionnaire', 'Agent', 'Chef-bureau-af', 'Chef-etablissement', 'Representant-IA', 'Représentant-IEF', 'Representant-BFPA', 'Formateurs', 'Chef-cfp', 'Professeur'],
      },
      {
        menTitle: 'Dossier agents',
        menPath: '/carrieres/dossier-agents',
        menType: 'link',
        role: [ 'Admin-General', 'Assistant-DRH', 'Chef-division-dgcaa', 'Chef-bureau-dgcaa'],
      },
      {
        menTitle: 'Mes demandes',
        menPath: '/carrieres/mes-demandes',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General', 'Assistant-DRH', 'Chef-division-dfc', 'Agent-bureau-dfc', 'Chef-division-dgcaa', 'Chef-bureau-dgcaa', 'Agent-bureau-dgcaa', 'Chef-division-dgpeec', 'Chef-bureau-dgpeec', 'Agent-bureau-dgpeec', 'Chef-service', 'Coordinateur', 'Gestionnaire', 'Agent', 'Chef-bureau-af', 'Chef-etablissement', 'Representant-IA', 'Représentant-IEF', 'Representant-BFPA', 'Formateurs', 'Chef-cfp', 'Professeur'],
      },
      {
        menTitle: 'Demandes reçues',
        menPath: '/carrieres/demandes-recues',
        menType: 'link',
        role: [ 'Admin-General', 'Chef-division-dgcaa', 'Chef-bureau-af'],
      },
      {
        menTitle: 'Sortie temporaire',
        menPath: '/carrieres/sortie-temporaire',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General', 'Chef-division-dgcaa', 'Chef-bureau-dgcaa'],
      },
      {
        menTitle: 'Sortie définitive',
        menPath: '/carrieres/sortie-definitive',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General', 'Chef-division-dgcaa', 'Chef-bureau-dgcaa'],
      },
      {
        menTitle: 'Imputation/Bulletin',
        menPath: '/carrieres/inputation-bulletin',
        menType: 'link',
        role: [ 'ADMIN-DRH', 'Admin-General', 'Chef-division-dgcaa', 'Chef-bureau-dgcaa', 'Agent-bureau-dgcaa', 'Agent-bureau-dgpeec', 'Representant-IA', 'Représentant-IEF'],
      },
    ],
  },
  {
    menTitle: 'GPEEC',
    menIconType: 'assets/icons/gpeec.svg',
    menType: 'sub',
    menPath: '#',
    role: ['ADMIN-DRH', 'Admin-General', 'Chef-division-dgpeec', 'Chef-bureau-dgpeec', 'Agent-bureau-dgpeec', 'Chef-service', 'Chef-etablissement'],
    children: [
      {
        menTitle: 'Personnel',
        menPath: '/gpeec/personnel',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'Fiche établissement',
        menPath: '/gpeec/fiche-etablissement',
        menType: 'link',
        role: [ 'Admin-General', 'Chef-etablissement'],
      },
      {
        menTitle: 'Besoins en personnel',
        menPath: '/gpeec/besoin-en-personnel',
        menType: 'link',
        role: [ 'Admin-General', 'Chef-service', 'Chef-etablissement'],
      },
      {
        menTitle: 'Besoins en personnel reçus',
        menPath: '/gpeec/besoin-en-personnel-recus',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General', 'Chef-division-dgpeec', 'Chef-bureau-dgpeec', 'Agent-bureau-dgpeec'],
      },
      {
        menTitle: 'Demande Mutation/Permutation',
        menPath: '/gpeec/mes-demandes-mutation-permutation',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'Demandes de Permutations reçues',
        menPath: '/gpeec/mes-demande-permutation-recues',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
      {
        menTitle: 'Traitement Mutation/Permutation',
        menPath: '/gpeec/demande-mutation-permutation-recues',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General'],
      },
    ],
  },
  {
    menTitle: 'Courrier DRH',
    menIconType: 'assets/icons/courrier.svg',
    menPath: '/courriers',
    menType: 'link',
    role: ['ADMIN-DRH', 'Admin-General'],
  },
  {
    menTitle: 'Affaires sociales',
    menIconType: 'assets/icons/affaires-sociales.svg',
    menType: 'sub',
    menPath: '#',
    role: ['ADMIN-DRH', 'Admin-General'],
    children: [
      {
        menTitle: 'Mes demandes',
        menPath: '/affaires-sociales/mes-demandes',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General', 'Assistant-DRH', 'Agent-bureau-dfc', 'Chef-division-dgcaa', 'Chef-bureau-dgcaa', 'Agent-bureau-dgcaa', 'Chef-division-dgpeec', 'Chef-bureau-dgpeec', 'Agent-bureau-dgpeec', 'Chef-service', 'Coordinateur', 'Gestionnaire', 'Agent', 'Chef-bureau-af', 'Chef-etablissement', 'Representant-IA', 'Représentant-IEF', 'Representant-BFPA', 'Formateurs', 'Chef-cfp', 'Professeur'],
      },
    ],
  },
  {
    menTitle: 'Affaires sociales',
    menIconType: 'assets/icons/affaires-sociales.svg',
    menType: 'sub',
    menPath: '#',
    role: ['ADMIN-DRH', 'Admin-General'],
    children: [
      {
        menTitle: 'Mes demandes',
        menPath: '/affaires-sociales/mes-demandes',
        menType: 'link',
        role: ['ADMIN-DRH', 'Admin-General', 'Assistant-DRH', 'Agent-bureau-dfc', 'Chef-division-dgcaa', 'Chef-bureau-dgcaa', 'Agent-bureau-dgcaa', 'Chef-division-dgpeec', 'Chef-bureau-dgpeec', 'Agent-bureau-dgpeec', 'Chef-service', 'Coordinateur', 'Gestionnaire', 'Agent', 'Chef-bureau-af', 'Chef-etablissement', 'Representant-IA', 'Représentant-IEF', 'Representant-BFPA', 'Formateurs', 'Chef-cfp', 'Professeur'],
      },
    ],
  },
];
