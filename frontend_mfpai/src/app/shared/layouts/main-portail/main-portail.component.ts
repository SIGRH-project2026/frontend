import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main-portail',
  templateUrl: './main-portail.component.html',
  styleUrls: ['./main-portail.component.css']
})
export class MainPortailComponent implements OnInit {

  openBackoffice(): void { this.router.navigate(['/auth/login']); }

  currentUser: any;

  constructor(
    private router: Router
  ) {
    this.currentUser = localStorage.getItem('currentUser');
  }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem('currentUser');
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const header = document.querySelector(".ld-navbar");
    const btnScrollToTop = document.querySelector("#btnScrollToTop");

    var timeout: any = null;

    function handleScroll() {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        if (window.scrollY > 200) {
          header?.classList.add("sticky");
          btnScrollToTop?.classList.add("show");
        } else {
          header?.classList.remove("sticky");
          btnScrollToTop?.classList.remove("show");
        }
      }, 100); // Délai de 100 ms
    }

    // Ajoutez un écouteur d'événements pour détecter le défilement de la fenêtre
    window.addEventListener('scroll', handleScroll);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  menuItems: { label: string, path: string, children: any[], type: 'link' | 'sub' }[] = [
    {
      label: 'Accueil',
      path: '/',
      children: [],
      type: 'link'
    },
    {
      label: 'Formations',
      path: '#',
      type: 'sub',
      children: [
        {
          label: 'Plan de formation triennale',
          path: '/formations/plan-de-formation',
          children: [],
          type: 'link'
        },
        {
          label: 'Formation continue',
          path: '/formations/formation-continue',
          children: [],
          type: 'link'
        },
        {
          label: 'Formation diplômante',
          path: '/formations/formation-diplomante',
          children: [],
          type: 'link'
        }
      ]
    },
    {
      label: 'Recrutement',
      path: '/recrutement',
      children: [],
      type: 'link'
    },
    {
      label: 'Actualités',
      path: '/actualites',
      children: [],
      type: 'link'
    },
    {
      label: 'Contacts',
      path: '/contact',
      children: [],
      type: 'link'
    }
  ];

  onLogout() {
    Swal.fire({
      title: 'Déconnexion',
      text: "Êtes-vous sûr de vouloir vous déconnecter ?",
      icon: 'info',
      confirmButtonColor: 'rgba(237, 173, 64, 1)',

      showCancelButton: true,
      confirmButtonText: 'Oui, me déconnecter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.router.navigate(['/auth/login']);
      }
    })
  }


}
