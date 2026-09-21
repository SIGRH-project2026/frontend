import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { ListMutationPermutationComponent } from './list-mutation-permutation.component';

describe('Génération OS mutation', () => {
  it('attend le téléchargement avant d’annoncer le succès', async () => {
    const component = Object.create(ListMutationPermutationComponent.prototype);
    component.mutationService = {genererOS: () => of({status: 'OK', payload: 'os.pdf'})};
    const download = spyOn(component, 'Telecharger');
    const popup = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({}) as any);
    spyOn(component, 'listmutations');
    component.genererOSMutation(false, 1);
    expect(download).toHaveBeenCalledWith('os.pdf', jasmine.any(Function));
    expect(popup).not.toHaveBeenCalled();
    (download.calls.mostRecent().args[1] as () => void)();
    expect(popup).toHaveBeenCalledWith(jasmine.objectContaining({icon: 'success'}));
    await Promise.resolve();
    expect(component.listmutations).toHaveBeenCalled();
  });

  it('affiche le message serveur si la génération échoue', () => {
    const component = Object.create(ListMutationPermutationComponent.prototype);
    component.mutationService = {genererOS: () => of({status: 'EXCEPTION', message: 'Stockage indisponible'})};
    const error = spyOn(component, 'showOsError');
    const download = spyOn(component, 'Telecharger');
    component.genererOSMutation(false, 1);
    expect(error).toHaveBeenCalledWith('Stockage indisponible');
    expect(download).not.toHaveBeenCalled();
  });
});
