import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePtaComponent } from './single-pta.component';

describe('SinglePtaComponent', () => {
  let component: SinglePtaComponent;
  let fixture: ComponentFixture<SinglePtaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinglePtaComponent]
    });
    fixture = TestBed.createComponent(SinglePtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
