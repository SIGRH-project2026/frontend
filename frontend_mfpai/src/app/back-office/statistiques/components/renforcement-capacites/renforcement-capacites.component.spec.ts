import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenforcementCapacitesComponent } from './renforcement-capacites.component';

describe('RenforcementCapacitesComponent', () => {
  let component: RenforcementCapacitesComponent;
  let fixture: ComponentFixture<RenforcementCapacitesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenforcementCapacitesComponent]
    });
    fixture = TestBed.createComponent(RenforcementCapacitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
