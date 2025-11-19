import { TestBed } from '@angular/core/testing';

import { DossierAgentService } from './dossier-agent.service';

describe('DossierAgentService', () => {
  let service: DossierAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DossierAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
