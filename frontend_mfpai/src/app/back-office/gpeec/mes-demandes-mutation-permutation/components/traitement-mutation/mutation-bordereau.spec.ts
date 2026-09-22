import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { TraitementMutationComponent } from './traitement-mutation.component';

describe('Transmission du bordereau et du dossier signé', () => {
  let component: TraitementMutationComponent;
  let transmettre: jasmine.Spy;

  beforeEach(() => {
    component = Object.create(TraitementMutationComponent.prototype);
    Object.assign(component, {
      submitting: false, pourTraitementDGPEEC: false,
      mutation: { id: 1, numeroRef: 'M1', origineDemandeurLog: {} }, userInfos: { id: 2 },
      piecesJointesFiles: [new File(['bordereau'], 'bordereau.pdf')],
      dossierSigneFiles: [new File(['dossier'], 'signe.pdf')],
      spinner: { show: jasmine.createSpy(), hide: jasmine.createSpy() },
      location: { back: jasmine.createSpy() }
    });
    transmettre = jasmine.createSpy().and.returnValue(of({ status: 'OK' }));
    Object.assign(component, { mutationService: { Traitement: transmettre } });
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true }) as any);
  });

  for (const profile of ['Représentant-IEF', 'Representant-IA']) {
    it(`transmet les deux fichiers pour ${profile}`, async () => {
      component.profile = profile;
      component.onValid();
      await Promise.resolve();
      expect(transmettre).toHaveBeenCalledWith(1, component.piecesJointesFiles[0],
        jasmine.objectContaining({ idTraiteur: 2, codeStatutMutation: component.nextStatus(profile) }),
        component.dossierSigneFiles[0]);
    });
  }

  it('bloque la transmission lorsque le bordereau manque', () => {
    component.profile = 'Representant-IA';
    component.piecesJointesFiles = [];
    component.onValid();
    expect(transmettre).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'warning' }));
  });

  for (const profile of ['Chef-etablissement', 'Chef-cfp', 'Chef-EFF', 'Chef-service', 'Chef-division-dfc', 'Directeur-DRH', 'Chef-division-dgpeec']) {
    it(`ne demande pas de nouveau bordereau pour ${profile}`, async () => {
      component.profile = profile;
      component.piecesJointesFiles = [];
      component.onValid();
      await Promise.resolve();
      expect(component.utiliseBordereau).toBeFalse();
      expect(transmettre).toHaveBeenCalledWith(1, undefined, jasmine.anything(), component.dossierSigneFiles[0]);
    });
  }

  it('masque le bordereau chez les chefs d’établissement et le conserve aux étapes suivantes', () => {
    component.mutation.currentBordereauTransmission = 'bordereau.pdf';
    for (const profile of ['Chef-etablissement', 'Chef-cfp', 'Chef-EFF']) {
      component.profile = profile;
      expect(component.bordereauRecuVisible).toBeFalse();
    }
    for (const profile of ['Représentant-IEF', 'Representant-IA', 'Directeur-DRH']) {
      component.profile = profile;
      expect(component.bordereauRecuVisible).toBeTrue();
    }
  });
});
