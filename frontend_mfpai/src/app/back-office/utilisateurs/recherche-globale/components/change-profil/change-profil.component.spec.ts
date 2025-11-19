import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeProfilComponent } from './change-profil.component';

describe('ChangeProfilComponent', () => {
  let component: ChangeProfilComponent;
  let fixture: ComponentFixture<ChangeProfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeProfilComponent]
    });
    fixture = TestBed.createComponent(ChangeProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
