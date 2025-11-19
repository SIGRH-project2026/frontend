import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonnerAvisDemandeComponent } from './donner-avis-demande.component';

describe('DonnerAvisDemandeComponent', () => {
  let component: DonnerAvisDemandeComponent;
  let fixture: ComponentFixture<DonnerAvisDemandeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonnerAvisDemandeComponent]
    });
    fixture = TestBed.createComponent(DonnerAvisDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
