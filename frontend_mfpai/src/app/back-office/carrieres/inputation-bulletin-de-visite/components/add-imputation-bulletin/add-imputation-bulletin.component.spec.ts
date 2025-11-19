import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddImputationBulletinComponent } from './add-imputation-bulletin.component';

describe('AddImputationBulletinComponent', () => {
  let component: AddImputationBulletinComponent;
  let fixture: ComponentFixture<AddImputationBulletinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddImputationBulletinComponent]
    });
    fixture = TestBed.createComponent(AddImputationBulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
