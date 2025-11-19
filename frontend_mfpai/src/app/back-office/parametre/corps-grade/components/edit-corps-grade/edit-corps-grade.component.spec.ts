import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCorpsGradeComponent } from './edit-corps-grade.component';

describe('EditCorpsGradeComponent', () => {
  let component: EditCorpsGradeComponent;
  let fixture: ComponentFixture<EditCorpsGradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCorpsGradeComponent]
    });
    fixture = TestBed.createComponent(EditCorpsGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
