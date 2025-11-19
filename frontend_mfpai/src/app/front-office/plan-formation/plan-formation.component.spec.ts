import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanFormationComponent } from './plan-formation.component';

describe('PlanFormationComponent', () => {
  let component: PlanFormationComponent;
  let fixture: ComponentFixture<PlanFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanFormationComponent]
    });
    fixture = TestBed.createComponent(PlanFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
