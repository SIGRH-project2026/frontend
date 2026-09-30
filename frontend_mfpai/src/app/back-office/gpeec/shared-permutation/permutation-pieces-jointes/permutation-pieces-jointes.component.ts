import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FileDTO } from 'src/app/back-office/carrieres/mes-demandes/components/models/FileDTO';
import { FileService } from 'src/app/shared/services/files/file.service';
import { PermutationDTO } from '../../mes-demandes-mutation-permutation/model/Permutation';

/**
 * Demande courante d'un agent (DEMANDEUR / RECEVEUR) : chaque niveau recharge la même demande signée,
 * seule la version la plus avancée est retenue.
 */
export function demandeCourante(permutation: PermutationDTO | undefined, codeAgent: string): FileDTO[] {
  const docs = permutation?.pieceJointes || [];
  for (const code of [`${codeAgent}_SIGNE_IA`, `${codeAgent}_SIGNE_IEF`, `${codeAgent}_SIGNE`, codeAgent]) {
    const versions = docs.filter(doc => doc.fileCode === code);
    if (versions.length)
      return versions;
  }
  return [];
}

/**
 * Affiche les dossiers joints par les deux agents d'une permutation
 * (fileCode DEMANDEUR pour utilisateur1, RECEVEUR pour utilisateur2)
 * La demande signée par le chef d'établissement (suffixe _SIGNE) remplace celle de l'agent.
 */
@Component({
  selector: 'app-permutation-pieces-jointes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './permutation-pieces-jointes.component.html',
  styleUrls: ['./permutation-pieces-jointes.component.css']
})
export class PermutationPiecesJointesComponent {

  @Input() permutation?: PermutationDTO;

  constructor(private readonly fileService: FileService) { }

  documents(fileCode: string): FileDTO[] {
    return (this.permutation?.pieceJointes || []).filter(doc => doc.fileCode === fileCode);
  }

  // une seule demande par agent : la version la plus avancée (IA, IEF, chef d'établissement, sinon celle de l'agent)
  demandeAgent(codeAgent: string): FileDTO[] {
    return demandeCourante(this.permutation, codeAgent);
  }

  estSignee(codeAgent: string): boolean {
    return this.demandeAgent(codeAgent).some(doc => doc.fileCode?.startsWith(`${codeAgent}_SIGNE`));
  }

  /**
   * Signatures successives de la demande : chef d'établissement, IEF (si la permutation passe par les IEF), IA.
   * Chaque niveau signe à son tour la demande déjà signée par le niveau précédent.
   */
  etapesSignature(codeAgent: string): { libelle: string, signee: boolean }[] {
    const passeParIef = !!(this.permutation?.utilisateur1 as any)?.ief && !!(this.permutation?.utilisateur2 as any)?.ief;
    const niveaux = [
      { libelle: "Chef d'établissement", code: `${codeAgent}_SIGNE` },
      ...(passeParIef ? [{ libelle: 'IEF', code: `${codeAgent}_SIGNE_IEF` }] : []),
      { libelle: 'IA', code: `${codeAgent}_SIGNE_IA` },
    ];
    const ordre = [`${codeAgent}_SIGNE`, `${codeAgent}_SIGNE_IEF`, `${codeAgent}_SIGNE_IA`];
    const atteint = ordre.indexOf(this.demandeAgent(codeAgent)[0]?.fileCode || '');
    return niveaux.map(niveau => ({ libelle: niveau.libelle, signee: ordre.indexOf(niveau.code) <= atteint }));
  }

  get bordereaux(): FileDTO[] {
    return (this.permutation?.pieceJointes || []).filter(doc => doc.fileCode?.startsWith('BORDEREAU_'));
  }

  libelleBordereau(doc: FileDTO): string {
    return doc.fileCode?.startsWith('BORDEREAU_IA') ? "Bordereau de l'IA" : "Bordereau de l'IEF";
  }

  visualiser(doc: FileDTO) {
    if (doc?.generatedName)
      this.fileService.openPdfInNewTab(doc.generatedName);
  }

  telecharger(doc: FileDTO) {
    if (doc?.generatedName)
      this.fileService.telecharger(doc.generatedName);
  }
}
