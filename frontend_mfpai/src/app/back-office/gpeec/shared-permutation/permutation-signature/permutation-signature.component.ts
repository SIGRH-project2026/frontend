import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { Observable, concat, toArray } from 'rxjs';
import { FileDTO } from 'src/app/back-office/carrieres/mes-demandes/components/models/FileDTO';
import { FileService } from 'src/app/shared/services/files/file.service';
import { PermutationDTO } from '../../mes-demandes-mutation-permutation/model/Permutation';
import { PermutationService } from '../../mes-demandes-mutation-permutation/service/permutation.service';
import { demandeCourante } from '../permutation-pieces-jointes/permutation-pieces-jointes.component';

type Agent = 'DEMANDEUR' | 'RECEVEUR';
type Niveau = 'CE' | 'IEF' | 'IA';

const NIVEAUX_PAR_PROFIL: { [profil: string]: Niveau } = {
  'Chef-etablissement': 'CE',
  'Chef-cfp': 'CE',
  'Chef-EFF': 'CE',
  'Représentant-IEF': 'IEF',
  'Representant-IA': 'IA',
};

/** Vrai si le profil fait partie du circuit de signature (chef d'établissement, IEF, IA). */
export function estProfilSignataire(profil: string): boolean {
  return !!NIVEAUX_PAR_PROFIL[profil];
}

/**
 * Étape de signature d'une permutation : le chef d'établissement, l'IEF puis l'IA téléchargent
 * la demande de chacun de leurs agents, la signent et la rechargent (elle remplace la précédente).
 * L'IEF et l'IA joignent en plus un bordereau de transmission.
 */
@Component({
  selector: 'app-permutation-signature',
  standalone: true,
  imports: [CommonModule, NgxDropzoneModule],
  templateUrl: './permutation-signature.component.html',
  styleUrls: ['./permutation-signature.component.css']
})
export class PermutationSignatureComponent implements OnInit {

  @Input() permutation?: PermutationDTO;
  @Input() profil!: string;

  niveau: Niveau | null = null;
  acteur: any;
  demandesSignees: { [agent: string]: File | undefined } = {};
  bordereau?: File;

  constructor(
    private readonly permutationService: PermutationService,
    private readonly fileService: FileService,
  ) { }

  ngOnInit(): void {
    this.niveau = NIVEAUX_PAR_PROFIL[this.profil] || null;
    if (this.niveau)
      this.permutationService.getCurrentUser().subscribe(data => this.acteur = data?.data);
  }

  get demandeBordereau(): boolean {
    return this.niveau === 'IEF' || this.niveau === 'IA';
  }

  // agents relevant de l'établissement, de l'IEF ou de l'IA de l'acteur connecté
  get agentsCouverts(): Agent[] {
    if (!this.permutation || !this.acteur || !this.niveau)
      return [];
    const champ = this.niveau === 'CE' ? 'etablissement' : this.niveau === 'IEF' ? 'ief' : 'ia';
    const codeActeur = this.acteur[champ]?.code;
    return (['DEMANDEUR', 'RECEVEUR'] as Agent[])
      .filter(agent => codeActeur && (this.utilisateur(agent) as any)?.[champ]?.code === codeActeur);
  }

  utilisateur(agent: Agent) {
    return agent === 'DEMANDEUR' ? this.permutation?.utilisateur1 : this.permutation?.utilisateur2;
  }

  // demande courante de l'agent : soumise par lui ou signée au niveau précédent
  demandeCourante(agent: Agent): FileDTO[] {
    return demandeCourante(this.permutation, agent);
  }

  codeSigne(agent: Agent): string {
    return this.niveau === 'CE' ? `${agent}_SIGNE` : `${agent}_SIGNE_${this.niveau}`;
  }

  dejaSignee(agent: Agent): boolean {
    return this.demandeCourante(agent).some(doc => doc.fileCode === this.codeSigne(agent));
  }

  get codeBordereau(): string {
    return `BORDEREAU_${this.niveau}_${this.agentsCouverts.join('_')}`;
  }

  get bordereauExistant(): FileDTO[] {
    return (this.permutation?.pieceJointes || []).filter(doc => doc.fileCode === this.codeBordereau);
  }

  /** Vrai quand chaque agent couvert a sa demande signée (et le bordereau pour IEF / IA). */
  get pret(): boolean {
    const agents = this.agentsCouverts;
    if (!agents.length)
      return false;
    const demandesOk = agents.every(agent => !!this.demandesSignees[agent] || this.dejaSignee(agent));
    const bordereauOk = !this.demandeBordereau || !!this.bordereau || this.bordereauExistant.length > 0;
    return demandesOk && bordereauOk;
  }

  onSelectDemande(agent: Agent, event: { addedFiles: File[] }) {
    this.demandesSignees[agent] = event.addedFiles[0];
  }

  onSelectBordereau(event: { addedFiles: File[] }) {
    this.bordereau = event.addedFiles[0];
  }

  /** Charge les demandes signées puis le bordereau, l'un après l'autre. */
  envoyer(): Observable<unknown[]> {
    const id = this.permutation!.id;
    const envois: Observable<unknown>[] = this.agentsCouverts
      .filter(agent => !!this.demandesSignees[agent])
      .map(agent => this.fileService.storeMultipleFiles(id, `permutationSigne_${agent}`, [this.demandesSignees[agent]!]));
    if (this.demandeBordereau && this.bordereau)
      envois.push(this.fileService.storeMultipleFiles(id, 'permutationBordereau', [this.bordereau]));
    return concat(...envois).pipe(toArray());
  }

  telecharger(doc: FileDTO) {
    if (doc?.generatedName)
      this.fileService.telecharger(doc.generatedName);
  }

  visualiser(doc: FileDTO) {
    if (doc?.generatedName)
      this.fileService.openPdfInNewTab(doc.generatedName);
  }
}
