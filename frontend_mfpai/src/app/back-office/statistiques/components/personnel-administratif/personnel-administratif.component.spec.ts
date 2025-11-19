import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelAdministratifComponent } from './personnel-administratif.component';

describe('PersonnelAdministratifComponent', () => {
  let component: PersonnelAdministratifComponent;
  let fixture: ComponentFixture<PersonnelAdministratifComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonnelAdministratifComponent]
    });
    fixture = TestBed.createComponent(PersonnelAdministratifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
