import { TestBed } from '@angular/core/testing';

import { ImputationOuBulletinService } from './ImputationOuBulletin.service';

describe('DossierAgentService', () => {
  let service: ImputationOuBulletinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImputationOuBulletinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
