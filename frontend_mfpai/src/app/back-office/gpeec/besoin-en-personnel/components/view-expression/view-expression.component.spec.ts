import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExpressionComponent } from './view-expression.component';

describe('ViewExpressionComponent', () => {
  let component: ViewExpressionComponent;
  let fixture: ComponentFixture<ViewExpressionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewExpressionComponent]
    });
    fixture = TestBed.createComponent(ViewExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
