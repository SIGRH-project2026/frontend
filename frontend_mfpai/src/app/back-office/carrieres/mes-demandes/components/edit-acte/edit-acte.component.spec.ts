import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActeComponent } from './edit-acte.component';

describe('EditActeComponent', () => {
  let component: EditActeComponent;
  let fixture: ComponentFixture<EditActeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditActeComponent]
    });
    fixture = TestBed.createComponent(EditActeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
