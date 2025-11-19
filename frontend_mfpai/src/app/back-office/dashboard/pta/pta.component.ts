import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pta',
  templateUrl: './pta.component.html',
  styleUrls: ['./pta.component.css']
})
export class PtaComponent implements OnInit {
  items: any[] = [
    { title: "Action 1", count: '24%', statut: 'Taux atteint', path: '/carrieres/dash-inputation-bulletin' },
    { title: "Action 2", count: '18%', statut: 'Taux atteint', path: '/carrieres/dash-inputation-bulletin' },
    { title: "Action 3", count: '20%', statut: 'Taux atteint', path: '/carrieres/dash-inputation-bulletin' },
    { title: "Action 4", count: '23%', statut: 'Taux atteint', path: '/carrieres/dash-inputation-bulletin' },

  ];


  constructor(
    private router: Router,
  ) {

  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');


  }




  getBackgroundColor(title: string): string {
    if (title.toLowerCase().includes('action')) {
      return 'background-pink';
    } else if (title.toLowerCase().includes('atteint')) {
      return 'background-gray';
    } else if (title.toLowerCase().includes('Taux')) {
      return 'background-green';
    }
    return '';
  }


  getIconColor(title: string): string {
    if (title.toLowerCase().includes('formations')) {
      return 'rose';
    } else if (title.toLowerCase().includes('agents')) {
      return 'gray';
    } else if (title.toLowerCase().includes('demandes')) {
      return 'green';
    }
    return 'black';
  }


  navigateTo(path: string) {
    this.router.navigateByUrl(path)
  }
}
