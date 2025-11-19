import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgcaaComponent } from './dgcaa.component';

describe('DgcaaComponent', () => {
  let component: DgcaaComponent;
  let fixture: ComponentFixture<DgcaaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DgcaaComponent]
    });
    fixture = TestBed.createComponent(DgcaaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
