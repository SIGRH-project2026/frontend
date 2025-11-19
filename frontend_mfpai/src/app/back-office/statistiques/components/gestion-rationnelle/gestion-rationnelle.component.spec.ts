import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRationnelleComponent } from './gestion-rationnelle.component';

describe('GestionRationnelleComponent', () => {
  let component: GestionRationnelleComponent;
  let fixture: ComponentFixture<GestionRationnelleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionRationnelleComponent]
    });
    fixture = TestBed.createComponent(GestionRationnelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
