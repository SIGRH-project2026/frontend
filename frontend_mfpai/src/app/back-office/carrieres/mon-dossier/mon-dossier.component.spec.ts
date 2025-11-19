import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonDossierComponent } from './mon-dossier.component';

describe('MonDossierComponent', () => {
  let component: MonDossierComponent;
  let fixture: ComponentFixture<MonDossierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonDossierComponent]
    });
    fixture = TestBed.createComponent(MonDossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
