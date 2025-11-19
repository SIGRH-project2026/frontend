import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExpressionComponent } from './list-expression.component';

describe('ListExpressionComponent', () => {
  let component: ListExpressionComponent;
  let fixture: ComponentFixture<ListExpressionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListExpressionComponent]
    });
    fixture = TestBed.createComponent(ListExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
