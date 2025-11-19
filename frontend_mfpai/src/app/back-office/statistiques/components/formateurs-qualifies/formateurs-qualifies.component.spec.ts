import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormateursQualifiesComponent } from './formateurs-qualifies.component';

describe('FormateursQualifiesComponent', () => {
  let component: FormateursQualifiesComponent;
  let fixture: ComponentFixture<FormateursQualifiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormateursQualifiesComponent]
    });
    fixture = TestBed.createComponent(FormateursQualifiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
