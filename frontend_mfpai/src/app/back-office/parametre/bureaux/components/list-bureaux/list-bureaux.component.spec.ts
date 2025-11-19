import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBureauxComponent } from './list-bureaux.component';

describe('ListBureauxComponent', () => {
  let component: ListBureauxComponent;
  let fixture: ComponentFixture<ListBureauxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListBureauxComponent]
    });
    fixture = TestBed.createComponent(ListBureauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
