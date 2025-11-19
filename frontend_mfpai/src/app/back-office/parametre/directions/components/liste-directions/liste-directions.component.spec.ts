import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDirectionsComponent } from './liste-directions.component';

describe('ListeDirectionsComponent', () => {
  let component: ListeDirectionsComponent;
  let fixture: ComponentFixture<ListeDirectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeDirectionsComponent]
    });
    fixture = TestBed.createComponent(ListeDirectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
