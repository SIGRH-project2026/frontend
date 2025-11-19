import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleDemandeComponent } from './nouvelle-demande.component';

describe('NouvelleDemandeComponent', () => {
  let component: NouvelleDemandeComponent;
  let fixture: ComponentFixture<NouvelleDemandeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NouvelleDemandeComponent]
    });
    fixture = TestBed.createComponent(NouvelleDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
