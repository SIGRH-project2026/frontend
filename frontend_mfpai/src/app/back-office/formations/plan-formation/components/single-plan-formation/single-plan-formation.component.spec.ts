import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePlanFormationComponent } from './single-plan-formation.component';

describe('SinglePlanFormationComponent', () => {
  let component: SinglePlanFormationComponent;
  let fixture: ComponentFixture<SinglePlanFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinglePlanFormationComponent]
    });
    fixture = TestBed.createComponent(SinglePlanFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
