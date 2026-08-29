
import { Directive, Input, ElementRef } from '@angular/core';

enum Color {
  White = 'rgba(255, 255, 255, 1)',
  DarkGray = 'rgba(75, 72, 72, 1)',
  Orange = 'rgba(247, 144, 9, 1)',
  Green = 'rgba(10, 151, 72, 1)',
  Red = 'rgba(255, 77, 79, 1)',
  Blue = 'rgba(29, 74, 123, 1)',
}

enum Background {
  LightGray = 'rgba(245, 246, 250, 1)',
  OrangeLight = 'rgba(247, 144, 9, 0.20)',
  GreenLight = 'rgba(10, 151, 72, 0.20)',
  RedLight = 'rgba(255, 77, 79, 0.20)',
  BlueLight = 'rgba(29, 74, 123, .20)',
}

interface StatusStyle {
  backgroundColor: Background;
  color: Color;
  text: string;
}

@Directive({
  selector: '[appStatus]',
})
export class StatusDirective {
  constructor(private elementRef: ElementRef) {}

  private setStatusStyles(status: string | boolean): StatusStyle {
    switch (status) {
      case 'SOUMIS':
      case 'SOUMISE':
      case 'NONTRAITER':
      case 'NONTRAITEER':
      case 'NONDEMARRER':
      case 'NONDEMARREER':
      case 'ENREGISTRER':
      case 'ENREGISTREER':
      case 'ENVOYER':
      case 'ENVOYEER':
        return {
          backgroundColor: Background.LightGray,
          color: Color.DarkGray,
          text:
              status === 'SOUMIS' ? 'Soumis' :
                  status === 'SOUMISE' ? 'Soumise' :
                      status === 'NONDEMARRER' ? 'Non Démarré' :
                          status === 'NONDEMARREER' ? 'Non Démarrée' :
                              status === 'ENREGISTRER' ? 'Enregistré' :
                                  status === 'ENREGISTREER' ? 'Enregistrée' :
                                      status === 'ENVOYER' ? 'Envoyé' :
                                          status === 'ENVOYEER' ? 'Envoyée' :
                                              status === 'NONTRAITER' ? 'Non Traité' :
                                                  'Non Traitée',
        };

      case 'ENCOURS':
      case 'AMODIFIER':
      case 'NONDISPONIBLE':
        return {
          backgroundColor: Background.OrangeLight,
          color: Color.Orange,
          text:
              status === 'ENCOURS' ? 'En cours' :
                  status === 'AMODIFIER' ? 'À modifier' : 'Non disponible',
        };

      case 'DISPONIBLE':
      case 'TRAITER':
      case 'TRAITEER':
      case 'VALIDER':
      case 'VALIDE':
      case 'VALIDESUP':
      case 'VALIDEDIV':
      case 'VALIDESER':
      case 'VALIDEDGCAA':
      case 'VALIDEE':
      case 'VALIDEER':
      case 'DEMARRER':
      case 'AUTORISER':
      case 'AUTORISEER':
      case 'VALIDECE':
      case 'VALIDEIA':
      case 'VALIDEIEF':
      case 'APPROUVER':
      case 'APPROUVEER':
      case 'ACTIVER':
      case 'ACTIVEER':
        return {
          backgroundColor: Background.GreenLight,
          color: Color.Green,
          text:  status === 'DISPONIBLE' ? 'Disponible' :
              status === 'TRAITER' ? 'Traité' :
                  status === 'TRAITEER' ? 'Traitée' :
                status === 'ACTIVER' ? 'Activé' :
                  status === 'ACTIVEER' ? 'Activée' :
                      status === 'AUTORISER' ? 'Autorisé' :
                          status === 'AUTORISEER' ? 'Autorisée' :
                              status === 'APPROUVER' ? 'Approuvé' :
                                  status === 'APPROUVEER' ? 'Approuvée' :
                                      status === 'VALIDE' || status === 'VALIDEE' || status === 'VALIDER' ? 'Validé' :
                                          status === 'VALIDEDIV' ? 'Valide Division' :
                                              status === 'VALIDESER' ? 'Valide Service' :
                                                  status === 'VALIDESUP' ? 'Valide N+1' :
                                                      status === 'VALIDEDGCAA' ? 'Validée' :
                                                              status === 'VALIDECE' ? 'Valide CE' :
                                                                  status === 'VALIDEIA' ? 'Valide IA' :
                                                                      status === 'VALIDEIEF' ? 'Valide IEF' :
                                                                          'Démarré'
        };

      case true:
        return {
          backgroundColor: Background.GreenLight,
          color: Color.Green,
          text: 'Actif',
        };

      case false:
        return {
          backgroundColor: Background.RedLight,
          color: Color.Red,
          text: 'Inactif',
        };

      case 'CLOTURER':
      case 'CLOTUREER':
      case 'INVALIDER':
      case 'INVALIDE':
      case 'INVALIDEDIV':
      case 'INVALIDESUP':
      case 'INVALIDEDRH':
      case 'INVALIDEDGCAA':
      case 'INVALIDECE':
      case 'INVALIDEIEF':
      case 'INVALIDEIA':
      case 'REJETEER':
      case 'REJETEE':
      case 'REJETE':
      case 'REJETER':
        case 'REJETERMUT':
      case 'NONAUTORISER':
      case 'NONAUTORISEER':
      case 'REFUSER':
      case 'REFUSEER':
      case 'DESACTIVER':
      case 'DESACTIVEER':
        return {
          backgroundColor: Background.RedLight,
          color: Color.Red,
          text:
              status === 'CLOTURER' ? 'Clôturé' :
              status === 'CLOTUREER' ? 'Clôturée' :
                status === 'DESACTIVER' ? 'Désactivé' :
                  status === 'DESACTIVEER' ? 'Désactivée' :
                      status === 'INVALIDE' ?  'Rejeté' :
                          status === 'INVALIDEDIV' ?  'Non accordée' :
                              status === 'INVALIDESUP' ?  'Non accordée' :
                                  status === 'INVALIDEDRH' ?  'Rejeté' :
                                      status === 'INVALIDEDGCAA' ?  'Non accordée' :
                                          status === 'INVALIDECE' ?  'Non accordée' :
                                              status === 'INVALIDEIEF' ?  'Rejeté' :
                                                  status === 'INVALIDEIA' ?  'Rejeté' :
                                                      status === 'REJETEE' ? 'Rejetée' :
                                                          status === 'REJETE' ? 'Rejeté' :
                                                          status === 'REJETERMUT' ? 'Non accordée' :


                                                              status === 'NONAUTORISER' ? 'Non Autorisé' :
                                                                  status === 'NONAUTORISEER' ? 'Non Autorisée' :
                                                                      status === 'REFUSER' ? 'Refusé' :
                                                                          status === 'REFUSEER' ? 'Refusée' :
                                                                              status === 'INVALIDER' ? 'Invalidé' : 'Rejetée',
        };

      case 'RECUDGCAA':
      case 'ENCOURSDGCAA':
      case 'PUBLIER':
      case 'PUBLIEER':
      case 'ACCEPTEER':
      case 'ACCEPTER':
      case 'RECUE':
      case 'REC-CE-IEF' :
      case 'REC-CE-IA' :
      case 'REC-IEF' :
      case 'REC-IA' :
      case 'REC-DRH' :
      case 'RECU-DRH' :
      case 'REC-DGPEEC' :
      case 'REC-DIV' :
      case 'REC-SERV' :
      case 'REC-DR-CFP' :
      case 'REC-DR-EFF' :
        return {
          backgroundColor: Background.BlueLight,
          color: Color.Blue,
          text:
              status === 'RECUDGCAA' ? 'Reçu DGCAA' :
                  status === 'ENCOURSDGCAA' ? 'En cours de  traitement' :
                      status === 'ACCEPTEER' ? 'Acceptée' :
                          status === 'ACCEPTER' ? 'Accepté' :
                              status === 'RECUE' ? 'Reçue' :
                                  status === 'REC-CE-IEF' ? 'Transmise IEF' :
                                  status === 'REC-CE-IA' ? 'Transmise IA' :
                                      status === 'REC-IEF' ? 'Transmise IA' :
                                      status === 'REC-DR-CFP' ? 'Transmise IEF' :
                                      status === 'REC-DR-EFF' ? 'Transmise IEF' :
                                          status === 'REC-IA' ? 'Transmise DRH' :
                                              status === 'REC-DIV' ? 'Transmise DRH' :
                                                  status === 'REC-SERV' ? 'Transmise DRH':
                                              status === 'REC-DRH' ? 'En cours de traitement' :
                                              status === 'RECU-DRH' ? 'Reçu DRH' :
                                                  status === 'REC-DGPEEC' ? 'Traitée DGPEEC' :
                                                      status === 'PUBLIER' ? 'Publié' : 'Publiée'

          ,
        };
      case 'TRANSMISE_IA':
      case 'ENCOURIA':
      case 'ENCOURSA':
      case 'RECUDGPEC':
      case 'TRAITEMENT':
      case 'ENCOURSIAA':
      case 'TRANSMISE_CE':
      case 'TRANSMISE_IEF':
      case 'TRANSMISE_DRH':
      case 'TRAITEE':
        return {
          backgroundColor: Background.BlueLight,
          color: Color.Blue,
          text:
              status === 'TRANSMISE_IA' ? 'Transmise IA' :
                  status === 'ENCOURIA' ? 'En cours IA' :
                      status === 'RECUDGPEC' ? 'Reçue DGPEEC' :
                          status === 'TRAITEMENT' ? 'En cours de traitement' :
                              status === 'TRANSMISE_CE' ? 'Transmise CE' :
                                  status === 'TRANSMISE_IEF' ? 'Transmise IEF' :
                                    status ==='TRANSMISE_DRH'? 'Transmise DRH' :
                                      status === 'TRAITEE' ? 'Traitée DGPEEC' :
                                        status === 'ENCOURSIAA' ? 'En cours IA' : 'En cours IA'

          ,
        };

      default:
        return {
          backgroundColor: Background.LightGray,
          color: Color.DarkGray,
          text: '',
        };
    }
  }

  @Input() set appStatus(status: string | boolean) {
    const statusStyles = this.setStatusStyles(status);
    this.elementRef.nativeElement.style.backgroundColor = statusStyles.backgroundColor;
    this.elementRef.nativeElement.style.color = statusStyles.color;
    this.elementRef.nativeElement.innerHTML = statusStyles.text;
  }
}