import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoyerOffresTechniquesComponent } from './envoyer-offres-techniques.component';

describe('EnvoyerOffresTechniquesComponent', () => {
  let component: EnvoyerOffresTechniquesComponent;
  let fixture: ComponentFixture<EnvoyerOffresTechniquesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnvoyerOffresTechniquesComponent]
    });
    fixture = TestBed.createComponent(EnvoyerOffresTechniquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
