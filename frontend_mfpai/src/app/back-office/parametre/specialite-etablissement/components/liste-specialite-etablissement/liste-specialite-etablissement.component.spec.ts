import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeSpecialiteEtablissementComponent } from './liste-specialite-etablissement.component';

describe('ListeSpecialiteEtablissementComponent', () => {
  let component: ListeSpecialiteEtablissementComponent;
  let fixture: ComponentFixture<ListeSpecialiteEtablissementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeSpecialiteEtablissementComponent]
    });
    fixture = TestBed.createComponent(ListeSpecialiteEtablissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
