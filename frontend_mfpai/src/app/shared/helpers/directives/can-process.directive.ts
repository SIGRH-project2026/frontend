import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appCanProcess]'
})
export class CanProcessDirective {


 constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) { }
  
  @Input('appCanProcessDemande') demande: any;
  @Input('appCanProcessUtilisateur') utilisateurConnectedProfil: any;

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
   console.log({dem : this.demande, user : this.utilisateurConnectedProfil});
   
    const canProcess = this.demande.profilDevantTraiter=== this.utilisateurConnectedProfil ;
    if (canProcess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
