import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDemandeEnPersonnelRecusComponent } from './detail-demande-en-personnel-recus.component';

describe('DetailDemandeEnPersonnelRecusComponent', () => {
  let component: DetailDemandeEnPersonnelRecusComponent;
  let fixture: ComponentFixture<DetailDemandeEnPersonnelRecusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailDemandeEnPersonnelRecusComponent]
    });
    fixture = TestBed.createComponent(DetailDemandeEnPersonnelRecusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
