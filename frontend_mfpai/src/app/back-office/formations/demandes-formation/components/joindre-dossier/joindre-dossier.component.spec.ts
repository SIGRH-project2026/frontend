import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoindreDossierComponent } from './joindre-dossier.component';

describe('JoindreDossierComponent', () => {
  let component: JoindreDossierComponent;
  let fixture: ComponentFixture<JoindreDossierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoindreDossierComponent]
    });
    fixture = TestBed.createComponent(JoindreDossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
