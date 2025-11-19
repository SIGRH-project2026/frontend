import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreateCampagneComponent } from './edit-create-campagne.component';

describe('EditCreateCampagneComponent', () => {
  let component: EditCreateCampagneComponent;
  let fixture: ComponentFixture<EditCreateCampagneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCreateCampagneComponent]
    });
    fixture = TestBed.createComponent(EditCreateCampagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
