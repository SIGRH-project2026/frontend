import { TestBed } from '@angular/core/testing';

import { FicheSynoptiqueService } from './fiche-synoptique.service';

describe('FicheSynoptiqueService', () => {
  let service: FicheSynoptiqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FicheSynoptiqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
