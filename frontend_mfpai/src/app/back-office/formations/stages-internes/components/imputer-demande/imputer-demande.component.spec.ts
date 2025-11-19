import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImputerDemandeComponent } from './imputer-demande.component';

describe('ImputerDemandeComponent', () => {
  let component: ImputerDemandeComponent;
  let fixture: ComponentFixture<ImputerDemandeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImputerDemandeComponent]
    });
    fixture = TestBed.createComponent(ImputerDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
