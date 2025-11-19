import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeBesoinEnNbrGapComponent } from './liste-besoin-en-nbr-gap.component';

describe('ListeBesoinEnNbrGapComponent', () => {
  let component: ListeBesoinEnNbrGapComponent;
  let fixture: ComponentFixture<ListeBesoinEnNbrGapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeBesoinEnNbrGapComponent]
    });
    fixture = TestBed.createComponent(ListeBesoinEnNbrGapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
