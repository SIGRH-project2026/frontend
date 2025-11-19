import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCampagneComponent } from './view-campagne.component';

describe('ViewCampagneComponent', () => {
  let component: ViewCampagneComponent;
  let fixture: ComponentFixture<ViewCampagneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCampagneComponent]
    });
    fixture = TestBed.createComponent(ViewCampagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
