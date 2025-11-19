import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnregisterRapportStageComponent } from './enregister-rapport-stage.component';

describe('EnregisterRapportStageComponent', () => {
  let component: EnregisterRapportStageComponent;
  let fixture: ComponentFixture<EnregisterRapportStageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnregisterRapportStageComponent]
    });
    fixture = TestBed.createComponent(EnregisterRapportStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
