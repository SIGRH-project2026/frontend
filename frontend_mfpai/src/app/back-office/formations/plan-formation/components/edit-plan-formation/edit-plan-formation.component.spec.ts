import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlanFormationComponent } from './edit-plan-formation.component';

describe('EditPlanFormationComponent', () => {
  let component: EditPlanFormationComponent;
  let fixture: ComponentFixture<EditPlanFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPlanFormationComponent]
    });
    fixture = TestBed.createComponent(EditPlanFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
