import { TestBed } from '@angular/core/testing';

import { BesoinEnPersonnelService } from './besoin-en-personnel.service';

describe('BesoinEnPersonnelService', () => {
  let service: BesoinEnPersonnelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BesoinEnPersonnelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
