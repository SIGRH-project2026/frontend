import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActeComponent } from './add-acte.component';

describe('AddActeComponent', () => {
  let component: AddActeComponent;
  let fixture: ComponentFixture<AddActeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddActeComponent]
    });
    fixture = TestBed.createComponent(AddActeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
