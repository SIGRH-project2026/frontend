import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTraitementExpressionComponent } from './form-traitement-expression.component';

describe('FormTraitementExpressionComponent', () => {
  let component: FormTraitementExpressionComponent;
  let fixture: ComponentFixture<FormTraitementExpressionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormTraitementExpressionComponent]
    });
    fixture = TestBed.createComponent(FormTraitementExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
