import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffairesSocialesComponent } from './affaires-sociales.component';

describe('AffairesSocialesComponent', () => {
  let component: AffairesSocialesComponent;
  let fixture: ComponentFixture<AffairesSocialesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffairesSocialesComponent]
    });
    fixture = TestBed.createComponent(AffairesSocialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
