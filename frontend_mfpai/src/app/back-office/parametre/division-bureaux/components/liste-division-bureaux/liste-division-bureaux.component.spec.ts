import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDivisionBureauxComponent } from './liste-division-bureaux.component';

describe('ListeDivisionBureauxComponent', () => {
  let component: ListeDivisionBureauxComponent;
  let fixture: ComponentFixture<ListeDivisionBureauxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeDivisionBureauxComponent]
    });
    fixture = TestBed.createComponent(ListeDivisionBureauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
