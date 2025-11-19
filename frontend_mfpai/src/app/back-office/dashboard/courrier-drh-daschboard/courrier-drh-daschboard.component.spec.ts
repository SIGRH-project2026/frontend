import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourrierDRHDaschboardComponent } from './courrier-drh-daschboard.component';

describe('CourrierDRHDaschboardComponent', () => {
  let component: CourrierDRHDaschboardComponent;
  let fixture: ComponentFixture<CourrierDRHDaschboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourrierDRHDaschboardComponent]
    });
    fixture = TestBed.createComponent(CourrierDRHDaschboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
