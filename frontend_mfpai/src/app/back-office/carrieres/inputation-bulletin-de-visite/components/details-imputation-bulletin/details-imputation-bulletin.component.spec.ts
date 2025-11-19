import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsImputationBulletinComponent } from './details-imputation-bulletin.component';

describe('DetailsImputationBulletinComponent', () => {
  let component: DetailsImputationBulletinComponent;
  let fixture: ComponentFixture<DetailsImputationBulletinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsImputationBulletinComponent]
    });
    fixture = TestBed.createComponent(DetailsImputationBulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
