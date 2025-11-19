import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationDiplomanteComponent } from './formation-diplomante.component';

describe('FormationDiplomanteComponent', () => {
  let component: FormationDiplomanteComponent;
  let fixture: ComponentFixture<FormationDiplomanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormationDiplomanteComponent]
    });
    fixture = TestBed.createComponent(FormationDiplomanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
