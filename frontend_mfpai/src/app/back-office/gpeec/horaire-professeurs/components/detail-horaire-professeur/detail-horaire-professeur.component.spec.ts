import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailHoraireProfesseurComponent } from './detail-horaire-professeur.component';

describe('DetailHoraireProfesseurComponent', () => {
  let component: DetailHoraireProfesseurComponent;
  let fixture: ComponentFixture<DetailHoraireProfesseurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailHoraireProfesseurComponent]
    });
    fixture = TestBed.createComponent(DetailHoraireProfesseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
