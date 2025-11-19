import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtaComponent } from './pta.component';

describe('PtaComponent', () => {
  let component: PtaComponent;
  let fixture: ComponentFixture<PtaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PtaComponent]
    });
    fixture = TestBed.createComponent(PtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
