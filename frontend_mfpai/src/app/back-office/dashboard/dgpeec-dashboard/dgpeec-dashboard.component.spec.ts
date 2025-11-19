import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DGPEECDASHBOARDComponent } from './dgpeec-dashboard.component';

describe('DGPEECDASHBOARDComponent', () => {
  let component: DGPEECDASHBOARDComponent;
  let fixture: ComponentFixture<DGPEECDASHBOARDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DGPEECDASHBOARDComponent]
    });
    fixture = TestBed.createComponent(DGPEECDASHBOARDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
