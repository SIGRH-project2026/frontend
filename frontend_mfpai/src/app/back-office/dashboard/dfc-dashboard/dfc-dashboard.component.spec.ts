import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DFCDASHBOARDComponent } from './dfc-dashboard.component';

describe('DFCDASHBOARDComponent', () => {
  let component: DFCDASHBOARDComponent;
  let fixture: ComponentFixture<DFCDASHBOARDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DFCDASHBOARDComponent]
    });
    fixture = TestBed.createComponent(DFCDASHBOARDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
