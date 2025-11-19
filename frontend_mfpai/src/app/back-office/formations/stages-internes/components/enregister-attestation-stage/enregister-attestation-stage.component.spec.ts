import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnregisterAttestationStageComponent } from './enregister-attestation-stage.component';

describe('EnregisterAttestationStageComponent', () => {
  let component: EnregisterAttestationStageComponent;
  let fixture: ComponentFixture<EnregisterAttestationStageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnregisterAttestationStageComponent]
    });
    fixture = TestBed.createComponent(EnregisterAttestationStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
