import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFiliereComponent } from './add-filiere.component';

describe('AddFiliereComponent', () => {
  let component: AddFiliereComponent;
  let fixture: ComponentFixture<AddFiliereComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddFiliereComponent]
    });
    fixture = TestBed.createComponent(AddFiliereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
