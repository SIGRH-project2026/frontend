import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraitementDemandeRecueComponent } from './traitement-demande-recue.component';

describe('TraitementDemandeRecueComponent', () => {
  let component: TraitementDemandeRecueComponent;
  let fixture: ComponentFixture<TraitementDemandeRecueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TraitementDemandeRecueComponent]
    });
    fixture = TestBed.createComponent(TraitementDemandeRecueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
