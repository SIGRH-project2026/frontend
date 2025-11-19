import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleExpressionComponent } from './single-expression.component';

describe('SingleExpressionComponent', () => {
  let component: SingleExpressionComponent;
  let fixture: ComponentFixture<SingleExpressionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleExpressionComponent]
    });
    fixture = TestBed.createComponent(SingleExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
