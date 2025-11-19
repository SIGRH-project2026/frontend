import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPlanFormationComponent } from './view-plan-formation.component';

describe('ViewPlanFormationComponent', () => {
  let component: ViewPlanFormationComponent;
  let fixture: ComponentFixture<ViewPlanFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPlanFormationComponent]
    });
    fixture = TestBed.createComponent(ViewPlanFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
