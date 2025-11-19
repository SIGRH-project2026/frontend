import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelEncadrementComponent } from './personnel-encadrement.component';

describe('PersonnelEncadrementComponent', () => {
  let component: PersonnelEncadrementComponent;
  let fixture: ComponentFixture<PersonnelEncadrementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonnelEncadrementComponent]
    });
    fixture = TestBed.createComponent(PersonnelEncadrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
