import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleActeComponent } from './single-acte.component';

describe('SingleActeComponent', () => {
  let component: SingleActeComponent;
  let fixture: ComponentFixture<SingleActeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleActeComponent]
    });
    fixture = TestBed.createComponent(SingleActeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
