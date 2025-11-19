import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlanFormationComponent } from './list-plan-formation.component';

describe('ListPlanFormationComponent', () => {
  let component: ListPlanFormationComponent;
  let fixture: ComponentFixture<ListPlanFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListPlanFormationComponent]
    });
    fixture = TestBed.createComponent(ListPlanFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
