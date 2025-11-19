import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCampagneComponent } from './single-campagne.component';

describe('SingleCampagneComponent', () => {
  let component: SingleCampagneComponent;
  let fixture: ComponentFixture<SingleCampagneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleCampagneComponent]
    });
    fixture = TestBed.createComponent(SingleCampagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
