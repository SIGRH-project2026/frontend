import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteFormationComponent } from './complete-formation.component';

describe('CompleteFormationComponent', () => {
  let component: CompleteFormationComponent;
  let fixture: ComponentFixture<CompleteFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompleteFormationComponent]
    });
    fixture = TestBed.createComponent(CompleteFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
