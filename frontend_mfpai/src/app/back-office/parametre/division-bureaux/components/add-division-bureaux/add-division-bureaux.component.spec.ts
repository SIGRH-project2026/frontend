import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDivisionBureauxComponent } from './add-division-bureaux.component';

describe('AddDivisionBureauxComponent', () => {
  let component: AddDivisionBureauxComponent;
  let fixture: ComponentFixture<AddDivisionBureauxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDivisionBureauxComponent]
    });
    fixture = TestBed.createComponent(AddDivisionBureauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
