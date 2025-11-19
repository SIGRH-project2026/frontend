import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlanFormationComponent } from './create-plan-formation.component';

describe('CreatePlanFormationComponent', () => {
  let component: CreatePlanFormationComponent;
  let fixture: ComponentFixture<CreatePlanFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePlanFormationComponent]
    });
    fixture = TestBed.createComponent(CreatePlanFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
