import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailViewDemandeComponent } from './detail-view-demande.component';

describe('DetailViewDemandeComponent', () => {
  let component: DetailViewDemandeComponent;
  let fixture: ComponentFixture<DetailViewDemandeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailViewDemandeComponent]
    });
    fixture = TestBed.createComponent(DetailViewDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
