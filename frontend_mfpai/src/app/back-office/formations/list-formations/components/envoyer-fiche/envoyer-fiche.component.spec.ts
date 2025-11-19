import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoyerFicheComponent } from './envoyer-fiche.component';

describe('EnvoyerFicheComponent', () => {
  let component: EnvoyerFicheComponent;
  let fixture: ComponentFixture<EnvoyerFicheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnvoyerFicheComponent]
    });
    fixture = TestBed.createComponent(EnvoyerFicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
