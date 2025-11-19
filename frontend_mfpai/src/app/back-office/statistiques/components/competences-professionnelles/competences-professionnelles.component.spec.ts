import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencesProfessionnellesComponent } from './competences-professionnelles.component';

describe('CompetencesProfessionnellesComponent', () => {
  let component: CompetencesProfessionnellesComponent;
  let fixture: ComponentFixture<CompetencesProfessionnellesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompetencesProfessionnellesComponent]
    });
    fixture = TestBed.createComponent(CompetencesProfessionnellesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
