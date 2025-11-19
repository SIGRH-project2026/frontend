import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDesImputationsBulletinComponent } from './liste-des-imputations-bulletin.component';

describe('ListeDesImputationsBulletinComponent', () => {
  let component: ListeDesImputationsBulletinComponent;
  let fixture: ComponentFixture<ListeDesImputationsBulletinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeDesImputationsBulletinComponent]
    });
    fixture = TestBed.createComponent(ListeDesImputationsBulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
