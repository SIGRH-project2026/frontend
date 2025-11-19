import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoumettreExpressionComponent } from './soumettre-expression.component';

describe('SoumettreExpressionComponent', () => {
  let component: SoumettreExpressionComponent;
  let fixture: ComponentFixture<SoumettreExpressionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SoumettreExpressionComponent]
    });
    fixture = TestBed.createComponent(SoumettreExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
