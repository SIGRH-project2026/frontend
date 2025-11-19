import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFormationComponent } from './single-formation.component';

describe('SingleFormationComponent', () => {
  let component: SingleFormationComponent;
  let fixture: ComponentFixture<SingleFormationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleFormationComponent]
    });
    fixture = TestBed.createComponent(SingleFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
