import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencesMisesAJourComponent } from './competences-mises-a-jour.component';

describe('CompetencesMisesAJourComponent', () => {
  let component: CompetencesMisesAJourComponent;
  let fixture: ComponentFixture<CompetencesMisesAJourComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompetencesMisesAJourComponent]
    });
    fixture = TestBed.createComponent(CompetencesMisesAJourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
