import { ListMutationPermutationComponent } from './list-mutation-permutation.component';
import { MutationDTO } from '../../../demandes-mutation-permutation-recues/models/mutationDTO';

describe('Accès au traitement des mutations', () => {
  let component: ListMutationPermutationComponent;
  let mutation: MutationDTO;

  beforeEach(() => {
    component = Object.create(ListMutationPermutationComponent.prototype);
    component.userId = 10;
    component.profilConnecte = [{ code: 'Agent' }, { code: 'Chef-etablissement' }];
    component.user = { division: { code: 'DFC' }, etablissement: { code: 'ETAB1' } } as any;
    mutation = {
      demandeur: { id: 20 },
      profilDevantTraiter: 'Chef-etablissement',
      origineDemandeurLog: { division: { code: 'DFC' }, etablissement: { code: 'ETAB1' } }
    } as MutationDTO;
  });

  it('reconnaît le supérieur même lorsque son profil est en deuxième position', () => {
    for (const code of ['Chef-etablissement', 'Chef-cfp', 'Chef-EFF', 'Directeur-DRH']) {
      component.profilConnecte = [{ code: 'Agent' }, { code }];
      mutation.profilDevantTraiter = code;
      expect(component.doitTraiter(mutation)).toBeTrue();
    }
  });

  it('refuse un autre profil et le traitement de sa propre demande', () => {
    mutation.profilDevantTraiter = 'Directeur-DRH';
    expect(component.doitTraiter(mutation)).toBeFalse();
    mutation.profilDevantTraiter = 'Chef-etablissement';
    mutation.demandeur.id = component.userId;
    expect(component.doitTraiter(mutation)).toBeFalse();
  });

  it('refuse le chef d’un autre établissement', () => {
    component.user.etablissement.code = 'ETAB2';
    expect(component.doitTraiter(mutation)).toBeFalse();
  });

  it('autorise le traitement après ventilation DRH mais pas après traitement DPEEC', () => {
    component.profilConnecte = [{code: 'Chef-division-dgpeec'}];
    mutation.profilDevantTraiter = 'Chef-division-dgpeec';
    mutation.traitementMutation = {statut: {code: 'REC-DRH'}} as any;
    expect(component.doitTraiter(mutation)).toBeTrue();
    mutation.traitementMutation = {statut: {code: 'REC-DGPEEC'}} as any;
    expect(component.doitTraiter(mutation)).toBeFalse();
  });

  it('exige le rôle de chef et la même division pour un profil générique', () => {
    mutation.profilDevantTraiter = 'Chef-division';
    expect(component.doitTraiter(mutation)).toBeFalse();
    component.profilConnecte = [{ code: 'Chef-division-dfc' }];
    expect(component.doitTraiter(mutation)).toBeTrue();
    component.user.division.code = 'AUTRE';
    expect(component.doitTraiter(mutation)).toBeFalse();
    component.user = {} as any;
    expect(component.doitTraiter(mutation)).toBeFalse();
  });
});
