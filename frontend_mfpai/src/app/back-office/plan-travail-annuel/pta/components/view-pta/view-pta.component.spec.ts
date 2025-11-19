import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPtaComponent } from './view-pta.component';

describe('ViewPtaComponent', () => {
  let component: ViewPtaComponent;
  let fixture: ComponentFixture<ViewPtaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPtaComponent]
    });
    fixture = TestBed.createComponent(ViewPtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
