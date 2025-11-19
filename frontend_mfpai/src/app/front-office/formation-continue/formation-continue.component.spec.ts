import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationContinueComponent } from './formation-continue.component';

describe('FormationContinueComponent', () => {
  let component: FormationContinueComponent;
  let fixture: ComponentFixture<FormationContinueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormationContinueComponent]
    });
    fixture = TestBed.createComponent(FormationContinueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
