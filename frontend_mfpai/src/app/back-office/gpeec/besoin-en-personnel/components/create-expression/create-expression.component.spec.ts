import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExpressionComponent } from './create-expression.component';

describe('CreateExpressionComponent', () => {
  let component: CreateExpressionComponent;
  let fixture: ComponentFixture<CreateExpressionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateExpressionComponent]
    });
    fixture = TestBed.createComponent(CreateExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }); 

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
