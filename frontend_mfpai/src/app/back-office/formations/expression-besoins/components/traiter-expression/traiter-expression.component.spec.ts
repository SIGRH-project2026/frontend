import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraiterExpressionComponent } from './traiter-expression.component';

describe('TraiterExpressionComponent', () => {
  let component: TraiterExpressionComponent;
  let fixture: ComponentFixture<TraiterExpressionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TraiterExpressionComponent]
    });
    fixture = TestBed.createComponent(TraiterExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
