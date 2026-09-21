import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { EditMutationComponent } from './edit-mutation.component';

describe('Modification du dossier de mutation', () => {
  let component: EditMutationComponent;
  let uploads: jasmine.Spy;
  let patch: jasmine.Spy;
  beforeEach(() => {
    component = Object.create(EditMutationComponent.prototype);
    component.idMutation = 1;
    component.typeDestinationSouhaitee = 'DEC';
    component.saving = false;
    component.piecesJointesFiles = [new File(['dossier'], 'corrige.pdf')];
    component.region = [{code: 'R'}];
    component.ia = [{code: 'IA'}];
    component.ief = [];
    component.etablissement = [{code: 'E'}];
    component.demandePecForm = {invalid: false, value: {region: 'R', ia: 'IA', etablissement: 'E', commentaire: 'Corrigé'}} as any;
    uploads = jasmine.createSpy().and.returnValue(of({status: 'OK'}));
    patch = jasmine.createSpy().and.returnValue(of({status: 'OK'}));
    Object.assign(component, {fileService: {storeMultipleFiles: uploads}, mutationService: {patch}, router: {navigate: jasmine.createSpy()}});
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({isConfirmed: false}) as any);
  });

  it('joint le dossier avant de soumettre la modification', () => {
    component.onSaveDemande();
    expect(uploads).toHaveBeenCalledWith(1, 'mutationDemande', jasmine.any(Array));
    expect(patch).toHaveBeenCalledWith(1, jasmine.objectContaining({destinataireType: 'DEC', commentaire: 'Corrigé'}));
    expect(uploads).toHaveBeenCalledBefore(patch);
    expect(component.piecesJointesFiles.length).toBe(0);
    expect(component.saving).toBeFalse();
  });

  it('ne soumet pas la modification si le dépôt du dossier échoue', () => {
    uploads.and.returnValue(of({status: 'EXCEPTION'}));
    component.onSaveDemande();
    expect(patch).not.toHaveBeenCalled();
    expect(component.piecesJointesFiles.length).toBe(1);
    expect(component.saving).toBeFalse();
  });
});
