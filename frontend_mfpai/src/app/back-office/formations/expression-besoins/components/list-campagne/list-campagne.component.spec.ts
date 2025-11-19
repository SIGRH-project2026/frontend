import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCampagneComponent } from './list-campagne.component';

describe('ListCampagneComponent', () => {
  let component: ListCampagneComponent;
  let fixture: ComponentFixture<ListCampagneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListCampagneComponent]
    });
    fixture = TestBed.createComponent(ListCampagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
